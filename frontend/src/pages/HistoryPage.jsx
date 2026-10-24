import { useState, useEffect } from 'react'
import { getChats, clearChats } from '../utils/api'

export default function HistoryPage() {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const data = await getChats()
      setChats([...data].reverse())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleClear = async () => {
    if (!confirm('Clear all chat history?')) return
    await clearChats()
    setChats([])
  }

  const exportHistory = () => {
    const text = chats.map(c => {
      const d = new Date(c.timestamp * 1000).toLocaleString()
      const srcs = c.sources?.map(s => s.name).join(', ') || 'none'
      return `[${d}]\nQ: ${c.question}\nA: ${c.answer}\nSources: ${srcs}\n`
    }).join('\n---\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'memex-history.txt'
    a.click()
  }

  return (
    <div className="flex flex-col h-full">
      <div style={{ borderBottom: '1px solid var(--border)' }} className="px-6 py-4 flex items-center">
        <div className="flex-1">
          <h1 className="font-serif text-lg" style={{ color: 'var(--text)' }}>Chat History</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{chats.length} saved conversation{chats.length !== 1 ? 's' : ''}</p>
        </div>
        {chats.length > 0 && (
          <div className="flex gap-2">
            <button onClick={exportHistory} className="btn-ghost text-sm">Export .txt</button>
            <button onClick={handleClear} className="text-sm px-3 py-2 rounded-lg transition-all"
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--rust)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-sm" style={{ color: 'var(--text3)' }}>Loading…</div>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="text-4xl mb-3">🕰️</div>
            <p className="text-sm" style={{ color: 'var(--text2)' }}>No chat history yet.</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>Ask questions in the Chat view to build history.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {chats.map(c => (
              <div key={c.id} className="card p-4 fade-up">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-2 flex-wrap">
                    {c.sources?.map(s => (
                      <span key={s.id} className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--bg3)', color: 'var(--gold2)', border: '1px solid var(--border)' }}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs flex-shrink-0 ml-3" style={{ color: 'var(--text3)' }}>
                    {new Date(c.timestamp * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Q: {c.question}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
                  {c.answer.length > 300 ? c.answer.slice(0, 300) + '…' : c.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
