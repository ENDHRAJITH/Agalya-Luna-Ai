import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { gsap } from 'gsap'
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
  completed: '#00FFB3',
  training: '#7B6EF6',
  failed: '#FF6B35',
  pending: '#3D3C52'
}

export default function Models() {
  const { token } = useAuth()
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API}/models`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setModels(res.data.models || [])
    } catch { setModels([]) }
    finally {
      setLoading(false)
      gsap.fromTo('.model-row',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: 'power3.out' }
      )
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: 'var(--bg-void)' }}>
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>MODELS</p>
            <h1 className="text-3xl font-bold" style={{ letterSpacing: '-0.02em' }}>
              My <span className="grad-text">Models</span>
            </h1>
          </div>
          <Link to="/builder" data-hover className="btn-luna px-5 py-2.5 rounded-xl text-sm font-semibold relative z-10">
            + New Model
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : models.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <div className="text-4xl mb-4 opacity-40">◈</div>
            <h3 className="font-semibold mb-2">No models yet</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Build your first ML model</p>
            <Link to="/builder" data-hover className="btn-luna px-6 py-2.5 rounded-xl text-sm font-semibold relative z-10 inline-block">
              Start Building
            </Link>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-[var(--border-subtle)] text-xs text-[var(--text-muted)] uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-mono)' }}>
              <div className="col-span-5">Problem</div>
              <div className="col-span-2">Task</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Accuracy</div>
              <div className="col-span-1">—</div>
            </div>
            {models.map((m, i) => (
              <div key={i} className="model-row grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-glass)] transition-colors group">
                <div className="md:col-span-5">
                  <p className="text-sm font-medium line-clamp-1 group-hover:text-[var(--accent-luna-bright)] transition-colors">
                    {m.name || m.problem_description?.slice(0, 60)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="tag text-xs">{m.task_type || '—'}</span>
                </div>
                <div className="md:col-span-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLORS[m.status] || STATUS_COLORS.pending }} />
                  <span className="text-xs capitalize" style={{ color: STATUS_COLORS[m.status] || STATUS_COLORS.pending, fontFamily: 'var(--font-mono)' }}>
                    {m.status}
                  </span>
                </div>
                <div className="md:col-span-2 flex items-center">
                  {m.accuracy ? (
                    <span className="text-sm font-mono" style={{ color: 'var(--accent-mint)' }}>
                      {(m.accuracy * 100).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">—</span>
                  )}
                </div>
                <div className="md:col-span-1 flex items-center justify-end">
                  <Link to={`/models/${m.id}`} data-hover
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-luna-bright)] transition-colors">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
