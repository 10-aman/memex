import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import UploadModal from '../components/UploadModal'

const TYPE_COLORS = {
  pdf: { bg: '#3a1a1a', color: '#e87070', label: 'PDF' },
  txt: { bg: '#1a2a1a', color: '#6bb86b', label: 'TXT' },
  md:  { bg: '#1a1a3a', color: '#7090e8', label: 'MD' },
}

export default function DocumentsPage() {
  const { docs, loading, removeDoc, setActiveDocId } = useApp()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))

  const focusAndChat = (id) => {
    setActiveDocId(id)
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)' }} className="px-6 py-4 flex items-center gap-3">
        <div className="flex-1">
          <h1 className="font-serif text-lg" style={{ color: 'var(--text)' }}>Documents</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{docs.length} document{docs.length !== 1 ? 's' : ''} in your knowledge base</p>
        </div>
        <button onClick={() => setUploadOpen(true)} className="btn-gold flex items-center gap-2 text-sm">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          Upload
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Search */}
        {docs.length > 0 && (
          <input
            type="text" placeholder="Search documents…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base w-full mb-5" />
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-sm" style={{ color: 'var(--text3)' }}>Loading…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="text-4xl mb-4">{docs.length === 0 ? '📭' : '🔍'}</div>
            <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>
              {docs.length === 0 ? 'No documents yet.' : 'No documents match your search.'}
            </p>
            {docs.length === 0 && (
              <button onClick={() => setUploadOpen(true)} className="btn-gold text-sm">Upload your first document</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filtered.map(doc => {
              const tc = TYPE_COLORS[doc.type] || TYPE_COLORS.txt
              return (
                <div key={doc.id} className="card p-4 transition-all duration-150 hover:border-[var(--border2)]">
                  <div className="flex items-start gap-3">
                    <div style={{ background: tc.bg, color: tc.color }}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-medium flex-shrink-0">
                      {tc.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{doc.name}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
                        {doc.size_label} · {doc.chunk_count} chunks · Added {doc.added}
                      </p>
                    </div>
                  </div>

                  {doc.preview && (
                    <p className="text-xs mt-3 leading-relaxed line-clamp-3"
                      style={{ color: 'var(--text2)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {doc.preview}
                    </p>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button onClick={() => focusAndChat(doc.id)}
                      className="flex-1 text-xs py-2 rounded-lg transition-all"
                      style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold2)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}>
                      Chat with this doc
                    </button>
                    <button onClick={() => removeDoc(doc.id)}
                      className="px-3 py-2 text-xs rounded-lg transition-all"
                      style={{ background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,98,45,.15)'; e.currentTarget.style.color = 'var(--rust)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text3)' }}>
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
    </div>
  )
}
