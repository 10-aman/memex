import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { queryDocuments } from '../utils/api'

const SUGGESTIONS = [
  'What are the main themes across my documents?',
  'Summarize the key points from my notes',
  'What topics are covered in my research?',
  'Find connections between my documents',
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 fade-up ${isUser ? 'flex-row-reverse ml-auto max-w-2xl' : 'max-w-2xl'}`}>
      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium"
        style={{
          background: isUser ? 'var(--bg4)' : 'var(--gold)',
          color: isUser ? 'var(--text2)' : 'var(--bg)',
          border: isUser ? '1px solid var(--border)' : 'none',
        }}>
        {isUser ? 'U' : 'M'}
      </div>

      <div className="flex-1">
        <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={{
            background: isUser ? 'var(--bg4)' : 'var(--bg2)',
            border: `1px solid ${isUser ? 'var(--border2)' : 'var(--border)'}`,
            color: 'var(--text)',
            borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          }}
          dangerouslySetInnerHTML={{ __html: msg.content }} />

        {msg.sources?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {msg.sources.map(s => (
              <div key={s.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-all cursor-default"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--gold2)' }}>
                <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
                </svg>
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const { docs, activeDocId, setActiveDocId, activeCollectionId, setActiveCollectionId, collections } = useApp()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()
  const textareaRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const activeDoc = docs.find(d => d.id === activeDocId)
  const activeCol = collections?.find(c => c.id === activeCollectionId)
  const scopeLabel = activeDoc ? activeDoc.name : activeCol ? `📁 ${activeCol.name}` : 'Knowledge Chat'
  const scopeSub = activeDoc
    ? `Focused · ${activeDoc.chunk_count} chunks · ${activeDoc.size_label}`
    : activeCol
    ? `Collection · ${docs.filter(d => d.collection_id === activeCollectionId).length} docs`
    : `Ask questions across ${docs.length} document${docs.length !== 1 ? 's' : ''}`

  const send = async (question) => {
    if (!question.trim() || loading) return
    setInput('')
    textareaRef.current && (textareaRef.current.style.height = 'auto')

    const userMsg = { role: 'user', content: question }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.rawContent || m.content }))
      const docIds = activeDocId ? [activeDocId] : null
      const { answer, sources } = await queryDocuments(question, docIds, activeCollectionId || null, history)

      const formatted = answer
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]/g, '<span style="color:var(--gold2);font-weight:500">[$1]</span>')
        .replace(/\n/g, '<br>')

      setMessages(prev => [...prev, { role: 'assistant', content: formatted, rawContent: answer, sources }])
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to get response. Check the backend is running.'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `<span style="color:var(--rust)">${errMsg}</span>`,
        sources: [],
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  const autoResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}
        className="px-6 py-4 flex items-center gap-3">
        <div className="flex-1">
          <h1 className="font-serif text-lg" style={{ color: 'var(--text)' }}>{scopeLabel}</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{scopeSub}</p>
        </div>
        {(activeDocId || activeCollectionId) && (
          <button onClick={() => { setActiveDocId(null); setActiveCollectionId(null) }} className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}>
            ✕ Clear focus
          </button>
        )}
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}>
            New chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-5">📚</div>
            <h2 className="font-serif text-2xl mb-2" style={{ color: 'var(--text)' }}>Your Personal Memex</h2>
            <p className="text-sm mb-8 max-w-sm" style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
              {docs.length === 0
                ? 'Upload documents using the sidebar, then ask questions in plain language.'
                : 'Ask anything about your documents. The AI will cite its sources.'}
            </p>
            {docs.length > 0 && (
              <div className="grid grid-cols-2 gap-2 max-w-md">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="text-left text-xs p-3 rounded-xl transition-all duration-150"
                    style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((m, i) => <Message key={i} msg={m} />)}
            {loading && (
              <div className="flex gap-3 max-w-2xl fade-up">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium"
                  style={{ background: 'var(--gold)', color: 'var(--bg)' }}>M</div>
                <div className="rounded-2xl px-4 py-3 flex gap-1.5 items-center"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px' }}>
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }} className="px-6 py-4">
        <div className="flex gap-3 items-end rounded-xl px-3 py-2.5 transition-all"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--gold)'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize(e) }}
            onKeyDown={handleKey}
            placeholder={docs.length === 0 ? 'Upload documents to start chatting…' : 'Ask anything about your documents…'}
            disabled={docs.length === 0}
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
            style={{ color: 'var(--text)', fontFamily: 'inherit', maxHeight: 120, minHeight: 22 }} />
          <button onClick={() => send(input)} disabled={!input.trim() || loading || docs.length === 0}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() && !loading && docs.length > 0 ? 'var(--gold)' : 'var(--bg4)',
              cursor: input.trim() && !loading && docs.length > 0 ? 'pointer' : 'not-allowed',
            }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill={input.trim() ? 'var(--bg)' : 'var(--text3)'}>
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text3)' }}>
          
        </p>
      </div>
    </div>
  )
}
