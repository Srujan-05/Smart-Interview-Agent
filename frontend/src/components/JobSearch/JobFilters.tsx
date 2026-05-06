import { useCallback } from 'react'
import type React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/store'
import { formatSalary } from '@/utils/formatters'

const EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior']
const LOCATION_TYPES = ['Remote', 'On-site', 'Hybrid']

export function JobFilters() {
  const filters = useAppStore((s) => s.filters)
  const setFilters = useAppStore((s) => s.setFilters)

  const reset = useCallback(() => {
    setFilters({
      query: '',
      location: '',
      experienceLevel: '',
      salaryMin: 0,
      salaryMax: 500000,
      skills: [],
      company: '',
    })
  }, [setFilters])

  return (
    <aside className="w-64 shrink-0 space-y-5 rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        <Button variant="ghost" size="sm" onClick={reset} className="h-7 text-xs text-gray-500">
          <X className="mr-1 h-3 w-3" /> Reset
        </Button>
      </div>

      <Separator />

      {/* Keyword search */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-gray-600">Job title / keyword</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="e.g. Frontend Engineer"
            className="pl-8 text-sm"
            value={filters.query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ query: e.target.value })}
          />
        </div>
      </div>

      {/* Location type */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-gray-600">Location type</Label>
        <Select
          value={filters.location}
          onValueChange={(v: string | null) => setFilters({ location: v ?? '' })}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Any location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any location</SelectItem>
            {LOCATION_TYPES.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Experience level */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-gray-600">Experience level</Label>
        <Select
          value={filters.experienceLevel}
          onValueChange={(v: string | null) => setFilters({ experienceLevel: v ?? '' })}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Any level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any level</SelectItem>
            {EXPERIENCE_LEVELS.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Salary range */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-600">
          Salary range:{' '}
          <span className="text-blue-600">
            {formatSalary(filters.salaryMin, filters.salaryMax)}
          </span>
        </Label>
        <Slider
          min={0}
          max={500000}
          step={10000}
          value={[filters.salaryMin, filters.salaryMax]}
          onValueChange={(vals: number | readonly number[]) => {
            if (Array.isArray(vals)) {
              setFilters({ salaryMin: vals[0], salaryMax: vals[1] })
            }
          }}
          className="mt-2"
        />
      </div>

      {/* Company */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-gray-600">Company</Label>
        <Input
          placeholder="e.g. Google"
          className="text-sm"
          value={filters.company}
          onChange={(e) => setFilters({ company: e.target.value })}
        />
      </div>
    </aside>
  )
}
