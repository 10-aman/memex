import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import UploadModal from './UploadModal'

const DocIcon = ({ type }) => {
  const s = { pdf: ['#3a1a1a','#e87070','PDF'], txt: ['#1a2a1a','#6bb86b','TXT'], md: ['#1a1a3a','#7090e8','MD'] }[type] || ['#1a2a1a','#6bb86b','TXT']
  return <div style={{ background: s[0], color: s[1] }} className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-mono font-medium flex-shrink-0">{s[2]}</div>
}

export default function Sidebar() {
  const { docs, collections, activeDocId, setActiveDocId, activeCollectionId, setActiveCollectionId, removeDoc } = useApp()
  const { user, logout } = useAuth()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [docsExpanded, setDocsExpanded] = useState(true)
  const [colsExpanded, setColsExpanded] = useState(true)
  const navigate = useNavigate()

  const handleDocClick = (id) => {
    setActiveDocId(prev => prev === id ? null : id)
    setActiveCollectionId(null)
    navigate('/app')
  }

  const handleColClick = (id) => {
    setActiveCollectionId(prev => prev === id ? null : id)
    setActiveDocId(null)
    navigate('/app')
  }

  return (
    <>
      <aside style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)' }} className="flex flex-col h-screen w-64 flex-shrink-0">

        {/* Logo */}
        <div style={{ borderBottom: '1px solid var(--border)' }} className="p-5 flex items-center gap-3">
          <div style={{ background: 'var(--gold)', borderRadius: 8 }} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--bg)"><path d="M3 3h14v2H3V3zm0 4h10v2H3V7zm0 4h14v2H3v-2zm0 4h8v2H3v-2z"/></svg>
          </div>
          <div>
            <div className="font-serif text-xl" style={{ color: 'var(--gold2)', lineHeight: 1.1 }}>Memex</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text3)' }}>Knowledge Base</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 pt-4 pb-2">
          <div className="text-[10px] uppercase tracking-widest mb-2 px-2" style={{ color: 'var(--text3)' }}>Views</div>
          {[
            { to: '/app', label: 'Chat', icon: <ChatIcon /> },
            { to: '/app/documents', label: 'Documents', icon: <DocsIcon /> },
            { to: '/app/collections', label: 'Collections', icon: <ColIcon /> },
            { to: '/app/history', label: 'History', icon: <HistoryIcon /> },
          ].map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/app'}
              className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-all duration-150 ` + (isActive ? 'font-medium' : 'hover:bg-[var(--bg3)]')}
              style={({ isActive }) => ({ background: isActive ? 'var(--bg4)' : 'transparent', color: isActive ? 'var(--gold2)' : 'var(--text2)' })}>
              <span className="opacity-70">{icon}</span>{label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto px-3 pb-2">

          {/* Collections in sidebar */}
          {collections.length > 0 && (
            <>
              <button onClick={() => setColsExpanded(p => !p)}
                className="text-[10px] uppercase tracking-widest mb-1 px-2 pt-3 pb-1 flex items-center gap-1 w-full text-left"
                style={{ color: 'var(--text3)' }}>
                <span style={{ display: 'inline-block', transform: colsExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>›</span>
                Collections ({collections.length})
              </button>
              {colsExpanded && collections.map(col => (
                <div key={col.id}
                  onClick={() => handleColClick(col.id)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 cursor-pointer transition-all text-xs"
                  style={{ background: activeCollectionId === col.id ? 'var(--bg4)' : 'transparent', color: activeCollectionId === col.id ? 'var(--gold2)' : 'var(--text2)' }}
                  onMouseEnter={e => { if (activeCollectionId !== col.id) e.currentTarget.style.background = 'var(--bg3)' }}
                  onMouseLeave={e => { if (activeCollectionId !== col.id) e.currentTarget.style.background = 'transparent' }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: col.color }} />
                  <span className="flex-1 truncate">{col.name}</span>
                  <span style={{ color: 'var(--text3)' }}>{col.doc_count}</span>
                </div>
              ))}
            </>
          )}

          {/* Docs in sidebar */}
          <button onClick={() => setDocsExpanded(p => !p)}
            className="text-[10px] uppercase tracking-widest mb-1 px-2 pt-3 pb-1 flex items-center gap-1 w-full text-left"
            style={{ color: 'var(--text3)' }}>
            <span style={{ display: 'inline-block', transform: docsExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>›</span>
            Documents ({docs.length})
          </button>

          {docsExpanded && (docs.length === 0 ? (
            <p className="px-2 text-xs" style={{ color: 'var(--text3)' }}>No documents yet.</p>
          ) : docs.map(doc => (
            <div key={doc.id}
              onClick={() => handleDocClick(doc.id)}
              className="group flex items-center gap-2 px-2 py-2 rounded-lg mb-0.5 cursor-pointer transition-all duration-150 relative"
              style={{ background: activeDocId === doc.id ? 'var(--bg4)' : 'transparent' }}
              onMouseEnter={e => { if (activeDocId !== doc.id) e.currentTarget.style.background = 'var(--bg3)' }}
              onMouseLeave={e => { if (activeDocId !== doc.id) e.currentTarget.style.background = 'transparent' }}>
              <DocIcon type={doc.type} />
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate" style={{ color: 'var(--text)' }}>{doc.name}</div>
                <div className="text-[10.5px] flex items-center gap-1" style={{ color: 'var(--text3)' }}>
                  {doc.embedded && <span style={{ color: 'var(--sage)' }}>⬡</span>}
                  {doc.size_label} · {doc.chunk_count}c
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); removeDoc(doc.id) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1.5 py-0.5 rounded"
                style={{ color: 'var(--text3)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--rust)'; e.currentTarget.style.background = 'rgba(196,98,45,.15)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.background = 'transparent' }}>✕</button>
            </div>
          )))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} className="p-3 flex flex-col gap-2">
          <button onClick={() => setUploadOpen(true)} className="btn-gold w-full flex items-center justify-center gap-2">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/></svg>
            Upload Document
          </button>
          {/* User info */}
          <div className="flex items-center gap-2 px-1 py-1 rounded-lg" style={{ background: 'var(--bg3)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
              style={{ background: 'var(--gold)', color: 'var(--bg)' }}>
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text3)' }}>{user?.email}</p>
            </div>
            <button onClick={logout} title="Sign out"
              className="p-1.5 rounded transition-all flex-shrink-0"
              style={{ color: 'var(--text3)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--rust)'; e.currentTarget.style.background = 'rgba(196,98,45,.15)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.background = 'transparent' }}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
    </>
  )
}

const ChatIcon = () => <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 4V4z"/></svg>
const DocsIcon = () => <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
const ColIcon = () => <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
const HistoryIcon = () => <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
