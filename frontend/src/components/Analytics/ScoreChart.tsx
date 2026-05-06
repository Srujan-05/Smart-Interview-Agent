import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatDate } from '@/utils/formatters'
import type { SessionSummary } from '@/types'

interface ScoreChartProps {
  sessions: SessionSummary[]
}

export function ScoreChart({ sessions }: ScoreChartProps) {
  const data = sessions.map((s) => ({
    date: formatDate(s.date),
    score: s.score,
    mode: s.mode,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}`}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
          formatter={(value: unknown) => [`${value}/100`, 'Score']}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#3B82F6"
          strokeWidth={2.5}
          dot={{ fill: '#3B82F6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
