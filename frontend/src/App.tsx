import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/context/AuthContext'
import { InterviewProvider } from '@/context/InterviewContext'
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute'
import { AppLayout } from '@/components/Layout/AppLayout'

import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { Profile } from '@/pages/Profile'
import { JobSearch } from '@/pages/JobSearch'
import { InterviewSetup } from '@/pages/InterviewSetup'
import { Interview } from '@/pages/Interview'
import { InterviewFeedback } from '@/pages/InterviewFeedback'
import { Analytics } from '@/pages/Analytics'
import { NotFound } from '@/pages/NotFound'
import { Settings } from '@/pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <InterviewProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="jobs" element={<JobSearch />} />
                  <Route path="interview/setup" element={<InterviewSetup />} />
                  <Route path="interview/session" element={<Interview />} />
                  <Route
                    path="interview/feedback/:id"
                    element={<InterviewFeedback />}
                  />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </InterviewProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  )
}
