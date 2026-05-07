import { useEffect, useState } from 'react'
import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  Code,
  Star,
  Pencil,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ResumeUpload } from '@/components/Resume/ResumeUpload'
import { LoadingSpinner } from '@/components/Common/LoadingSpinner'
import {
  BasicInfoForm,
  SkillsForm,
  ExperienceForm,
  EducationForm,
} from '@/components/Profile/ProfileEditForms'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import type { Skill, Experience, Education } from '@/types'

const SKILL_LEVEL_COLOR = {
  Beginner: 'bg-gray-100 text-gray-600',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
}

type EditSection = 'basic' | 'skills' | 'experience' | 'education' | null

export function Profile() {
  const { user } = useAuth()
  const { profile, loading, fetchProfile, updateProfile } = useProfile()

  const [editSection, setEditSection] = useState<EditSection>(null)
  const [draft, setDraft] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const startEdit = (section: EditSection, data?: any) => {
    if (section === 'basic') {
      setDraft({ name: user?.name, phone: user?.phone, location: user?.location })
    } else if (section === 'skills') {
      setDraft({ skills: data || [] })
    } else if (section === 'experience') {
      setDraft({ experience: data || [] })
    } else if (section === 'education') {
      setDraft({ education: data || [] })
    }
    setEditSection(section)
  }

  const cancelEdit = () => {
    setEditSection(null)
    setDraft({})
  }

  const handleBasicInfoChange = (field: string, value: string) => {
    setDraft({ ...draft, [field]: value })
  }

  const saveBasicInfo = async () => {
    setSaving(true)
    await updateProfile({ /* profile updates would go here */ })
    setSaving(false)
    setEditSection(null)
  }

  const saveSkills = async () => {
    setSaving(true)
    await updateProfile({ skills: draft.skills })
    setSaving(false)
    setEditSection(null)
  }

  const saveExperience = async () => {
    setSaving(true)
    await updateProfile({ experience: draft.experience })
    setSaving(false)
    setEditSection(null)
  }

  const saveEducation = async () => {
    setSaving(true)
    await updateProfile({ education: draft.education })
    setSaving(false)
    setEditSection(null)
  }

  const fillManually = () => {
    setEditSection('basic')
    setDraft({ name: '', phone: '', location: '' })
  }

  if (loading && !profile && !user) {
    return <LoadingSpinner label="Loading profile..." className="py-20" />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4">
          {/* Basic info */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" /> Basic Info
              </CardTitle>
              {editSection !== 'basic' && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit('basic')}
                  className="h-7 w-7 text-gray-400 hover:text-gray-600"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {editSection === 'basic' ? (
                <BasicInfoForm
                  user={user}
                  onChange={handleBasicInfoChange}
                  onSave={saveBasicInfo}
                  onCancel={cancelEdit}
                  saving={saving}
                />
              ) : (
                <>
                  <p className="font-semibold text-gray-900">{user?.name ?? '—'}</p>
                  {user?.email && (
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-3.5 w-3.5" /> {user.email}
                    </p>
                  )}
                  {user?.phone && (
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone className="h-3.5 w-3.5" /> {user.phone}
                    </p>
                  )}
                  {user?.location && (
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5" /> {user.location}
                    </p>
                  )}

                  {profile?.seniorityLevel && (
                    <div className="pt-2">
                      <Badge className="bg-blue-500 text-white">
                        {profile.seniorityLevel} Level
                      </Badge>
                    </div>
                  )}

                  {profile?.domainExposure && profile.domainExposure.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {profile.domainExposure.map((d) => (
                        <Badge key={d} variant="outline" className="text-xs">
                          {d}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Resume upload */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumeUpload />
            </CardContent>
          </Card>

          {/* Training profile */}
          {profile?.trainingProfile && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-4 w-4" /> Training Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Learning Style</span>
                  <span className="font-medium">{profile.trainingProfile.learningStyle}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Confidence</span>
                    <span className="font-medium">{profile.trainingProfile.confidenceScore}%</span>
                  </div>
                  <Progress value={profile.trainingProfile.confidenceScore} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4 lg:col-span-2">
          {!profile ? (
            <div className="space-y-3">
              <Card className="shadow-sm">
                <CardContent className="py-12 text-center text-gray-500">
                  <p className="text-sm">Upload your resume to auto-populate your profile.</p>
                </CardContent>
              </Card>
              <Button
                onClick={fillManually}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Fill Profile Manually
              </Button>
            </div>
          ) : (
            <>
              {/* Skills */}
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code className="h-4 w-4" /> Skills
                  </CardTitle>
                  {editSection !== 'skills' && profile.skills.length > 0 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEdit('skills', profile.skills)}
                      className="h-7 w-7 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editSection === 'skills' ? (
                    <SkillsForm
                      skills={draft.skills || []}
                      onChange={(skills: Skill[]) => setDraft({ skills })}
                      onSave={saveSkills}
                      onCancel={cancelEdit}
                      saving={saving}
                    />
                  ) : profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${SKILL_LEVEL_COLOR[skill.level]}`}
                        >
                          {skill.name} · {skill.level}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit('skills', [])}
                      className="text-blue-600 border-blue-200"
                    >
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Add Skills
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Briefcase className="h-4 w-4" /> Experience
                  </CardTitle>
                  {editSection !== 'experience' && profile.experience.length > 0 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEdit('experience', profile.experience)}
                      className="h-7 w-7 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editSection === 'experience' ? (
                    <ExperienceForm
                      experience={draft.experience || []}
                      onChange={(experience: Experience[]) => setDraft({ experience })}
                      onSave={saveExperience}
                      onCancel={cancelEdit}
                      saving={saving}
                    />
                  ) : profile.experience.length > 0 ? (
                    <div className="space-y-4">
                      {profile.experience.map((exp, i) => (
                        <div key={i}>
                          {i > 0 && <Separator className="mb-4" />}
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{exp.role}</p>
                              <p className="text-sm text-gray-500">{exp.company}</p>
                            </div>
                            <span className="shrink-0 text-xs text-gray-400">{exp.duration}</span>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {exp.description.map((d, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit('experience', [])}
                      className="text-blue-600 border-blue-200"
                    >
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Add Experience
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <GraduationCap className="h-4 w-4" /> Education
                  </CardTitle>
                  {editSection !== 'education' && profile.education.length > 0 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEdit('education', profile.education)}
                      className="h-7 w-7 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editSection === 'education' ? (
                    <EducationForm
                      education={draft.education || []}
                      onChange={(education: Education[]) => setDraft({ education })}
                      onSave={saveEducation}
                      onCancel={cancelEdit}
                      saving={saving}
                    />
                  ) : profile.education.length > 0 ? (
                    <div className="space-y-3">
                      {profile.education.map((edu, i) => (
                        <div key={i}>
                          {i > 0 && <Separator className="mb-3" />}
                          <p className="font-semibold text-gray-900">
                            {edu.degree} in {edu.field}
                          </p>
                          <p className="text-sm text-gray-500">
                            {edu.institution} · {edu.graduationYear}
                          </p>
                          {edu.certifications && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {edu.certifications.map((c) => (
                                <Badge key={c} variant="outline" className="text-xs">
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit('education', [])}
                      className="text-blue-600 border-blue-200"
                    >
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Add Education
                    </Button>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
