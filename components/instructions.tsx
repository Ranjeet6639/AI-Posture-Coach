import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Instructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Use</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="squats">Squats</TabsTrigger>
            <TabsTrigger value="pushups">Push-Ups</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div>
              <h3 className="font-medium mb-2">Getting Started</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Allow camera access when prompted</li>
                <li>Position yourself so your full body is visible</li>
                <li>Wear form-fitting clothing for better detection</li>
                <li>Ensure good lighting in your environment</li>
                <li>Keep 6-8 feet distance from the camera</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Understanding Feedback</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Green points and lines indicate correct form</li>
                <li>Red points and lines indicate areas needing correction</li>
                <li>3D indicators will highlight specific issues</li>
                <li>Text feedback will appear on screen</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="squats" className="space-y-4 mt-4">
            <div>
              <h3 className="font-medium mb-2">Proper Squat Form</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Feet shoulder-width apart</li>
                <li>Toes slightly pointed outward</li>
                <li>Back straight throughout the movement</li>
                <li>Knees tracking over toes, not caving inward</li>
                <li>Lower until thighs are parallel to ground</li>
                <li>Weight in heels, not toes</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Common Mistakes</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Leaning too far forward</li>
                <li>Not going deep enough</li>
                <li>Knees caving inward</li>
                <li>Heels lifting off the ground</li>
                <li>Rounding the lower back</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="pushups" className="space-y-4 mt-4">
            <div>
              <h3 className="font-medium mb-2">Proper Push-Up Form</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hands slightly wider than shoulder-width</li>
                <li>Body in a straight line from head to heels</li>
                <li>Elbows at 45° angle to body (not flared out)</li>
                <li>Lower chest to about 2 inches from floor</li>
                <li>Core engaged throughout movement</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Common Mistakes</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sagging or arching the back</li>
                <li>Not lowering chest enough</li>
                <li>Flaring elbows too wide</li>
                <li>Dropping the head forward</li>
                <li>Incomplete range of motion</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
