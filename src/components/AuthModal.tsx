import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signInWithEmail, signUpWithEmail, sendMagicLink } = useAuth()
  const [tab, setTab] = useState<'signin' | 'register' | 'magic'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!open) return null

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(''); setMessage('')
    const { error } = await signInWithEmail(email, password)
    setBusy(false)
    if (error) setError(error)
    else onClose()
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(''); setMessage('')
    const { error, needsVerification } = await signUpWithEmail(email, password, fullName)
    setBusy(false)
    if (error) setError(error)
    else if (needsVerification) setMessage('Check your inbox to verify your email, then sign in.')
    else onClose()
  }

  async function handleMagic(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(''); setMessage('')
    const { error } = await sendMagicLink(email)
    setBusy(false)
    if (error) setError(error)
    else setMessage('Magic link sent. Check your email on this device.')
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-[95vw] max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Sign in / Register</h3>
          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 hover:bg-neutral-900" aria-label="Close Auth">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-neutral-300"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 text-sm">
          {['signin','register','magic'].map((t) => (
            <button key={t} className={`px-3 py-2 border border-neutral-800 ${tab===t?'bg-neutral-900 text-white':'text-neutral-300 hover:bg-neutral-900/50'}`} onClick={() => { setTab(t as any); setError(''); setMessage('') }}>
              {t==='signin'?'Sign In':t==='register'?'Register':'Magic Link'}
            </button>
          ))}
        </div>
        {tab==='signin' && (
          <form onSubmit={handleSignIn} className="mt-4 space-y-3">
            <input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-950 border border-neutral-800 outline-none" />
            <input type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-950 border border-neutral-800 outline-none" />
            {error && <div className="text-sm text-amber-400">{error}</div>}
            <button disabled={busy} className="w-full px-3 py-2 rounded-md bg-brand text-neutral-950 font-semibold">{busy?'Signing in…':'Sign In'}</button>
          </form>
        )}
        {tab==='register' && (
          <form onSubmit={handleRegister} className="mt-4 space-y-3">
            <input type="text" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-950 border border-neutral-800 outline-none" />
            <input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-950 border border-neutral-800 outline-none" />
            <input type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-950 border border-neutral-800 outline-none" />
            {error && <div className="text-sm text-amber-400">{error}</div>}
            {message && <div className="text-sm text-emerald-400">{message}</div>}
            <button disabled={busy} className="w-full px-3 py-2 rounded-md bg-brand text-neutral-950 font-semibold">{busy?'Creating…':'Create Account'}</button>
          </form>
        )}
        {tab==='magic' && (
          <form onSubmit={handleMagic} className="mt-4 space-y-3">
            <input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-950 border border-neutral-800 outline-none" />
            {error && <div className="text-sm text-amber-400">{error}</div>}
            {message && <div className="text-sm text-emerald-400">{message}</div>}
            <button disabled={busy} className="w-full px-3 py-2 rounded-md bg-brand text-neutral-950 font-semibold">{busy?'Sending…':'Send Magic Link'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
