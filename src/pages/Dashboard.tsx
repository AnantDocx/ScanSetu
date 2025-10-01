import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

function StatCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5 hover:bg-neutral-900/60 transition-colors">
      <div className="text-xs text-neutral-400">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {hint ? <div className="mt-2 text-xs text-neutral-500">{hint}</div> : null}
    </div>
  )
}

function MobileActivityList({ rows }: { rows: ActivityRow[] }) {
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.code} className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
          <div className="flex items-center justify-between">
            <div className="font-mono text-sm">{r.code}</div>
            <span className={`px-2 py-0.5 text-[11px] rounded ${r.status === 'Issued' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>{r.status}</span>
          </div>
          <div className="mt-1 text-sm">{r.product}</div>
          <div className="mt-1 text-xs text-neutral-400">{r.holder} • {r.updated}</div>
        </div>
      ))}
    </div>
  )
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 hover:bg-neutral-900" onClick={onMenuClick} aria-label="Open Menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-neutral-300"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div className="h-8 w-8 rounded-sm bg-brand flex items-center justify-center">
          <div className="h-4 w-4 bg-neutral-900 rotate-45" />
        </div>
        <div>
          <div className="font-semibold">ScanSetu</div>
          <div className="text-xs text-neutral-400">Lab Inventory Dashboard</div>
        </div>
      </div>
      {/* Search hidden on small screens */}
      <div className="flex-1 max-w-xl hidden sm:block">
        <div className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2">
          <input placeholder="Search items, barcodes, users..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-500" />
          <div className="text-xs text-neutral-500">CTRL + K</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="hidden sm:inline-flex px-3 py-2 rounded-md border border-neutral-800 text-sm hover:bg-neutral-900">Export CSV</button>
        <Link to="/" className="px-3 py-2 rounded-md bg-neutral-200 text-neutral-900 text-sm font-medium hover:opacity-90">Home</Link>
      </div>
    </div>
  )
}

function Sidebar() {
  const items = [
    { name: 'Overview' },
    { name: 'Inventory' },
    { name: 'Issue' },
    { name: 'Return' },
    { name: 'Users' },
    { name: 'Settings' },
  ]
  return (
    <aside className="w-60 shrink-0 border-r border-neutral-800 hidden md:block">
      <div className="p-4">
        <div className="text-xs uppercase tracking-widest text-neutral-500">Navigation</div>
        <div className="mt-3 space-y-1">
          {items.map((it) => (
            <button key={it.name} className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-900/70 text-sm border border-transparent hover:border-neutral-800">
              {it.name}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-neutral-800">
        <div className="text-xs text-neutral-500">Quick Actions</div>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <button className="px-3 py-2 rounded-md bg-brand text-neutral-950 text-sm font-semibold">Scan to Issue</button>
          <button className="px-3 py-2 rounded-md border border-neutral-800 text-sm">Scan to Return</button>
          <button className="px-3 py-2 rounded-md border border-neutral-800 text-sm">Add Product</button>
        </div>
      </div>
    </aside>
  )
}

type ActivityRow = {
  code: string
  product: string
  holder: string
  status: 'Issued' | 'In Stock'
  updated: string
}

function Table({ rows }: { rows: ActivityRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-800">
      <div className="min-w-[720px]">
        <div className="grid grid-cols-12 bg-neutral-950/80 px-4 py-2 text-xs text-neutral-400">
          <div className="col-span-2">Item Code</div>
          <div className="col-span-3">Product</div>
          <div className="col-span-3">Holder</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Updated</div>
        </div>
        {rows.map((r, idx) => (
          <div key={r.code} className={`grid grid-cols-12 px-4 py-3 text-sm ${idx % 2 === 0 ? 'bg-neutral-950/40' : ''} hover:bg-neutral-900/60` }>
            <div className="col-span-2 font-mono">{r.code}</div>
            <div className="col-span-3">{r.product}</div>
            <div className="col-span-3">{r.holder}</div>
            <div className="col-span-2">
              <span className={`px-2 py-0.5 text-xs rounded ${r.status === 'Issued' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>{r.status}</span>
            </div>
            <div className="col-span-2 text-right text-neutral-400">{r.updated}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [stats, setStats] = useState({
    totalProducts: 24,
    itemsInStock: 168,
    currentlyIssued: 27,
    overdue: 2,
  })
  const [activity, setActivity] = useState<ActivityRow[]>(Array.from({ length: 6 }).map((_, i) => ({
    code: `objA${i + 1}`,
    product: 'Spanner Set A',
    holder: i % 2 === 0 ? 'Rohan Kumar' : 'Priya Singh',
    status: (i % 2 === 0 ? 'Issued' : 'In Stock') as ActivityRow['status'],
    updated: '2025-09-18 13:20',
  })))

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    ;(async () => {
      try {
        // Stats
        const [{ count: productCount }, { count: inStockCount }, { count: issuedCount }, overdueRes] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'in_stock'),
          supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'issued'),
          supabase.from('assignments').select('*', { count: 'exact', head: true }).eq('status', 'issued').lt('due_at', new Date().toISOString()),
        ])

        setStats((s) => ({
          ...s,
          totalProducts: productCount ?? s.totalProducts,
          itemsInStock: inStockCount ?? s.itemsInStock,
          currentlyIssued: issuedCount ?? s.currentlyIssued,
          overdue: overdueRes.count ?? s.overdue,
        }))

        // Recent activity: expects a view or table named recent_activity with columns
        // code, product, holder, status, updated
        const { data: recent, error: recentErr } = await supabase
          .from('recent_activity')
          .select('*')
          .order('updated', { ascending: false })
          .limit(6)

        if (!recentErr && Array.isArray(recent) && recent.length > 0) {
          const rows: ActivityRow[] = recent.map((r: any) => ({
            code: r.code,
            product: r.product,
            holder: r.holder ?? '-',
            status: (r.status === 'issued' ? 'Issued' : 'In Stock') as ActivityRow['status'],
            updated: new Date(r.updated).toLocaleString(),
          }))
          setActivity(rows)
        }
      } catch (e) {
        // Keep fallbacks on any error
        console.warn('Supabase fetch failed, showing fallback data.', e)
      }
    })()
  }, [])

  async function openCamera() {
    try {
      // Open modal first so user sees it during permission prompt
      setCameraOpen(true)
      if (!('mediaDevices' in navigator) || !navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera API not available in this browser/context. Ensure Chrome/Safari is up to date and camera permissions are allowed.')
        return
      }
      if (!window.isSecureContext) {
        setCameraError(`Camera requires HTTPS or localhost. Current protocol: ${window.location.protocol}. Use HTTPS, a tunnel (ngrok), or Android adb reverse for localhost.`)
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      setCameraError('')
      // Try to attach stream immediately, and retry briefly until <video> ref mounts
      const tryAttach = (attempt = 0) => {
        const video = videoRef.current
        if (video && streamRef.current) {
          try {
            video.srcObject = streamRef.current
            const playPromise = video.play()
            if (playPromise && typeof playPromise.then === 'function') {
              playPromise.catch((err: unknown) => {
                console.error('Video play failed:', err)
                setCameraError('Failed to start video preview. Check site camera permissions and try again.')
              })
            }
          } catch (err) {
            console.error('Attaching stream failed:', err)
            setCameraError('Failed to attach camera stream.')
          }
          return
        }
        if (attempt < 10) {
          setTimeout(() => tryAttach(attempt + 1), 50)
        } else {
          setCameraError('Camera initialized, but preview not ready. Please try reopening.')
        }
      }
      tryAttach()
    } catch (err) {
      setCameraError(`Camera access failed: ${err instanceof Error ? err.message : String(err)}`)
      setCameraOpen(true)
    }
  }

  function closeCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      try {
        const v = videoRef.current as HTMLVideoElement & { srcObject?: MediaStream | null }
        ;(v as any).srcObject = null
      } catch {
        // ignore
      }
    }
    setCameraOpen(false)
  }
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Mobile drawer overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden" aria-hidden onClick={() => setMobileNavOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-neutral-950 border-r border-neutral-800 p-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-sm bg-brand flex items-center justify-center"><div className="h-3.5 w-3.5 bg-neutral-900 rotate-45" /></div>
                <div className="font-semibold">Menu</div>
              </div>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 hover:bg-neutral-900" onClick={() => setMobileNavOpen(false)} aria-label="Close Menu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-neutral-300"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="mt-4">
              {/* Reuse Sidebar content for mobile */}
              <div className="text-xs uppercase tracking-widest text-neutral-500">Navigation</div>
              <div className="mt-3 space-y-1">
                {['Overview','Inventory','Issue','Return','Users','Settings'].map((name) => (
                  <button key={name} className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-900/70 text-sm border border-transparent hover:border-neutral-800">
                    {name}
                  </button>
                ))}
              </div>
              <div className="mt-6 text-xs text-neutral-500">Quick Actions</div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <button className="px-3 py-2 rounded-md bg-brand text-neutral-950 text-sm font-semibold">Scan to Issue</button>
                <button className="px-3 py-2 rounded-md border border-neutral-800 text-sm">Scan to Return</button>
                <button className="px-3 py-2 rounded-md border border-neutral-800 text-sm">Add Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Camera Modal (global to Dashboard) */}
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
                <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded p-3">
                  {cameraError}
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={openCamera} className="px-3 py-2 rounded-md bg-brand text-neutral-950 text-sm font-semibold">Retry</button>
                  <button onClick={closeCamera} className="px-3 py-2 rounded-md border border-neutral-800 text-sm">Close</button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                {streamRef.current ? (
                  <div className="relative aspect-[3/4] sm:aspect-video w-full overflow-hidden rounded-none md:rounded-md border border-neutral-800 bg-black">
                    <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline />
                    {/* Scanner overlay */}
                    <div className="pointer-events-none absolute inset-0">
                      {/* Outer dim frame */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
                      {/* Inner guide box */}
                      <div className="absolute inset-10 sm:inset-16 rounded-md border-2 border-brand/60" />
                      {/* Corner marks */}
                      <div className="absolute inset-10 sm:inset-16">
                        <div className="absolute -top-1 -left-1 h-6 w-6 border-t-2 border-l-2 border-brand" />
                        <div className="absolute -top-1 -right-1 h-6 w-6 border-t-2 border-r-2 border-brand" />
                        <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-2 border-l-2 border-brand" />
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-2 border-r-2 border-brand" />
                      </div>
                      {/* Animated scanning line */}
                      <div className="absolute left-10 right-10 sm:left-16 sm:right-16">
                        <div className="h-[2px] bg-brand/80 shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-[scan_2.2s_linear_infinite]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 rounded-md border border-neutral-800 bg-neutral-950/50 text-sm text-neutral-400">
                    Initializing camera...
                  </div>
                )}
                <div className="mt-3 text-xs text-neutral-400">
                  Align the barcode within the frame. We’ll add auto-decoding next.
                </div>
                {/* Local keyframes for scanning line */}
                <style>{`@keyframes scan { 0% { transform: translateY(12%); } 50% { transform: translateY(85%); } 100% { transform: translateY(12%); } }`}</style>
              </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeCamera} className="px-3 py-2 rounded-md border border-neutral-800 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <div className="mt-4 md:mt-6 flex gap-6">
          <Sidebar />
          <main className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <StatCard title="Total Products" value={stats.totalProducts} hint="+3 this week" />
              <StatCard title="Items in Stock" value={stats.itemsInStock} hint="-5 today" />
              <StatCard title="Currently Issued" value={stats.currentlyIssued} hint="5 due tomorrow" />
              <StatCard title="Overdue" value={stats.overdue} />
            </div>
            <div className="mt-4 md:mt-6 grid lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                  <button className="text-sm text-neutral-300 hover:text-white hidden sm:inline-flex">View all</button>
                </div>
                <div className="hidden md:block">
                  <Table rows={activity} />
                </div>
                <div className="md:hidden">
                  <MobileActivityList rows={activity} />
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
                  <h3 className="font-semibold">Scanner</h3>
                  <p className="mt-1 text-sm text-neutral-400">Connect a USB barcode scanner or use your phone camera.</p>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button className="px-3 py-2 rounded-md bg-brand text-neutral-950 text-sm font-semibold" onClick={openCamera}>Open Camera</button>
                    <button className="px-3 py-2 rounded-md border border-neutral-800 text-sm">Test USB Scanner</button>
                  </div>
                </div>
                <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
                  <h3 className="font-semibold">Quick Links</h3>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <button className="px-3 py-2 rounded-md border border-neutral-800 text-left text-sm hover:bg-neutral-900/60">Generate Barcodes</button>
                    <button className="px-3 py-2 rounded-md border border-neutral-800 text-left text-sm hover:bg-neutral-900/60">Add Items (objA1..objA10)</button>
                    <button className="px-3 py-2 rounded-md border border-neutral-800 text-left text-sm hover:bg-neutral-900/60">Assignments & Logs</button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
