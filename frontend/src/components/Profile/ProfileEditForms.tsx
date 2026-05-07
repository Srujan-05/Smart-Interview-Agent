import { Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { User, Skill, Experience, Education, SkillLevel } from '@/types'

/* ============ Basic Info Form ============ */
interface BasicInfoFormProps {
  user: User | null
  onChange: (field: keyof User, value: string) => void
  onSave: () => Promise<void>
  onCancel: () => void
  saving: boolean
}

export function BasicInfoForm({
  user,
  onChange,
  onSave,
  onCancel,
  saving,
}: BasicInfoFormProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Name</Label>
        <Input
          value={user?.name ?? ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Full name"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Phone</Label>
        <Input
          value={user?.phone ?? ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Location</Label>
        <Input
          value={user?.location ?? ''}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="City, Country"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )
}

/* ============ Skills Form ============ */
interface SkillsFormProps {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
  onSave: () => Promise<void>
  onCancel: () => void
  saving: boolean
}

export function SkillsForm({
  skills,
  onChange,
  onSave,
  onCancel,
  saving,
}: SkillsFormProps) {
  const addSkill = () => {
    onChange([...skills, { name: '', level: 'Beginner' }])
  }

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index))
  }

  const updateSkill = (index: number, field: 'name' | 'level', value: string) => {
    const updated = [...skills]
    if (field === 'name') updated[index].name = value
    if (field === 'level') updated[index].level = value as SkillLevel
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {skills.map((skill, idx) => (
          <div key={idx} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Input
                placeholder="Skill name"
                value={skill.name}
                onChange={(e) => updateSkill(idx, 'name', e.target.value)}
                className="text-sm"
              />
            </div>
            <Select
              value={skill.level}
              onValueChange={(v: string | null) =>
                updateSkill(idx, 'level', v ?? 'Beginner')
              }
            >
              <SelectTrigger className="w-32 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeSkill(idx)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={addSkill}
        className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <Plus className="mr-1 h-3.5 w-3.5" /> Add Skill
      </Button>
      <Separator />
      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )
}

/* ============ Experience Form ============ */
interface ExperienceFormProps {
  experience: Experience[]
  onChange: (exp: Experience[]) => void
  onSave: () => Promise<void>
  onCancel: () => void
  saving: boolean
}

export function ExperienceForm({
  experience,
  onChange,
  onSave,
  onCancel,
  saving,
}: ExperienceFormProps) {
  const addExperience = () => {
    onChange([
      ...experience,
      {
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        duration: '',
        description: [''],
      },
    ])
  }

  const removeExperience = (index: number) => {
    onChange(experience.filter((_, i) => i !== index))
  }

  const updateExperience = (index: number, field: string, value: string | string[]) => {
    const updated = [...experience]
    if (field === 'description') {
      updated[index].description = value as string[]
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    onChange(updated)
  }

  const addDescription = (index: number) => {
    const updated = [...experience]
    updated[index].description.push('')
    onChange(updated)
  }

  const removeDescription = (index: number, descIdx: number) => {
    const updated = [...experience]
    updated[index].description.splice(descIdx, 1)
    onChange(updated)
  }

  const updateDescription = (index: number, descIdx: number, value: string) => {
    const updated = [...experience]
    updated[index].description[descIdx] = value
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {experience.map((exp, idx) => (
        <div key={idx} className="rounded-lg border p-3 space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold text-gray-700">Experience {idx + 1}</h4>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeExperience(idx)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Role</Label>
              <Input
                value={exp.role}
                onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                placeholder="e.g., Software Engineer"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                placeholder="e.g., Google"
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Duration (e.g., 2 years 3 months)</Label>
            <Input
              value={exp.duration}
              onChange={(e) => updateExperience(idx, 'duration', e.target.value)}
              placeholder="2 years 3 months"
              className="text-sm"
            />
          </div>

          <div>
            <Label className="text-xs mb-1 block">Responsibilities</Label>
            <div className="space-y-1.5">
              {exp.description.map((desc, dIdx) => (
                <div key={dIdx} className="flex gap-2 items-start">
                  <Input
                    value={desc}
                    onChange={(e) => updateDescription(idx, dIdx, e.target.value)}
                    placeholder="• Responsibility"
                    className="text-sm"
                  />
                  {exp.description.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeDescription(idx, dIdx)}
                      className="text-red-500 hover:text-red-600 h-9 w-9 shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addDescription(idx)}
              className="mt-1 text-blue-600"
            >
              <Plus className="h-3 w-3 mr-1" /> Add responsibility
            </Button>
          </div>
        </div>
      ))}

      <Button
        size="sm"
        variant="outline"
        onClick={addExperience}
        className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <Plus className="mr-1 h-3.5 w-3.5" /> Add Experience
      </Button>

      <Separator />

      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )
}

/* ============ Education Form ============ */
interface EducationFormProps {
  education: Education[]
  onChange: (edu: Education[]) => void
  onSave: () => Promise<void>
  onCancel: () => void
  saving: boolean
}

export function EducationForm({
  education,
  onChange,
  onSave,
  onCancel,
  saving,
}: EducationFormProps) {
  const addEducation = () => {
    onChange([
      ...education,
      {
        institution: '',
        degree: '',
        field: '',
        graduationYear: '',
        certifications: [],
      },
    ])
  }

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {education.map((edu, idx) => (
        <div key={idx} className="rounded-lg border p-3 space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold text-gray-700">Education {idx + 1}</h4>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeEducation(idx)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Degree</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                placeholder="e.g., Bachelor's"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Field</Label>
              <Input
                value={edu.field}
                onChange={(e) => updateEducation(idx, 'field', e.target.value)}
                placeholder="e.g., Computer Science"
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Institution</Label>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                placeholder="University name"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Graduation Year</Label>
              <Input
                value={edu.graduationYear}
                onChange={(e) => updateEducation(idx, 'graduationYear', e.target.value)}
                placeholder="2023"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        size="sm"
        variant="outline"
        onClick={addEducation}
        className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <Plus className="mr-1 h-3.5 w-3.5" /> Add Education
      </Button>

      <Separator />

      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )
}
