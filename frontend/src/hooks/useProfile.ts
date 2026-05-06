import { useCallback, useState } from 'react'
import { profileApi } from '@/utils/api'
import { useAppStore } from '@/store'
import type { UserProfile } from '@/types'

export function useProfile() {
  const profile = useAppStore((s) => s.profile)
  const setProfile = useAppStore((s) => s.setProfile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await profileApi.get()
      setProfile(res.data)
    } catch {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [setProfile])

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      setLoading(true)
      setError(null)
      try {
        const res = await profileApi.update(data)
        setProfile(res.data)
      } catch {
        setError('Failed to update profile')
      } finally {
        setLoading(false)
      }
    },
    [setProfile],
  )

  return { profile, loading, error, fetchProfile, updateProfile }
}
