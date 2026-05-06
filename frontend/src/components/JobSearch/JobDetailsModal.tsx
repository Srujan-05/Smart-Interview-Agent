import { MapPin, Briefcase, Building2, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MatchScoreBadge } from '@/components/Common/MatchScoreBadge'
import { formatSalary } from '@/utils/formatters'
import type { Job } from '@/types'

interface JobDetailsModalProps {
  job: Job | null
  onClose: () => void
}

export function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  if (!job) return null

  return (
    <Dialog open={!!job} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{job.title}</DialogTitle>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Building2 className="h-4 w-4" />
              {job.company}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              {job.location} · {job.locationType}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Briefcase className="h-4 w-4" />
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <MatchScoreBadge score={job.matchScore} />
            <Badge variant="outline">{job.experienceLevel}</Badge>
            <Badge variant="outline">{job.locationType}</Badge>
          </div>
        </DialogHeader>

        <Separator />

        {/* Match breakdown */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Match Breakdown</h3>
          <div className="grid grid-cols-2 gap-2">
            {job.skills.slice(0, 6).map((skill) => (
              <div
                key={skill}
                className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-1.5"
              >
                <span className="text-xs font-medium text-green-800">{skill}</span>
                <span className="text-xs text-green-600">Matched</span>
              </div>
            ))}
          </div>
        </section>

        {/* Job description */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Job Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
        </section>

        {/* Requirements */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Requirements</h3>
          <ul className="space-y-1">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                {req}
              </li>
            ))}
          </ul>
        </section>

        {/* About company */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">About {job.company}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{job.aboutCompany}</p>
        </section>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          {job.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-500 px-2.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              Apply Now <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
