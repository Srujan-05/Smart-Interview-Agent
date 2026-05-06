import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { ScoreBreakdown } from '@/types'

interface SkillRadarProps {
  breakdown: ScoreBreakdown
}

export function SkillRadar({ breakdown }: SkillRadarProps) {
  const data = [
    { subject: 'Technical', value: breakdown.technicalCorrectness },
    { subject: 'Communication', value: breakdown.communication },
    { subject: 'Visual', value: breakdown.visualPresence },
    { subject: 'Audio', value: breakdown.audioQuality },
    { subject: 'Overall', value: breakdown.overall },
  ]

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
          formatter={(value: unknown) => [`${value}/100`]}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
