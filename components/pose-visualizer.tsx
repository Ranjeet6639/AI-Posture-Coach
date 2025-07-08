"use client"

import { useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

// Define the connections between landmarks for drawing lines
const POSE_CONNECTIONS = [
  // Torso
  [11, 12],
  [12, 24],
  [24, 23],
  [23, 11],
  // Right arm
  [12, 14],
  [14, 16],
  // Left arm
  [11, 13],
  [13, 15],
  // Right leg
  [24, 26],
  [26, 28],
  // Left leg
  [23, 25],
  [25, 27],
]

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

type PoseVisualizerProps = {
  landmarks: PoseLandmark[]
  exerciseMode: "squat" | "pushup"
  feedback: Feedback[]
}

export default function PoseVisualizer({ landmarks, exerciseMode, feedback }: PoseVisualizerProps) {
  if (!landmarks || landmarks.length === 0) {
    return null
  }

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <PoseModel landmarks={landmarks} exerciseMode={exerciseMode} feedback={feedback} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  )
}

function PoseModel({ landmarks, exerciseMode, feedback }: PoseVisualizerProps) {
  const { camera } = useThree()
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const arrowsRef = useRef<THREE.Group>(null)

  // Set camera position
  useEffect(() => {
    camera.position.z = 5
  }, [camera])

  // Update visualization on each frame
  useFrame(() => {
    if (!landmarks || landmarks.length === 0) return

    updatePoints()
    updateLines()
    updateArrows()
  })

  // Update the points (joints)
  const updatePoints = () => {
    if (!pointsRef.current || !landmarks) return

    const positions = new Float32Array(landmarks.length * 3)
    const colors = new Float32Array(landmarks.length * 3)

    landmarks.forEach((landmark, i) => {
      // Convert from normalized coordinates (0-1) to scene coordinates
      const x = (landmark.x - 0.5) * 2
      const y = (0.5 - landmark.y) * 2 // Flip Y axis
      const z = landmark.z

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Determine color based on feedback
      let color = new THREE.Color(0x00ff00) // Default green

      // Check if this joint has an issue
      const jointIssues = feedback.filter((item) => item.isError && item.jointIssue).map((item) => item.jointIssue)

      if (jointIssues.includes("knees") && (i === 25 || i === 26)) {
        color = new THREE.Color(0xff0000) // Red for knee issues
      } else if (jointIssues.includes("back") && ((i >= 11 && i <= 12) || (i >= 23 && i <= 24))) {
        color = new THREE.Color(0xff0000) // Red for back issues
      } else if (jointIssues.includes("elbows") && (i === 13 || i === 14)) {
        color = new THREE.Color(0xff0000) // Red for elbow issues
      }

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    })

    pointsRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    pointsRef.current.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.color.needsUpdate = true
  }

  // Update the lines (connections between joints)
  const updateLines = () => {
    if (!linesRef.current || !landmarks) return

    const positions = new Float32Array(POSE_CONNECTIONS.length * 6)
    const colors = new Float32Array(POSE_CONNECTIONS.length * 6)

    POSE_CONNECTIONS.forEach((connection, i) => {
      const [index1, index2] = connection

      if (landmarks[index1] && landmarks[index2]) {
        // Convert from normalized coordinates (0-1) to scene coordinates
        const x1 = (landmarks[index1].x - 0.5) * 2
        const y1 = (0.5 - landmarks[index1].y) * 2 // Flip Y axis
        const z1 = landmarks[index1].z

        const x2 = (landmarks[index2].x - 0.5) * 2
        const y2 = (0.5 - landmarks[index2].y) * 2 // Flip Y axis
        const z2 = landmarks[index2].z

        positions[i * 6] = x1
        positions[i * 6 + 1] = y1
        positions[i * 6 + 2] = z1

        positions[i * 6 + 3] = x2
        positions[i * 6 + 4] = y2
        positions[i * 6 + 5] = z2

        // Determine color based on feedback
        let color = new THREE.Color(0x00ff00) // Default green

        // Check if this connection is part of a joint with an issue
        const jointIssues = feedback.filter((item) => item.isError && item.jointIssue).map((item) => item.jointIssue)

        if (
          jointIssues.includes("knees") &&
          ((index1 === 23 && index2 === 25) ||
            (index1 === 25 && index2 === 27) ||
            (index1 === 24 && index2 === 26) ||
            (index1 === 26 && index2 === 28))
        ) {
          color = new THREE.Color(0xff0000) // Red for knee issues
        } else if (
          jointIssues.includes("back") &&
          ((index1 === 11 && index2 === 23) ||
            (index1 === 12 && index2 === 24) ||
            (index1 === 11 && index2 === 12) ||
            (index1 === 23 && index2 === 24))
        ) {
          color = new THREE.Color(0xff0000) // Red for back issues
        } else if (
          jointIssues.includes("elbows") &&
          ((index1 === 11 && index2 === 13) ||
            (index1 === 13 && index2 === 15) ||
            (index1 === 12 && index2 === 14) ||
            (index1 === 14 && index2 === 16))
        ) {
          color = new THREE.Color(0xff0000) // Red for elbow issues
        }

        colors[i * 6] = color.r
        colors[i * 6 + 1] = color.g
        colors[i * 6 + 2] = color.b

        colors[i * 6 + 3] = color.r
        colors[i * 6 + 4] = color.g
        colors[i * 6 + 5] = color.b
      }
    })

    linesRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    linesRef.current.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    linesRef.current.geometry.attributes.position.needsUpdate = true
    linesRef.current.geometry.attributes.color.needsUpdate = true
  }

  // Update arrows for issues (simpler than HTML markers)
  const updateArrows = () => {
    if (!arrowsRef.current || !landmarks) return

    // Clear previous arrows
    while (arrowsRef.current.children.length > 0) {
      arrowsRef.current.remove(arrowsRef.current.children[0])
    }

    // Add new arrows based on feedback
    feedback
      .filter((item) => item.isError && item.jointIssue)
      .forEach((item) => {
        let position: [number, number, number] = [0, 0, 0]

        // Determine position based on joint issue
        if (item.jointIssue === "knees") {
          // Position between knees
          const leftKnee = landmarks[25]
          const rightKnee = landmarks[26]
          if (leftKnee && rightKnee) {
            position = [
              ((leftKnee.x + rightKnee.x) / 2 - 0.5) * 2,
              ((0.5 - leftKnee.y + (0.5 - rightKnee.y)) / 2) * 2,
              (leftKnee.z + rightKnee.z) / 2,
            ]
          }
        } else if (item.jointIssue === "back") {
          // Position at middle of back
          const leftShoulder = landmarks[11]
          const rightShoulder = landmarks[12]
          const leftHip = landmarks[23]
          const rightHip = landmarks[24]
          if (leftShoulder && rightShoulder && leftHip && rightHip) {
            position = [
              ((leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4 - 0.5) * 2,
              ((0.5 - leftShoulder.y + (0.5 - rightShoulder.y) + (0.5 - leftHip.y) + (0.5 - rightHip.y)) / 4) * 2,
              (leftShoulder.z + rightShoulder.z + leftHip.z + rightHip.z) / 4,
            ]
          }
        } else if (item.jointIssue === "elbows") {
          // Position between elbows
          const leftElbow = landmarks[13]
          const rightElbow = landmarks[14]
          if (leftElbow && rightElbow) {
            position = [
              ((leftElbow.x + rightElbow.x) / 2 - 0.5) * 2,
              ((0.5 - leftElbow.y + (0.5 - rightElbow.y)) / 2) * 2,
              (leftElbow.z + rightElbow.z) / 2,
            ]
          }
        }

        // Create a cone to indicate the issue
        const geometry = new THREE.ConeGeometry(0.1, 0.3, 32)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const cone = new THREE.Mesh(geometry, material)
        cone.position.set(position[0], position[1], position[2])

        // Rotate the cone to point in the appropriate direction
        if (item.jointIssue === "knees") {
          cone.rotation.x = Math.PI // Point downward
        } else if (item.jointIssue === "back") {
          cone.rotation.z = Math.PI / 2 // Point to the side
        } else if (item.jointIssue === "elbows") {
          cone.rotation.x = -Math.PI / 2 // Point outward
        }

        arrowsRef.current.add(cone)
      })
  }

  return (
    <group>
      {/* Points for joints */}
      <points ref={pointsRef}>
        <bufferGeometry />
        <pointsMaterial size={0.1} vertexColors sizeAttenuation={true} />
      </points>

      {/* Lines for connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors linewidth={2} />
      </lineSegments>

      {/* Group for arrows */}
      <group ref={arrowsRef} />
    </group>
  )
}
