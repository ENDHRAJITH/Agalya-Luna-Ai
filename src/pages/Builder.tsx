import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const EXAMPLES = [
  'Classify emails as spam or not spam',
  'Predict house prices based on location and size',
  'Detect fraudulent credit card transactions',
  'Classify iris flowers by species',
  'Predict customer churn for a subscription service',
]

type Stage = 'input' | 'training' | 'done' | 'error'

interface TrainResult {
  task_type: string
  model_type: string
  accuracy?: number
  r2_score?: number
  rmse?: number
  download_url?: string
  explanation?: string
}

export default function Builder() {
  const { token } = useAuth()
  const [problem, setProblem] = useState('')
  const [stage, setStage] = useState<Stage>('input')
  const [result, setResult] = useState<TrainResult | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const PROGRESS_STEPS = [
    { pct: 15, label: 'Analyzing your problem...' },
    { pct: 30, label: 'Selecting best algorithm...' },
    { pct: 50, label: 'Loading dataset...' },
    { pct: 70, label: 'Training model...' },
    { pct: 85, label: 'Evaluating performance...' },
    { pct: 95, label: 'Exporting project...' },
  ]

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  const simulateProgress = () => {
    let i = 0
    const interval = setInterval(() => {
      if (i < PROGRESS_STEPS.length) {
        setProgress(PROGRESS_STEPS[i].pct)
        setProgressLabel(PROGRESS_STEPS[i].label)
        i++
      } else {
        clearInterval(interval)
      }
    }, 1200)
    return interval
  }

  const handleTrain = async () => {
    if (!problem.trim()) return
    setStage('training')
    setProgress(5)
    setProgressLabel('Connecting to Luna pipeline...')

    const progressInterval = simulateProgress()

    try {
      const res = await axios.post(`${API}/models/train`,
        { problem_description: problem },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 }
      )
      clearInterval(progressInterval)
      setProgress(100)
      setProgressLabel('Done!')
      setResult(res.data)
      setTimeout(() => setStage('done'), 600)
    } catch (err: any) {
      clearInterval(progressInterval)
      setError(err?.response?.data?.message || 'Training failed. Is the ML pipeline running?')
      setStage('error')
    }
  }

  const reset = () => {
    setStage('input')
    setProblem('')
    setResult(null)
    setError('')
    setProgress(0)
    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    )
  }

  const MetricCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="glass rounded-xl p-5 text-center">
      <div className="text-2xl font-bold mb-1" style={{ color, fontFamily: 'var(--font-display)' }}>{value}</div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: 'var(--bg-void)' }}>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div ref={containerRef} className="relative z-10 max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="tag mb-4 inline-block">Model Builder</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ letterSpacing: '-0.02em' }}>
            Describe your <span className="grad-text">ML problem</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Plain English. No code. Luna handles everything.
          </p>
        </div>

        {/* INPUT STAGE */}
        {stage === 'input' && (
          <div className="glass rounded-2xl p-6 md:p-8">
            <label className="block text-xs text-[var(--text-muted)] mb-3 uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-mono)' }}>
              Problem Description
            </label>
            <textarea ref={textareaRef} value={problem} onChange={e => setProblem(e.target.value)}
              className="input-luna w-full rounded-xl px-4 py-3 text-sm resize-none mb-4"
              rows={4} placeholder="e.g. Classify emails as spam or not spam based on subject and content..."
            />

            {/* Examples */}
            <div className="mb-6">
              <p className="text-xs text-[var(--text-muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                Try an example:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex, i) => (
                  <button key={i} data-hover onClick={() => setProblem(ex)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)]
                      hover:border-[var(--accent-luna)] hover:text-[var(--accent-luna-bright)] transition-all">
                    {ex.length > 35 ? ex.slice(0, 35) + '...' : ex}
                  </button>
                ))}
              </div>
            </div>

            <button data-hover onClick={handleTrain} disabled={!problem.trim()}
              className="btn-luna w-full py-4 rounded-xl font-semibold relative z-10 disabled:opacity-40 disabled:cursor-not-allowed text-base">
              Train Model →
            </button>
          </div>
        )}

        {/* TRAINING STAGE */}
        {stage === 'training' && (
          <div className="glass rounded-2xl p-8 text-center">
            {/* Animated orb */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border border-[var(--accent-luna)] opacity-30 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-[var(--accent-cyan)] opacity-20 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--accent-luna)] to-[var(--accent-cyan)] opacity-60 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">◉</div>
            </div>

            <h2 className="text-xl font-bold mb-2">Training in progress</h2>
            <p className="text-sm text-[var(--accent-luna-bright)] mb-8" style={{ fontFamily: 'var(--font-mono)' }}>
              {progressLabel}
            </p>

            {/* Progress bar */}
            <div className="relative h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden mb-3">
              <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, var(--accent-luna), var(--accent-cyan))'
                }} />
            </div>
            <p className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
              {progress}%
            </p>

            <div className="mt-8 text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] rounded-lg p-4 text-left"
              style={{ fontFamily: 'var(--font-mono)' }}>
              <p className="text-[var(--accent-luna-bright)] mb-2">&gt; luna pipeline</p>
              <p>→ Problem: <span className="text-[var(--text-secondary)]">"{problem.slice(0, 50)}{problem.length > 50 ? '...' : ''}"</span></p>
              <p className="mt-1 animate-pulse">→ Status: <span className="text-[var(--accent-cyan)]">processing...</span></p>
            </div>
          </div>
        )}

        {/* DONE STAGE */}
        {stage === 'done' && result && (
          <div>
            {/* Success header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent-mint)]/30 bg-[var(--accent-mint)]/5 text-[var(--accent-mint)] text-sm mb-4">
                <span>✓</span> Model trained successfully
              </div>
            </div>

            <div className="glass rounded-2xl p-6 mb-4">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <MetricCard label="Task Type" value={result.task_type || 'Classification'} color="var(--accent-luna-bright)" />
                <MetricCard label="Algorithm" value={result.model_type || 'RandomForest'} color="var(--accent-cyan)" />
                {result.accuracy !== undefined && (
                  <MetricCard label="Accuracy" value={`${(result.accuracy * 100).toFixed(1)}%`} color="var(--accent-mint)" />
                )}
                {result.r2_score !== undefined && (
                  <MetricCard label="R² Score" value={result.r2_score.toFixed(3)} color="var(--accent-mint)" />
                )}
                {result.rmse !== undefined && (
                  <MetricCard label="RMSE" value={result.rmse.toFixed(3)} color="var(--accent-ember)" />
                )}
              </div>

              {result.explanation && (
                <div className="bg-[var(--bg-surface)] rounded-xl p-4 mb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {result.explanation}
                </div>
              )}

              {result.download_url && (
                <a href={`http://localhost:8000${result.download_url}`} data-hover
                  className="btn-luna w-full py-3.5 rounded-xl font-semibold relative z-10 text-center block text-sm">
                  ↓ Download Model ZIP
                </a>
              )}
            </div>

            <button onClick={reset} data-hover
              className="w-full py-3 rounded-xl text-sm text-[var(--text-muted)] border border-[var(--border-subtle)]
                hover:border-[var(--accent-luna)] hover:text-[var(--text-primary)] transition-all">
              ← Build Another Model
            </button>
          </div>
        )}

        {/* ERROR STAGE */}
        {stage === 'error' && (
          <div className="glass rounded-2xl p-8 text-center border-red-500/20">
            <div className="text-4xl mb-4">⚠</div>
            <h2 className="text-xl font-bold mb-2 text-red-400">Training Failed</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">{error}</p>
            <div className="bg-[var(--bg-surface)] rounded-lg p-4 text-xs text-[var(--text-muted)] text-left mb-6"
              style={{ fontFamily: 'var(--font-mono)' }}>
              <p className="mb-1">Make sure:</p>
              <p>1. ML Pipeline is running on port 8000</p>
              <p>2. Backend is running on port 3001</p>
              <p>3. <span className="text-[var(--accent-cyan)]">cd ml-pipeline && python run.py</span></p>
            </div>
            <button onClick={reset} data-hover
              className="btn-luna px-8 py-3 rounded-xl text-sm font-semibold relative z-10">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
