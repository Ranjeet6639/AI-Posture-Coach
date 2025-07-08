"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PoseDetection from "@/components/pose-detection"
import Instructions from "@/components/instructions"

export default function Home() {
  const [exerciseMode, setExerciseMode] = useState<"idle" | "squat" | "pushup">("idle")
  const [cameraActive, setCameraActive] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")

  const checkCameraSupport = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setDebugInfo("MediaDevices API not supported in this browser")
        return
      }

      // List available devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")

      if (videoDevices.length === 0) {
        setDebugInfo("No video input devices found")
        return
      }

      setDebugInfo(`Found ${videoDevices.length} video devices. Testing access...`)

      // Try to access the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })

      // If we got here, camera access was successful
      const tracks = stream.getVideoTracks()
      const cameraInfo = tracks[0].label

      // Stop the stream since we're just testing
      tracks.forEach((track) => track.stop())

      setDebugInfo(`Camera access successful. Using: ${cameraInfo}`)
    } catch (err) {
      setDebugInfo(`Camera access error: ${err.message}`)
    }
  }

  const startExercise = (mode: "squat" | "pushup") => {
    setExerciseMode(mode)
    setCameraActive(true)
  }

  const stopExercise = () => {
    setExerciseMode("idle")
    setCameraActive(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">AI Posture Coach</h1>
        <p className="text-gray-600 text-center mb-8">Real-time posture evaluation for squats and push-ups</p>

        {!cameraActive ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Squats</CardTitle>
                  <CardDescription>Evaluate your squat form with real-time feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => startExercise("squat")}>
                    Start Squats
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Push-Ups</CardTitle>
                  <CardDescription>Evaluate your push-up form with real-time feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => startExercise("pushup")}>
                    Start Push-Ups
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Instructions />
          </>
        ) : (
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{exerciseMode === "squat" ? "Squat" : "Push-Up"} Evaluation</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={checkCameraSupport} size="sm">
                  Debug Camera
                </Button>
                <Button variant="outline" onClick={stopExercise}>
                  Stop
                </Button>
              </div>
            </div>

            <PoseDetection exerciseMode={exerciseMode} />
            {debugInfo && (
              <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
                <p className="font-medium">Debug Info:</p>
                <p>{debugInfo}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
