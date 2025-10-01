import { useMemo } from 'react'
import { Link } from 'react-router-dom'

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-sm bg-brand shadow-[0_0_30px_rgba(34,211,238,0.35)] flex items-center justify-center">
        <div className="h-4 w-4 bg-neutral-900 rotate-45" />
      </div>
      <span className="font-semibold tracking-wide">ScanSetu</span>
    </div>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800/60 backdrop-blur bg-neutral-950/70">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="px-4 py-2 rounded-md border border-neutral-800 text-neutral-200 hover:bg-neutral-900">
            Dashboard
          </Link>
          <button className="px-4 py-2 rounded-md bg-brand text-neutral-950 font-medium hover:opacity-90 transition-opacity">
            Sign in with Google
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const year = useMemo(() => new Date().getFullYear(), [])
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-mech/20 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Barcode-based Inventory
              <span className="block text-brand">for Labs & Workshops</span>
            </h1>
            <p className="mt-5 text-neutral-300 text-lg max-w-prose">
              Issue and return items with Google login, barcodes, and real-time tracking. Works with phone cameras and USB barcode scanners.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#features" className="px-5 py-3 rounded-md bg-brand text-neutral-950 font-semibold">
                Explore Features
              </a>
              <a href="#how" className="px-5 py-3 rounded-md border border-neutral-800 text-neutral-200 hover:bg-neutral-900">
                How it works
              </a>
            </div>
            <div className="mt-6 text-xs text-neutral-400">
              Final Year Project • Mechanical Engineering • {year}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 shadow-2xl">
              <div className="h-64 md:h-80 rounded-lg border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900 grid grid-cols-6 gap-2 p-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="col-span-3 md:col-span-2 rounded-md border border-neutral-800 bg-neutral-950/70 p-4">
                    <div className="h-24 rounded bg-neutral-900 flex items-center justify-center">
                      <div className="h-10 w-10 bg-brand/30 border border-brand/40" />
                    </div>
                    <div className="mt-3 h-2 w-24 bg-neutral-800" />
                    <div className="mt-2 h-2 w-32 bg-neutral-800" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 px-3 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
              Preview • Admin Dashboard
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const items = [
    {
      title: 'Role-based Access',
      desc: 'Admins manage stock; users issue/return with audit trail.',
    },
    {
      title: 'Barcode Generation',
      desc: 'Auto-generate per-item codes (objA1…objA10).',
    },
    {
      title: 'Scan Anywhere',
      desc: 'Use phone camera (ZXing/QuaggaJS) or USB barcode scanners.',
    },
    {
      title: 'Issue & Return',
      desc: 'Track who has what and when; return to stock in one scan.',
    },
  ]
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <h2 className="text-2xl md:text-3xl font-bold">Features</h2>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((f) => (
          <div key={f.title} className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5 hover:bg-neutral-900/60 transition-colors">
            <div className="h-10 w-10 rounded bg-brand/20 border border-brand/30" />
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-neutral-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: 'Admin adds products',
      desc: 'Create products and auto-generate barcodes for each item.',
    },
    {
      step: '2',
      title: 'User scans to issue',
      desc: 'After Google login, scanning assigns the item to the user.',
    },
    {
      step: '3',
      title: 'Admin scans to return',
      desc: 'See who had it last, then mark as returned to stock.',
    },
  ]
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.step} className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
            <div className="text-brand text-sm">Step {s.step}</div>
            <h3 className="mt-1 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-neutral-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-neutral-800/60">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-xs">© {new Date().getFullYear()} ScanSetu</span>
        </div>
        <div className="flex items-center gap-6">
          <a className="hover:text-white" href="#">GitHub</a>
          <a className="hover:text-white" href="#">Privacy</a>
          <a className="hover:text-white" href="#">Terms</a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  )
}
