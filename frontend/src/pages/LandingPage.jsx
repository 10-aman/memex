import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  {
    icon: '📄',
    title: 'Upload Any Document',
    desc: 'PDF, TXT, or Markdown files. Text is extracted, chunked, and indexed automatically.',
  },
  {
    icon: '🧠',
    title: 'Vector Embeddings',
    desc: 'Every chunk is embedded with MiniLM-L6 locally — no extra API needed. Semantic similarity search, not just keywords.',
  },
  {
    icon: '💬',
    title: 'Chat with Your Docs',
    desc: 'Ask questions in natural language. Get answers with source citations pointing back to exact documents.',
  },
  {
    icon: '📁',
    title: 'Collections',
    desc: 'Organise documents into folders. Scope your chat to a single collection or single document.',
  },
  {
    icon: '⚡',
    title: 'Groq-Powered Speed',
    desc: 'Answers arrive in under a second. Groq\'s inference hardware runs LLaMA 3.3 70B faster than any other provider.',
  },
  {
    icon: '🕰️',
    title: 'Chat History',
    desc: 'Every Q&A pair is saved. Browse your history and export as plain text anytime.',
  },
]

const STACK = [
  { label: 'LLM', value: 'LLaMA 3.3 70B', sub: 'via Groq API', color: '#d4a843' },
  { label: 'Embeddings', value: 'all-MiniLM-L6-v2', sub: 'sentence-transformers · local', color: '#7090e8' },
  { label: 'Search', value: 'Cosine Similarity', sub: 'in-memory vector search', color: '#6bb86b' },
  { label: 'Backend', value: 'FastAPI', sub: 'Python 3.12', color: '#e87070' },
  { label: 'Frontend', value: 'React 18 + Vite', sub: 'Tailwind CSS', color: '#70c8e8' },
  { label: 'Auth', value: 'Firebase Auth', sub: 'Google & Email/Password', color: '#b870e8' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}
        className="sticky top-0 z-50 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2.5 flex-1">
          <div style={{ background: 'var(--gold)', borderRadius: 8 }} className="w-8 h-8 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--bg)">
              <path d="M3 3h14v2H3V3zm0 4h10v2H3V7zm0 4h14v2H3v-2zm0 4h8v2H3v-2z"/>
            </svg>
          </div>
          <span className="font-serif text-xl" style={{ color: 'var(--gold2)' }}>Memex</span>
        </div>
        <div className="flex gap-3">
          {user ? (
            <button onClick={() => navigate('/app')} className="btn-gold text-sm">Open App</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-ghost text-sm">Sign in</button>
              <button onClick={() => navigate('/signup')} className="btn-gold text-sm">Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-20 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-8"
          style={{ background: 'rgba(212,168,67,.12)', border: '1px solid rgba(212,168,67,.3)', color: 'var(--gold2)' }}>
          <span>⚡</span> Powered by LLaMA 3.3 70B on Groq
        </div>
        <h1 className="font-serif mb-6" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.15, color: 'var(--text)' }}>
          Your personal<br />
          <span style={{ color: 'var(--gold2)', fontStyle: 'italic' }}>knowledge base</span><br />
          that talks back
        </h1>
        <p className="text-base mb-10 mx-auto max-w-xl" style={{ color: 'var(--text2)', lineHeight: 1.75 }}>
          Upload your PDFs, notes, and research. Ask questions in plain English.
          Get answers with exact source citations — powered by real semantic search and a state-of-the-art LLM.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate(user ? '/app' : '/signup')}
            className="btn-gold px-6 py-3 text-base flex items-center gap-2">
            Get Started Free
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          <button onClick={() => document.getElementById('stack').scrollIntoView({ behavior: 'smooth' })}
            className="btn-ghost px-6 py-3 text-base">
            See how it works
          </button>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(f => (
            <div key={f.title} className="card p-5 transition-all hover:border-[var(--border2)]">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div style={{ borderTop: '1px solid var(--border)' }} className="pt-16">
          <h2 className="font-serif text-2xl text-center mb-2" style={{ color: 'var(--text)' }}>How it works</h2>
          <p className="text-sm text-center mb-12" style={{ color: 'var(--text3)' }}>Three steps from document to answer</p>
          <div className="flex flex-col gap-0">
            {[
              { n: '01', title: 'Upload', desc: 'Drop in any PDF, TXT, or Markdown file. The backend extracts all text and splits it into overlapping 400-word chunks for precise retrieval.' },
              { n: '02', title: 'Embed', desc: 'Each chunk is converted into a 384-dimension vector using MiniLM-L6-v2 running locally. No data leaves your machine for this step.' },
              { n: '03', title: 'Ask', desc: 'Your question is embedded with the same model. Cosine similarity finds the most relevant chunks, which are sent as context to LLaMA 3.3 70B on Groq. You get an answer with citations in under a second.' },
            ].map((step, i) => (
              <div key={step.n} className="flex gap-5 pb-10 relative">
                {i < 2 && (
                  <div className="absolute left-5 top-10 w-px h-full" style={{ background: 'var(--border)' }} />
                )}
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-mono font-medium z-10"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--gold2)' }}>
                  {step.n}
                </div>
                <div className="pt-1.5">
                  <h3 className="text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="stack" className="px-6 pb-20 max-w-4xl mx-auto">
        <div style={{ borderTop: '1px solid var(--border)' }} className="pt-16">
          <h2 className="font-serif text-2xl text-center mb-2" style={{ color: 'var(--text)' }}>Technology Stack</h2>
          <p className="text-sm text-center mb-10" style={{ color: 'var(--text3)' }}>Open, fast, and free-tier friendly</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {STACK.map(s => (
              <div key={s.label} className="card p-4">
                <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text3)' }}>{s.label}</div>
                <div className="text-sm font-medium mb-0.5" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px]" style={{ color: 'var(--text3)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 max-w-xl mx-auto text-center">
        <div style={{ borderTop: '1px solid var(--border)' }} className="pt-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: 'var(--text)' }}>Ready to build your second brain?</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
            Free to use. Bring your own Groq API key. Your documents stay on your machine.
          </p>
          <button onClick={() => navigate(user ? '/app' : '/signup')}
            className="btn-gold px-8 py-3 text-base">
            {user ? 'Open App →' : 'Create Free Account →'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)' }} className="px-6 py-6 text-center">
        <p className="text-xs" style={{ color: 'var(--text3)' }}>
          Memex · Personal Knowledge Base · Built with FastAPI, React, and LLaMA 3.3 70B
        </p>
      </footer>

    </div>
  )
}
