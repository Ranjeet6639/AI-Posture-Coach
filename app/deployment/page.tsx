"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Github, Globe, Server } from "lucide-react"

export default function DeploymentPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Deployment Guide</h1>
        <p className="text-gray-600 text-center mb-8">Instructions for running and deploying the AI Posture Coach</p>

        <Tabs defaultValue="local">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="local">
              <Code className="mr-2 h-4 w-4" />
              Local Development
            </TabsTrigger>
            <TabsTrigger value="vercel">
              <Server className="mr-2 h-4 w-4" />
              Vercel Deployment
            </TabsTrigger>
            <TabsTrigger value="github">
              <Github className="mr-2 h-4 w-4" />
              GitHub Pages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="local" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Local Development Setup</CardTitle>
                <CardDescription>Follow these steps to run the app on your local machine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Node.js 18.x or later</li>
                    <li>npm or yarn package manager</li>
                    <li>A modern web browser (Chrome, Firefox, Edge)</li>
                    <li>Webcam access</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Installation Steps</h3>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {`# Clone the repository
git clone https://github.com/yourusername/ai-posture-coach.git

# Navigate to the project directory
cd ai-posture-coach

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Access the App</h3>
                  <p>
                    Open your browser and navigate to{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
                  </p>
                  <p className="mt-2">You'll need to allow camera access when prompted by your browser.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vercel" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deploying to Vercel</CardTitle>
                <CardDescription>Deploy your app to Vercel for free</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>A GitHub, GitLab, or Bitbucket account</li>
                    <li>Your project pushed to a repository</li>
                    <li>A Vercel account (free)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Deployment Steps</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Push your code to a Git repository</li>
                    <li>
                      Sign up or log in to{" "}
                      <a
                        href="https://vercel.com"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Vercel
                      </a>
                    </li>
                    <li>Click "New Project" on the Vercel dashboard</li>
                    <li>Import your repository from GitHub, GitLab, or Bitbucket</li>
                    <li>Vercel will automatically detect Next.js and configure the build settings</li>
                    <li>Click "Deploy" and wait for the deployment to complete</li>
                  </ol>
                </div>

                <div className="flex justify-center mt-4">
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => window.open("https://vercel.com/new", "_blank")}
                  >
                    <Server className="h-4 w-4" />
                    Deploy to Vercel
                  </Button>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Note: Vercel automatically handles HTTPS, which is required for camera access in production.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deploying to GitHub Pages</CardTitle>
                <CardDescription>Host your app for free using GitHub Pages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>A GitHub account</li>
                    <li>Your project in a GitHub repository</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Configuration</h3>
                  <p>
                    Add the following to your <code className="bg-gray-100 px-2 py-1 rounded">next.config.mjs</code>{" "}
                    file:
                  </p>
                  <div className="bg-gray-100 p-4 rounded-md mt-2">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {`/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/your-repo-name',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Deployment Steps</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Create a <code className="bg-gray-100 px-2 py-1 rounded">.github/workflows/deploy.yml</code> file
                      with the following content:
                    </li>
                    <div className="bg-gray-100 p-4 rounded-md mt-2">
                      <pre className="text-sm overflow-x-auto">
                        <code>
                          {`name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: out
          branch: gh-pages`}
                        </code>
                      </pre>
                    </div>
                    <li>Push these changes to your repository</li>
                    <li>Go to your repository settings on GitHub</li>
                    <li>Navigate to "Pages" in the sidebar</li>
                    <li>Set the source to "Deploy from a branch" and select the "gh-pages" branch</li>
                    <li>Click "Save"</li>
                  </ol>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Note: GitHub Pages uses HTTPS by default, which is required for camera access in production.
                  </p>
                </div>

                <div className="flex justify-center mt-4">
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => window.open("https://github.com/new", "_blank")}
                  >
                    <Github className="h-4 w-4" />
                    Create GitHub Repository
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Browser Requirements</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Modern browser with WebGL support (Chrome, Firefox, Edge, Safari)</li>
                <li>HTTPS is required for camera access in production environments</li>
                <li>Mobile browsers may have limited performance for 3D rendering</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Performance Considerations</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>MediaPipe model loading may take a few seconds on first load</li>
                <li>Processing is done client-side, so performance depends on the user's device</li>
                <li>For better performance, ensure good lighting and camera positioning</li>
              </ul>
            </div>

            <div className="flex justify-center mt-6">
              <Button className="flex items-center gap-2" onClick={() => (window.location.href = "/")}>
                <Globe className="h-4 w-4" />
                Back to Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
