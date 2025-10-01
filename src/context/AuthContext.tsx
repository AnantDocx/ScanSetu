import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: 'admin' | 'student'
}

type AuthContextType = {
  user: { id: string; email: string | null } | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function upsertProfile(userId: string, email: string | null, fullName: string | null) {
  // Try to upsert the profile; trigger will set role from admin_emails
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, email, full_name: fullName }, { onConflict: 'id' })
  if (error) console.warn('Profile upsert failed:', error.message)
}

async function loadProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,full_name,role')
    .eq('id', userId)
    .maybeSingle()
  if (error) {
    console.warn('Profile load failed:', error.message)
    return null
  }
  return (data as Profile) ?? null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string | null } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!mounted) return
      const u = session?.user ? { id: session.user.id, email: session.user.email ?? null } : null
      setUser(u)
      if (u) {
        // Ensure profile exists, then load
        await upsertProfile(u.id, u.email, session?.user.user_metadata?.full_name ?? null)
        const p = await loadProfile(u.id)
        if (mounted) setProfile(p)
      }
      setLoading(false)
    })()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ? { id: session.user.id, email: session.user.email ?? null } : null
      setUser(u)
      if (u) {
        await upsertProfile(u.id, u.email, session?.user.user_metadata?.full_name ?? null)
        const p = await loadProfile(u.id)
        setProfile(p)
      } else {
        setProfile(null)
      }
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = useMemo(
    () => async () => {
      const redirectTo = `${window.location.origin}/dashboard`
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
      if (error) console.warn('Google sign-in error:', error.message)
    },
    []
  )

  const signOut = useMemo(
    () => async () => {
      const { error } = await supabase.auth.signOut()
      if (error) console.warn('Sign-out error:', error.message)
      setProfile(null)
      setUser(null)
    },
    []
  )

  const value: AuthContextType = { user, profile, loading, signInWithGoogle, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
