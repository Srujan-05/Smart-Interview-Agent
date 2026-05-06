import { useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScoreChart } from '@/components/Analytics/ScoreChart'
import { LoadingSpinner } from '@/components/Common/LoadingSpinner'
import { useInterview } from '@/hooks/useInterview'
import { useAppStore } from '@/store'
import { interviewApi } from '@/utils/api'

export function Analytics() {
  const { loading } = useInterview()
  const sessionHistory = useAppStore((s) => s.sessionHistory)
  const setSessionHistory = useAppStore((s) => s.setSessionHistory)

  useEffect(() => {
    interviewApi.getSessions().then((r) => setSessionHistory(r.data)).catch(() => {})
  }, [setSessionHistory])

  const totalSessions = sessionHistory.length
  const avgScore = totalSessions
    ? Math.round(sessionHistory.reduce((a, s) => a + s.score, 0) / totalSessions)
    : 0
  const bestScore = totalSessions ? Math.max(...sessionHistory.map((s) => s.score)) : 0

  // Mode distribution for bar chart
  const modeCount = sessionHistory.reduce<Record<string, number>>((acc, s) => {
    acc[s.mode] = (acc[s.mode] ?? 0) + 1
    return acc
  }, {})
  const barData = Object.entries(modeCount).map(([mode, count]) => ({ mode, count }))

  const stats = [
    { label: 'Total Sessions', value: totalSessions },
    { label: 'Average Score', value: `${avgScore}/100` },
    { label: 'Best Score', value: `${bestScore}/100` },
    { label: 'Modes Tried', value: Object.keys(modeCount).length },
  ]

  if (loading && !sessionHistory.length) {
    return <LoadingSpinner label="Loading analytics..." className="py-20" />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <Card key={label} className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score over time */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Score Improvement Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {sessionHistory.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              No session data yet. Complete your first interview.
            </div>
          ) : (
            <ScoreChart sessions={sessionHistory} />
          )}
        </CardContent>
      </Card>

      {/* Attempt distribution */}
      {barData.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Interview Attempts by Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mode" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Session history table */}
      {sessionHistory.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Session History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-gray-500">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Mode</th>
                    <th className="pb-2 font-medium">Score</th>
                    <th className="pb-2 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sessionHistory.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="py-2.5 text-gray-600">
                        {new Date(s.date).toLocaleDateString()}
                      </td>
                      <td className="py-2.5">
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                          {s.mode}
                        </span>
                      </td>
                      <td
                        className="py-2.5 font-semibold"
                        style={{
                          color:
                            s.score >= 80
                              ? '#10B981'
                              : s.score >= 60
                                ? '#F59E0B'
                                : '#EF4444',
                        }}
                      >
                        {s.score}/100
                      </td>
                      <td className="py-2.5 text-gray-500">
                        {Math.floor(s.duration / 60)}m {s.duration % 60}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
