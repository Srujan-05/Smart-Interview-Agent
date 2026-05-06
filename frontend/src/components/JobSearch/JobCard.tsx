import { Bookmark, BookmarkCheck, MapPin, Briefcase, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MatchScoreBadge } from '@/components/Common/MatchScoreBadge'
import { formatSalary } from '@/utils/formatters'
import { useAppStore } from '@/store'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
  onViewDetails: (job: Job) => void
}

export function JobCard({ job, onViewDetails }: JobCardProps) {
  const toggleSaveJob = useAppStore((s) => s.toggleSaveJob)

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-semibold text-gray-900">{job.title}</h3>
            <p className="truncate text-sm text-gray-500">{job.company}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-gray-400 hover:text-blue-500"
            onClick={() => toggleSaveJob(job.id)}
            aria-label={job.saved ? 'Unsave job' : 'Save job'}
          >
            {job.saved ? (
              <BookmarkCheck className="h-4 w-4 text-blue-500" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <MatchScoreBadge score={job.matchScore} />
          <Badge variant="outline" className="text-xs">
            {job.experienceLevel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.locationType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-xs text-gray-400">+{job.skills.length - 4}</span>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(job)}
          >
            View Details
          </Button>
          {job.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-500 px-2.5 py-1 text-[0.8rem] font-medium text-white hover:bg-blue-600 transition-colors"
            >
              Apply <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
