import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface Model {
  id: number
  name: string
  problem_description: string
  task_type: string
  status: string
  accuracy?: number
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  completed: 'var(--accent-mint)',
  training: 'var(--accent-luna)',
  failed: 'var(--accent-ember)',
  pending: 'var(--text-muted)'
}

export default function Dashboard() {
  const { user, token } = useAuth()
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo('.dash-item',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.2 }
    )
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API}/models`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setModels(res.data.models || [])
    } catch { setModels([]) }
    finally { setLoading(false) }
  }

  const STATS = [
    { label: 'Total Models', val: models.length, color: 'var(--accent-luna)' },
    { label: 'Completed', val: models.filter(m => m.status === 'completed').length, color: 'var(--accent-mint)' },
    { label: 'In Training', val: models.filter(m => m.status === 'training').length, color: 'var(--accent-cyan)' },
    { label: 'Avg Accuracy', val: models.filter(m => m.accuracy).length
      ? `${(models.filter(m => m.accuracy).reduce((a, m) => a + (m.accuracy || 0), 0) / models.filter(m => m.accuracy).length).toFixed(1)}%`
      : '—', color: 'var(--accent-ember)' }
  ]

  return (
    <div className="min-h-screen pt-20 px-6 pb-12" style={{ background: 'var(--bg-void)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="dash-item mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                DASHBOARD
              </p>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ letterSpacing: '-0.02em' }}>
                Welcome back, <span className="grad-text">{user?.name?.split(' ')[0]}</span>
              </h1>
            </div>
            <Link to="/builder" data-hover
              className="btn-luna px-6 py-3 rounded-xl text-sm font-semibold relative z-10 hidden md:inline-block">
              + New Model
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="dash-item grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => (
            <div key={i} className="glass rounded-xl p-5 relative overflow-hidden">
              <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>
                {s.val}
              </div>
              <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-4 translate-x-4 opacity-10"
                style={{ background: s.color, filter: 'blur(20px)' }} />
            </div>
          ))}
        </div>

        {/* Models */}
        <div className="dash-item">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Your Models</h2>
            <Link to="/models" className="text-xs text-[var(--accent-luna-bright)] hover:underline" data-hover>
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass rounded-xl h-40 animate-pulse" />
              ))}
            </div>
          ) : models.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center border-dashed">
              <div className="text-4xl mb-4 opacity-40">◈</div>
              <h3 className="font-semibold mb-2">No models yet</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Build your first ML model in under a minute
              </p>
              <Link to="/builder" data-hover
                className="btn-luna px-6 py-2.5 rounded-xl text-sm font-semibold relative z-10 inline-block">
                Start Building
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.slice(0, 6).map((m, i) => (
                <Link key={i} to={`/models/${m.id}`} data-hover
                  className="glass rounded-xl p-5 hover:border-[var(--accent-luna)] transition-all duration-300 block group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="tag text-xs">{m.task_type || 'Classification'}</span>
                    <span className="text-xs flex items-center gap-1.5" style={{ color: STATUS_COLORS[m.status] || 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: STATUS_COLORS[m.status] || 'var(--text-muted)' }} />
                      {m.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-2 group-hover:text-[var(--accent-luna-bright)] transition-colors line-clamp-2">
                    {m.name || m.problem_description?.slice(0, 60)}
                  </h3>
                  {m.accuracy && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">Accuracy</span>
                        <span style={{ color: 'var(--accent-mint)', fontFamily: 'var(--font-mono)' }}>
                          {m.accuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 rounded-full bg-[var(--bg-elevated)]">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${m.accuracy}%`, background: 'var(--accent-mint)' }} />
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile new model button */}
        <div className="dash-item md:hidden mt-6">
          <Link to="/builder" className="btn-luna w-full py-3.5 rounded-xl text-sm font-semibold relative z-10 block text-center">
            + Build New Model
          </Link>
        </div>
      </div>
    </div>
  )
}
