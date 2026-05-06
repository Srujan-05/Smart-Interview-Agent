import { useEffect, useState, useCallback } from 'react'
import { Briefcase } from 'lucide-react'
import { JobCard } from '@/components/JobSearch/JobCard'
import { JobFilters } from '@/components/JobSearch/JobFilters'
import { JobDetailsModal } from '@/components/JobSearch/JobDetailsModal'
import { LoadingSpinner } from '@/components/Common/LoadingSpinner'
import { useAppStore } from '@/store'
import { jobsApi } from '@/utils/api'
import type { Job } from '@/types'

export function JobSearch() {
  const jobs = useAppStore((s) => s.jobs)
  const filters = useAppStore((s) => s.filters)
  const setJobs = useAppStore((s) => s.setJobs)
  const [loading, setLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await jobsApi.getAll(filters)
      setJobs(res.data)
    } catch {
      // API not available yet
    } finally {
      setLoading(false)
    }
  }, [filters, setJobs])

  useEffect(() => {
    const timer = setTimeout(fetchJobs, 400)
    return () => clearTimeout(timer)
  }, [fetchJobs])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Job Search</h1>

      <div className="flex gap-6 items-start">
        <JobFilters />

        <div className="flex-1">
          {loading ? (
            <LoadingSpinner label="Searching jobs..." className="py-20" />
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Briefcase className="mb-3 h-12 w-12" />
              <p className="text-sm">No jobs found matching your criteria.</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onViewDetails={setSelectedJob}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  )
}
