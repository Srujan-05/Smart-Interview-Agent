import type { SeniorityMatchDetail } from '@/types'

interface Props {
  detail: SeniorityMatchDetail
}

export function SeniorityMatchBar({ detail }: Props) {
  const maxYears = 15
  const rangeWidth = ((detail.requiredYearsMax - detail.requiredYearsMin) / maxYears) * 100
  const rangeStart = (detail.requiredYearsMin / maxYears) * 100
  const pinPosition = (detail.userYearsOfExperience / maxYears) * 100

  let color = 'text-red-600'
  let bgColor = 'bg-red-50'
  if (
    detail.userYearsOfExperience >= detail.requiredYearsMin &&
    detail.userYearsOfExperience <= detail.requiredYearsMax
  ) {
    color = 'text-green-600'
    bgColor = 'bg-green-50'
  } else if (
    detail.userYearsOfExperience >= detail.requiredYearsMin - 2 &&
    detail.userYearsOfExperience <= detail.requiredYearsMax + 2
  ) {
    color = 'text-amber-600'
    bgColor = 'bg-amber-50'
  }

  return (
    <div className={`rounded-lg ${bgColor} p-4`}>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Experience Match</span>
        <span className={`font-semibold ${color}`}>
          {detail.adjustmentPoints > 0 ? '+' : ''}{detail.adjustmentPoints.toFixed(1)} pts
        </span>
      </div>

      <div className="relative mb-2 h-8">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200" />

        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-400"
          style={{ left: `${rangeStart}%`, width: `${rangeWidth}%` }}
        />

        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          style={{ left: `${pinPosition}%` }}
        >
          <svg
            className={`h-5 w-5 ${color}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="12,2 22,20 2,20" />
          </svg>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>0 yrs</span>
        <span className="font-medium text-gray-700">
          {detail.requiredYearsMin}–{detail.requiredYearsMax} required
        </span>
        <span>{maxYears}+ yrs</span>
      </div>

      <div className="mt-3 text-xs font-medium text-gray-600">
        You have {detail.userYearsOfExperience} years of experience
        {detail.userYearsOfExperience >= detail.requiredYearsMin &&
        detail.userYearsOfExperience <= detail.requiredYearsMax
          ? ' • Graduated match'
          : detail.userYearsOfExperience < detail.requiredYearsMin
            ? ` • Below requirement by ${(detail.requiredYearsMin - detail.userYearsOfExperience).toFixed(1)} yrs`
            : ` • Above requirement by ${(detail.userYearsOfExperience - detail.requiredYearsMax).toFixed(1)} yrs`}
      </div>
    </div>
  )
}
