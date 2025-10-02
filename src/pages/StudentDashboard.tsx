import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

type MyItem = {
  code: string
  product: string
  status: 'Issued' | 'In Stock'
  issued_at: string | null
  due_at: string | null
}

export default function StudentDashboard() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ myItems: 0, overdue: 0 })
  const [items, setItems] = useState<MyItem[]>([])

  // Camera modal bits (reuse minimal)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const uid = (await supabase.auth.getUser()).data.user?.id
        if (!uid) return
        // My current issued items with product & due date
        const { data, error } = await supabase
          .from('assignments')
          .select('status, issued_at, due_at, items(code, products(name))')
          .eq('user_id', uid)
          .order('issued_at', { ascending: false })
        if (error) throw error
        const list: MyItem[] = (data || []).map((row: any) => ({
          code: row.items?.code ?? '-',
          product: row.items?.products?.name ?? '-',
          status: row.status === 'issued' ? 'Issued' : 'In Stock',
          issued_at: row.issued_at,
          due_at: row.due_at,
        }))
        setItems(list)
        const myItems = list.filter((i) => i.status === 'Issued').length
        const nowISO = new Date().toISOString()
        const overdue = list.filter((i) => i.status === 'Issued' && i.due_at && i.due_at < nowISO).length
        setStats({ myItems, overdue })
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load your items.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function openCamera() {
    try {
      setCameraOpen(true)
      if (!('mediaDevices' in navigator) || !navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera API not available in this browser/context.')
        return
      }
      if (!window.isSecureContext) {
        setCameraError(`Camera requires HTTPS or localhost. Current: ${window.location.protocol}`)
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = stream
      setCameraError('')
      const video = videoRef.current
      if (video && streamRef.current) {
        // @ts-ignore
        video.srcObject = streamRef.current
        await video.play().catch(() => setCameraError('Failed to start video preview.'))
      }
    } catch (err: any) {
      setCameraError(err?.message ?? 'Camera access failed')
      setCameraOpen(true)
    }
  }
  function closeCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      const v = videoRef.current as HTMLVideoElement & { srcObject?: MediaStream | null }
      ;(v as any).srcObject = null
    }
    setCameraOpen(false)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">My Items</h1>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-md bg-brand text-neutral-950 text-sm font-semibold" onClick={openCamera}>Open Camera</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"><div className="text-xs text-neutral-400">Currently Issued</div><div className="mt-1 text-2xl font-bold">{stats.myItems}</div></div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"><div className="text-xs text-neutral-400">Overdue</div><div className="mt-1 text-2xl font-bold">{stats.overdue}</div></div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Your Recent Activity</h2>
          {loading ? (
            <div className="text-neutral-400">Loading…</div>
          ) : error ? (
            <div className="text-amber-400">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-neutral-400">No records yet.</div>
          ) : (
            <div className="space-y-2 md:hidden">
              {items.map((r, idx) => (
                <div key={idx} className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm">{r.code}</div>
                    <span className={`px-2 py-0.5 text-[11px] rounded ${r.status === 'Issued' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>{r.status}</span>
                  </div>
                  <div className="mt-1 text-sm">{r.product}</div>
                  <div className="mt-1 text-xs text-neutral-400">Issued: {r.issued_at ? new Date(r.issued_at).toLocaleString() : '-'}{r.due_at ? ` • Due: ${new Date(r.due_at).toLocaleString()}` : ''}</div>
                </div>
              ))}
            </div>
          )}

          <div className="hidden md:block overflow-x-auto rounded-lg border border-neutral-800 mt-2">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900/40 text-neutral-300">
                <tr>
                  <th className="text-left px-4 py-2">Code</th>
                  <th className="text-left px-4 py-2">Product</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Issued</th>
                  <th className="text-left px-4 py-2">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {items.map((r, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 font-mono">{r.code}</td>
                    <td className="px-4 py-2">{r.product}</td>
                    <td className="px-4 py-2">{r.status}</td>
                    <td className="px-4 py-2">{r.issued_at ? new Date(r.issued_at).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2">{r.due_at ? new Date(r.due_at).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {cameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={closeCamera} />
          <div className="relative z-10 w-screen h-screen md:w-[95vw] md:h-auto md:max-w-2xl rounded-none md:rounded-lg border border-neutral-800 bg-neutral-950 p-0 md:p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Camera Preview</h3>
              <button onClick={closeCamera} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 hover:bg-neutral-900" aria-label="Close Camera">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-neutral-300"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            {cameraError ? (
              <div className="mt-4">
                <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded p-3">{cameraError}</div>
                <div className="mt-3"><button onClick={openCamera} className="px-3 py-2 rounded-md bg-brand text-neutral-950 text-sm font-semibold">Retry</button></div>
              </div>
            ) : (
              <div className="mt-4">
                <div className="relative aspect-[3/4] sm:aspect-video w-full overflow-hidden rounded-none md:rounded-md border border-neutral-800 bg-black">
                  <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline />
                </div>
                <div className="mt-4 flex justify-end gap-2 p-4 md:p-0">
                  <button onClick={closeCamera} className="px-3 py-2 rounded-md border border-neutral-800 text-sm">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
