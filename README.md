# Real-Time AI-Based Exercise Evaluation Web App

This project is a real-time web-based fitness application developed as part of a technical assignment for the Full Stack Intern position at Realfy Oasis Pvt. Ltd. The application leverages MediaPipe's Pose Landmarker to detect human body posture through a webcam and evaluates the user's form during exercises.

Users can choose between two supported exercises: Squats and Push-Ups. Each exercise is broken down into different movement phases (e.g., descent and ascent for Squats) and evaluated using rule-based logic. The app checks for common form issues such as:

- For Squats: Insufficient knee bend, leaning the upper body too far forward
- For Push-Ups: Incomplete elbow bend, chest not lowered enough, back sagging

Visual feedback is provided in real-time through color-coded keypoints:
- Green keypoints for correct posture
- Red keypoints and lines for incorrect posture

Additionally, Three.js is used to display 3D annotations near problematic joints, helping users understand and correct their form.

The application is designed to be responsive and works on both desktop and mobile browsers with webcam support.

## How to Run Locally

1. Clone the repository:
-by downloading the zip file
-Then run it in vs code.

2.Install dependencies:
npm install

3.Start the development server:
npm run dev

4.Open your browser and go to:
http://localhost:3000

Here is the Example of "AI Posture Coach"
https://ai-posture-coach.vercel.app/

<img width="1492" height="877" alt="image" src="https://github.com/user-attachments/assets/133edb13-34ea-484a-a053-c71bdd3bb45a" />
