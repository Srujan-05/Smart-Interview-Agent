import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, RotateCcw, BarChart2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SkillRadar } from '@/components/Analytics/SkillRadar'
import { LoadingSpinner } from '@/components/Common/LoadingSpinner'
import { interviewApi } from '@/utils/api'
import { getScoreColor } from '@/utils/formatters'
import type { FeedbackReport } from '@/types'

const SCORE_LABELS: Record<string, string> = {
  technicalCorrectness: 'Technical Correctness',
  communication: 'Communication',
  visualPresence: 'Visual Presence',
  audioQuality: 'Audio Quality',
  overall: 'Overall',
}

export function InterviewFeedback() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<FeedbackReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedQ, setExpandedQ] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    interviewApi
      .getFeedback(id)
      .then((r) => setReport(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner label="Loading feedback..." className="py-20" />

  if (!report) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Feedback not available.</p>
        <Button className="mt-4" onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    )
  }

  const scoreColor = getScoreColor(report.overallScore)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Session Feedback</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/interview/setup')}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Practice Again
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/analytics')}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Overall score */}
      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-6 p-6">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{ backgroundColor: scoreColor }}
          >
            {report.overallScore}
          </div>
          <div>
            <p className="text-sm text-gray-500">Overall Score</p>
            <p className="text-3xl font-bold text-gray-900">{report.overallScore}/100</p>
            <p className="text-sm text-gray-500 mt-1">
              {report.overallScore >= 80
                ? 'Excellent performance! Keep it up.'
                : report.overallScore >= 60
                  ? 'Good effort. A few areas to polish.'
                  : 'Keep practicing — you\'re on your way.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Score breakdown + radar */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(report.breakdown).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{SCORE_LABELS[key] ?? key}</span>
                  <span className="font-semibold" style={{ color: getScoreColor(value) }}>
                    {value}/100
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${value}%`, backgroundColor: getScoreColor(value) }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Performance Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillRadar breakdown={report.breakdown} />
          </CardContent>
        </Card>
      </div>

      {/* Interview strategy (Adaptive-only) */}
      {report.appliedStrategy && report.appliedStrategy.mode !== 'fixed' && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              Interview Strategy
              <Badge
                className={
                  report.appliedStrategy.mode === 'retrieved'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }
              >
                {report.appliedStrategy.mode === 'retrieved' ? 'Retrieved' : 'Exploratory'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Strategy Description</p>
              <p className="text-sm text-gray-600">{report.appliedStrategy.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Focus Areas</p>
              <div className="flex flex-wrap gap-2">
                {report.appliedStrategy.focusAreas.map((area) => (
                  <Badge key={area} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            {report.appliedStrategy.mode === 'retrieved' && report.appliedStrategy.retrievedFromGroupSize && (
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">Derived from Similar Learners</p>
                <p className="text-sm text-blue-800">
                  This strategy was derived from {report.appliedStrategy.retrievedFromGroupSize} similar learner{' '}
                  {report.appliedStrategy.retrievedFromGroupSize === 1 ? 'profile' : 'profiles'} with comparable speaking style and confidence level.
                </p>
              </div>
            )}

            {report.appliedStrategy.mode === 'exploratory' && report.appliedStrategy.explorationReason && (
              <div className="rounded-lg bg-purple-50 p-3">
                <p className="text-xs font-semibold text-purple-700 mb-1">Exploration Rationale</p>
                <p className="text-sm text-purple-800">{report.appliedStrategy.explorationReason}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Per-question feedback */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Question Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.perQuestionFeedback.map((qf, i) => (
            <div key={qf.questionId} className="rounded-lg border">
              <button
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={() =>
                  setExpandedQ(expandedQ === qf.questionId ? null : qf.questionId)
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge variant="outline" className="shrink-0">Q{i + 1}</Badge>
                  <p className="truncate text-sm font-medium text-gray-800">
                    {qf.questionText}
                  </p>
                </div>
                <div className="ml-3 flex items-center gap-2 shrink-0">
                  <span
                    className="text-sm font-bold"
                    style={{ color: getScoreColor(qf.score) }}
                  >
                    {qf.score}/100
                  </span>
                  {expandedQ === qf.questionId ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedQ === qf.questionId && (
                <div className="border-t px-4 pb-4 pt-3 space-y-3">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Your Answer</p>
                    <p className="text-sm text-gray-700">{qf.yourAnswer || '—'}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Expected Answer</p>
                    <p className="text-sm text-blue-800">{qf.expectedAnswer}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Feedback</p>
                    <p className="text-sm text-gray-700">{qf.feedback}</p>
                  </div>
                  {qf.tips.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Tips</p>
                      <ul className="space-y-1">
                        {qf.tips.map((tip, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Top 3 Areas to Improve</p>
            <ol className="space-y-1.5">
              {report.recommendations.topAreasToImprove.map((area, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {i + 1}
                  </span>
                  {area}
                </li>
              ))}
            </ol>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Suggested Practice Topics</p>
            <div className="flex flex-wrap gap-2">
              {report.recommendations.suggestedTopics.map((t) => (
                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="rounded-lg bg-green-50 p-3">
            <p className="text-xs font-semibold text-green-700 mb-1">Next Session</p>
            <p className="text-sm text-green-800">{report.recommendations.nextSessionRecommendation}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => navigate('/')}
        >
          Back to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
