import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export function Settings() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Dark Mode</p>
              <p className="text-xs text-gray-500">Toggle dark/light theme</p>
            </div>
            <Badge variant="outline" className="text-xs">Coming soon</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Interview Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Default Interview Mode</p>
              <p className="text-xs text-gray-500">Mode pre-selected on setup screen</p>
            </div>
            <Badge variant="outline" className="text-xs">Behavioral</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Think Time</p>
              <p className="text-xs text-gray-500">Seconds before recording starts</p>
            </div>
            <Badge variant="outline" className="text-xs">30s</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Email Reminders</p>
              <p className="text-xs text-gray-500">Daily practice reminders</p>
            </div>
            <Badge variant="outline" className="text-xs">Coming soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
