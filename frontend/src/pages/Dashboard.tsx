import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, TrendingUp, Award, Flame, CalendarDays, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/Common/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useInterview } from '@/hooks/useInterview'
import { formatDate } from '@/utils/formatters'
import { interviewApi } from '@/utils/api'
import { useAppStore } from '@/store'

const PRACTICE_MODES = [
  { mode: 'Behavioral', description: 'STAR method responses', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { mode: 'Technical', description: 'Coding & system design', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { mode: 'Mixed', description: 'Balanced practice', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { mode: 'Mock', description: 'Full 45-min interview', color: 'bg-green-50 text-green-700 border-green-200' },
]

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { sessionHistory, loading } = useInterview()
  const setSessionHistory = useAppStore((s) => s.setSessionHistory)

  useEffect(() => {
    interviewApi.getSessions().then((r) => setSessionHistory(r.data)).catch(() => {})
  }, [setSessionHistory])

  const avgScore = sessionHistory.length
    ? Math.round(sessionHistory.reduce((acc, s) => acc + s.score, 0) / sessionHistory.length)
    : 0
  const bestScore = sessionHistory.length
    ? Math.max(...sessionHistory.map((s) => s.score))
    : 0

  const stats = [
    { label: 'Total Sessions', value: sessionHistory.length, icon: CalendarDays, color: 'text-blue-500' },
    { label: 'Average Score', value: `${avgScore}/100`, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Best Score', value: `${bestScore}/100`, icon: Award, color: 'text-yellow-500' },
    { label: 'Day Streak', value: '—', icon: Flame, color: 'text-orange-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-sm text-gray-500">
          Ready to sharpen your interview skills?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-lg bg-gray-50 p-2 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick start */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Start Practice</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {PRACTICE_MODES.map(({ mode, description, color }) => (
              <button
                key={mode}
                onClick={() =>
                  navigate('/interview/setup', { state: { mode } })
                }
                className={`rounded-xl border p-4 text-left transition-transform hover:scale-[1.02] ${color}`}
              >
                <p className="font-semibold text-sm">{mode}</p>
                <p className="text-xs opacity-80 mt-0.5">{description}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Profile completion */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Profile Strength</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completion</span>
                <span className="font-semibold text-blue-600">
                  {user?.profileCompletion ?? 0}%
                </span>
              </div>
              <Progress value={user?.profileCompletion ?? 0} className="h-2" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/profile')}
            >
              Complete Profile <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent sessions */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Sessions</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500"
            onClick={() => navigate('/analytics')}
          >
            View all
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner label="Loading sessions..." className="py-8" />
          ) : sessionHistory.length === 0 ? (
            <div className="py-8 text-center">
              <Mic className="mx-auto mb-2 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">No sessions yet. Start your first practice!</p>
              <Button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => navigate('/interview/setup')}
              >
                Start Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {sessionHistory.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{session.mode} Interview</p>
                    <p className="text-xs text-gray-400">{formatDate(session.date)}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      session.score >= 80
                        ? 'border-green-200 text-green-700'
                        : session.score >= 60
                          ? 'border-yellow-200 text-yellow-700'
                          : 'border-red-200 text-red-700'
                    }
                  >
                    {session.score}/100
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
