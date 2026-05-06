import { useEffect } from 'react'
import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  Code,
  Star,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ResumeUpload } from '@/components/Resume/ResumeUpload'
import { LoadingSpinner } from '@/components/Common/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'

const SKILL_LEVEL_COLOR = {
  Beginner: 'bg-gray-100 text-gray-600',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
}

export function Profile() {
  const { user } = useAuth()
  const { profile, loading, fetchProfile } = useProfile()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  if (loading && !profile) {
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" /> Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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
            <Card className="shadow-sm">
              <CardContent className="py-12 text-center text-gray-500">
                <p className="text-sm">Upload your resume to auto-populate your profile.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Skills */}
              {profile.skills.length > 0 && (
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Code className="h-4 w-4" /> Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {profile.experience.length > 0 && (
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Briefcase className="h-4 w-4" /> Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {profile.education.length > 0 && (
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <GraduationCap className="h-4 w-4" /> Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.education.map((edu, i) => (
                      <div key={i}>
                        {i > 0 && <Separator className="mb-3" />}
                        <p className="font-semibold text-gray-900">{edu.degree} in {edu.field}</p>
                        <p className="text-sm text-gray-500">{edu.institution} · {edu.graduationYear}</p>
                        {edu.certifications && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {edu.certifications.map((c) => (
                              <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
