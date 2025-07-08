"use client"

import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import PoseVisualizer from "./pose-visualizer"
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"

type PoseLandmark = {
  x: number
  y: number
  z: number
  visibility?: number
}

type Feedback = {
  message: string
  isError: boolean
  jointIssue?: string
}

export default function PoseDetection({ exerciseMode }: { exerciseMode: "squat" | "pushup" }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [poseLandmarker, setPoseLandmarker] = useState<any>(null)
  const [landmarks, setLandmarks] = useState<PoseLandmark[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestAnimationRef = useRef<number | null>(null)
  const lastVideoTime = useRef<number>(-1)

  // Initialize MediaPipe Pose Landmarker
  useEffect(() => {
    const initializePoseLandmarker = async () => {
      try {
        setIsLoading(true)

        // Use a more reliable CDN for the wasm files
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        )

        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        })

        setPoseLandmarker(landmarker)
        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing pose landmarker with GPU:", err)
        // Try falling back to CPU
        fallbackToCPU()
      }
    }

    // Add this function after the initializePoseLandmarker function
    const fallbackToCPU = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Falling back to CPU delegate")

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        )

        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "CPU", // Use CPU instead of GPU
          },
          runningMode: "VIDEO",
          numPoses: 1,
        })

        setPoseLandmarker(landmarker)
        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing pose landmarker with CPU:", err)
        setError("Failed to initialize pose detection even with CPU fallback. Your browser may not be compatible.")
        setIsLoading(false)
      }
    }

    initializePoseLandmarker()

    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current)
      }
    }
  }, [])

  // Initialize webcam
  useEffect(() => {
    const initializeWebcam = async () => {
      if (!videoRef.current) return

      try {
        const constraints = {
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        }

        console.log("Requesting media access with constraints:", constraints)
        const stream = await navigator.mediaDevices.getUserMedia(constraints)

        if (!stream) {
          throw new Error("Failed to get media stream")
        }

        console.log("Media stream obtained:", stream)
        videoRef.current.srcObject = stream

        // Add event listeners to handle video loading
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded")
          if (videoRef.current) {
            videoRef.current.play().catch((e) => {
              console.error("Error playing video:", e)
              setError("Failed to play video stream. Please refresh and try again.")
            })
          }
        }

        videoRef.current.onplaying = () => {
          console.log("Video is now playing")
          setIsLoading(false)
          // Start detection loop once video is playing
          if (poseLandmarker) {
            requestAnimationRef.current = requestAnimationFrame(detectPose)
          }
        }

        videoRef.current.onerror = (e) => {
          console.error("Video element error:", e)
          setError("Video element encountered an error. Please refresh and try again.")
        }
      } catch (err) {
        console.error("Error accessing webcam:", err)
        setError(`Failed to access webcam: ${err.message}. Please make sure you have granted camera permissions.`)
        setIsLoading(false)
      }
    }

    if (poseLandmarker) {
      initializeWebcam()
    }

    return () => {
      // Clean up webcam stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [poseLandmarker])

  // Pose detection loop
  const detectPose = async () => {
    if (!videoRef.current || !poseLandmarker || videoRef.current.paused || videoRef.current.ended) {
      requestAnimationRef.current = requestAnimationFrame(detectPose)
      return
    }

    const video = videoRef.current
    const videoTime = video.currentTime

    // Only run detector when we have a new video frame
    if (videoTime !== lastVideoTime.current) {
      lastVideoTime.current = videoTime

      const results = poseLandmarker.detectForVideo(video, videoTime * 1000)

      if (results.landmarks && results.landmarks.length > 0) {
        setLandmarks(results.landmarks[0])

        // Evaluate posture based on exercise mode
        if (exerciseMode === "squat") {
          evaluateSquatPosture(results.landmarks[0])
        } else if (exerciseMode === "pushup") {
          evaluatePushupPosture(results.landmarks[0])
        }
      }
    }

    requestAnimationRef.current = requestAnimationFrame(detectPose)
  }

  // Evaluate squat posture
  const evaluateSquatPosture = (landmarks: PoseLandmark[]) => {
    const newFeedback: Feedback[] = []

    // Get relevant landmarks
    const leftHip = landmarks[23]
    const rightHip = landmarks[24]
    const leftKnee = landmarks[25]
    const rightKnee = landmarks[26]
    const leftAnkle = landmarks[27]
    const rightAnkle = landmarks[28]
    const leftShoulder = landmarks[11]
    const rightShoulder = landmarks[12]

    // Check if in squat position (knees bent)
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
    const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2

    // Calculate back angle (vertical is 0, leaning forward increases angle)
    const leftBackAngle = calculateVerticalAngle(leftShoulder, leftHip)
    const rightBackAngle = calculateVerticalAngle(rightShoulder, rightHip)
    const backAngle = (leftBackAngle + rightBackAngle) / 2

    // Check knee bend (should be around 90 degrees in a deep squat)
    if (kneeAngle > 150) {
      newFeedback.push({
        message: "Bend your knees more for a proper squat depth",
        isError: true,
        jointIssue: "knees",
      })
    } else if (kneeAngle < 80) {
      newFeedback.push({
        message: "Good squat depth",
        isError: false,
      })
    }

    // Check back angle (should be relatively upright, not leaning too far forward)
    if (backAngle > 45) {
      newFeedback.push({
        message: "Keep your back more upright, you're leaning too far forward",
        isError: true,
        jointIssue: "back",
      })
    } else if (backAngle < 30) {
      newFeedback.push({
        message: "Good back position",
        isError: false,
      })
    }

    setFeedback(newFeedback)
  }

  // Evaluate pushup posture
  const evaluatePushupPosture = (landmarks: PoseLandmark[]) => {
    const newFeedback: Feedback[] = []

    // Get relevant landmarks
    const leftShoulder = landmarks[11]
    const rightShoulder = landmarks[12]
    const leftElbow = landmarks[13]
    const rightElbow = landmarks[14]
    const leftWrist = landmarks[15]
    const rightWrist = landmarks[16]
    const leftHip = landmarks[23]
    const rightHip = landmarks[24]
    const leftAnkle = landmarks[27]
    const rightAnkle = landmarks[28]

    // Calculate elbow angle
    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist)
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist)
    const elbowAngle = (leftElbowAngle + rightElbowAngle) / 2

    // Calculate back alignment (should be straight)
    const backAlignment = calculateAlignment(
      [(leftShoulder.x + rightShoulder.x) / 2, (leftShoulder.y + rightShoulder.y) / 2],
      [(leftHip.x + rightHip.x) / 2, (leftHip.y + rightHip.y) / 2],
      [(leftAnkle.x + rightAnkle.x) / 2, (leftAnkle.y + rightAnkle.y) / 2],
    )

    // Check elbow angle (should be around 90 degrees at the bottom of a push-up)
    if (elbowAngle > 120) {
      newFeedback.push({
        message: "Lower your chest more, your elbows should bend to about 90 degrees",
        isError: true,
        jointIssue: "elbows",
      })
    } else if (elbowAngle < 70) {
      newFeedback.push({
        message: "Good depth on your push-up",
        isError: false,
      })
    }

    // Check back alignment (should be straight, not sagging)
    if (backAlignment > 0.05) {
      newFeedback.push({
        message: "Keep your back straight, avoid sagging your hips",
        isError: true,
        jointIssue: "back",
      })
    } else {
      newFeedback.push({
        message: "Good back alignment",
        isError: false,
      })
    }

    setFeedback(newFeedback)
  }

  // Helper function to calculate angle between three points
  const calculateAngle = (a: PoseLandmark, b: PoseLandmark, c: PoseLandmark) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
    let angle = Math.abs((radians * 180.0) / Math.PI)

    if (angle > 180.0) {
      angle = 360.0 - angle
    }

    return angle
  }

  // Helper function to calculate angle from vertical
  const calculateVerticalAngle = (top: PoseLandmark, bottom: PoseLandmark) => {
    const radians = Math.atan2(top.x - bottom.x, top.y - bottom.y)
    const angle = Math.abs((radians * 180.0) / Math.PI)
    return angle
  }

  // Helper function to calculate alignment deviation (how straight a line is)
  const calculateAlignment = (a: number[], b: number[], c: number[]) => {
    // Calculate vectors
    const ab = [b[0] - a[0], b[1] - a[1]]
    const bc = [c[0] - b[0], c[1] - b[1]]

    // Normalize vectors
    const abMag = Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1])
    const bcMag = Math.sqrt(bc[0] * bc[0] + bc[1] * bc[1])

    const abNorm = [ab[0] / abMag, ab[1] / abMag]
    const bcNorm = [bc[0] / bcMag, bc[1] / bcMag]

    // Dot product of normalized vectors (1 if perfectly aligned, -1 if opposite)
    const dotProduct = abNorm[0] * bcNorm[0] + abNorm[1] * bcNorm[1]

    // Convert to a deviation measure (0 if perfectly aligned, higher values mean more deviation)
    return (1 - dotProduct) / 2
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Card className="w-full p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading pose detection model and initializing camera...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-contain" playsInline />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* 3D visualization overlay */}
            <div className="absolute inset-0">
              <PoseVisualizer landmarks={landmarks} exerciseMode={exerciseMode} feedback={feedback} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Posture Feedback</h3>

          {feedback.length === 0 ? (
            <Alert>
              <AlertDescription>Stand in position to begin evaluation.</AlertDescription>
            </Alert>
          ) : (
            feedback.map((item, index) => (
              <Alert key={index} variant={item.isError ? "destructive" : "default"}>
                {item.isError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                <AlertDescription>{item.message}</AlertDescription>
              </Alert>
            ))
          )}

          <div className="mt-4 text-sm text-gray-500">
            <p>
              {exerciseMode === "squat"
                ? "Perform slow, controlled squats with proper form."
                : "Perform slow, controlled push-ups with proper form."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
