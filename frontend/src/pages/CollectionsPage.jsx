import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { createCollection, updateCollection, assignCollection } from '../utils/api'

const COLORS = ['#d4a843','#e87070','#7090e8','#6bb86b','#b870e8','#70c8e8','#e8a070','#70e8c8']

function CollectionModal({ existing, onClose, onSave }) {
  const [name, setName] = useState(existing?.name || '')
  const [desc, setDesc] = useState(existing?.description || '')
  const [color, setColor] = useState(existing?.color || COLORS[0])
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      let result
      if (existing) {
        result = await updateCollection(existing.id, { name, description: desc, color })
      } else {
        result = await createCollection({ name, description: desc, color })
      }
      onSave(result, !!existing)
      onClose()
    } catch (e) {
      alert('Failed to save collection')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card p-6 w-96 max-w-[90vw] fade-up">
        <h3 className="font-serif text-lg mb-4" style={{ color: 'var(--text)' }}>
          {existing ? 'Edit Collection' : 'New Collection'}
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text3)' }}>Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Research Papers"
              className="input-base w-full" onKeyDown={e => e.key === 'Enter' && handleSave()} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text3)' }}>Description</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Optional description"
              className="input-base w-full" />
          </div>
          <div>
            <label className="text-xs mb-2 block" style={{ color: 'var(--text3)' }}>Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{ background: c, outline: color === c ? `2px solid var(--text)` : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-gold" onClick={handleSave} disabled={!name.trim() || saving}
            style={{ opacity: !name.trim() || saving ? .5 : 1 }}>
            {saving ? 'Saving…' : existing ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AssignModal({ doc, collections, onClose, onAssign }) {
  const [selected, setSelected] = useState(doc.collection_id || '')
  const [saving, setSaving] = useState(false)

  const handleAssign = async () => {
    setSaving(true)
    try {
      await assignCollection(doc.id, selected || null)
      onAssign(doc.id, selected || null)
      onClose()
    } catch (e) {
      alert('Failed to assign')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card p-6 w-80 fade-up">
        <h3 className="font-serif text-base mb-1" style={{ color: 'var(--text)' }}>Assign to Collection</h3>
        <p className="text-xs mb-4 truncate" style={{ color: 'var(--text3)' }}>{doc.name}</p>
        <div className="flex flex-col gap-1.5 mb-4">
          <button onClick={() => setSelected('')}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ background: selected === '' ? 'var(--bg4)' : 'var(--bg3)', color: selected === '' ? 'var(--text)' : 'var(--text2)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--border2)' }} />
            No collection
          </button>
          {collections.map(col => (
            <button key={col.id} onClick={() => setSelected(col.id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
              style={{ background: selected === col.id ? 'var(--bg4)' : 'var(--bg3)', color: selected === col.id ? 'var(--text)' : 'var(--text2)' }}>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: col.color }} />
              {col.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button className="btn-ghost text-sm" onClick={onClose}>Cancel</button>
          <button className="btn-gold text-sm" onClick={handleAssign} disabled={saving}>
            {saving ? 'Saving…' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CollectionsPage() {
  const { collections, docs, addCollection, removeCollection, updateDocCollection } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editCol, setEditCol] = useState(null)
  const [assignDoc, setAssignDoc] = useState(null)
  const [selectedCol, setSelectedCol] = useState(null)

  const handleSave = (col, isEdit) => {
    if (isEdit) {
      // refresh happens via refetch — for now update locally
    } else {
      addCollection(col)
    }
  }

  const colDocs = selectedCol
    ? docs.filter(d => d.collection_id === selectedCol.id)
    : []

  const unassigned = docs.filter(d => !d.collection_id)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)' }} className="px-6 py-4 flex items-center">
        <div className="flex-1">
          <h1 className="font-serif text-lg" style={{ color: 'var(--text)' }}>Collections</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
            {collections.length} collection{collections.length !== 1 ? 's' : ''} · {docs.filter(d => d.collection_id).length} docs assigned
          </p>
        </div>
        <button onClick={() => { setEditCol(null); setModalOpen(true) }} className="btn-gold text-sm flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/></svg>
          New Collection
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>No collections yet.</p>
            <button onClick={() => setModalOpen(true)} className="btn-gold text-sm">Create your first collection</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {collections.map(col => {
              const colDocList = docs.filter(d => d.collection_id === col.id)
              return (
                <div key={col.id}
                  onClick={() => setSelectedCol(prev => prev?.id === col.id ? null : col)}
                  className="card p-4 cursor-pointer transition-all hover:border-[var(--border2)]"
                  style={{ borderColor: selectedCol?.id === col.id ? col.color : undefined }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: col.color + '22' }}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill={col.color}>
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium" style={{ color: 'var(--text)' }}>{col.name}</h3>
                      {col.description && <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text3)' }}>{col.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: col.color + '22', color: col.color }}>
                      {colDocList.length} doc{colDocList.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={e => { e.stopPropagation(); setEditCol(col); setModalOpen(true) }}
                        className="text-xs px-2 py-1 rounded transition-all"
                        style={{ color: 'var(--text3)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                        Edit
                      </button>
                      <button onClick={e => { e.stopPropagation(); removeCollection(col.id) }}
                        className="text-xs px-2 py-1 rounded transition-all"
                        style={{ color: 'var(--text3)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--rust)'; e.currentTarget.style.background = 'rgba(196,98,45,.15)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.background = 'transparent' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Selected collection docs */}
        {selectedCol && (
          <div className="mb-8">
            <h2 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <div className="w-3 h-3 rounded-full" style={{ background: selectedCol.color }} />
              {selectedCol.name} — {colDocs.length} document{colDocs.length !== 1 ? 's' : ''}
            </h2>
            {colDocs.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text3)' }}>No documents in this collection yet. Assign documents below.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {colDocs.map(doc => (
                  <div key={doc.id} className="card p-3 flex items-center gap-3">
                    <div style={{ background: doc.type === 'pdf' ? '#3a1a1a' : doc.type === 'md' ? '#1a1a3a' : '#1a2a1a', color: doc.type === 'pdf' ? '#e87070' : doc.type === 'md' ? '#7090e8' : '#6bb86b' }}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-mono flex-shrink-0">
                      {doc.type.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{doc.name}</p>
                      <p className="text-[10.5px]" style={{ color: 'var(--text3)' }}>{doc.size_label}</p>
                    </div>
                    <button onClick={() => setAssignDoc(doc)} className="text-xs px-2 py-1 rounded transition-all"
                      style={{ color: 'var(--text3)', background: 'var(--bg3)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                      Move
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Unassigned docs */}
        {unassigned.length > 0 && (
          <div>
            <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text2)' }}>
              Unassigned documents ({unassigned.length})
            </h2>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {unassigned.map(doc => (
                <div key={doc.id} className="card p-3 flex items-center gap-3"
                  style={{ opacity: collections.length === 0 ? .5 : 1 }}>
                  <div style={{ background: doc.type === 'pdf' ? '#3a1a1a' : doc.type === 'md' ? '#1a1a3a' : '#1a2a1a', color: doc.type === 'pdf' ? '#e87070' : doc.type === 'md' ? '#7090e8' : '#6bb86b' }}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-mono flex-shrink-0">
                    {doc.type.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{doc.name}</p>
                    <p className="text-[10.5px]" style={{ color: 'var(--text3)' }}>{doc.size_label} · {doc.chunk_count} chunks</p>
                  </div>
                  {collections.length > 0 && (
                    <button onClick={() => setAssignDoc(doc)} className="text-xs px-2 py-1 rounded transition-all"
                      style={{ color: 'var(--gold2)', background: 'rgba(212,168,67,.1)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,67,.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,168,67,.1)'}>
                      Assign
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <CollectionModal
          existing={editCol}
          onClose={() => { setModalOpen(false); setEditCol(null) }}
          onSave={handleSave} />
      )}
      {assignDoc && (
        <AssignModal
          doc={assignDoc}
          collections={collections}
          onClose={() => setAssignDoc(null)}
          onAssign={(docId, colId) => { updateDocCollection(docId, colId); setAssignDoc(null) }} />
      )}
    </div>
  )
}
