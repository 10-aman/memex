import { useState, useRef } from 'react'
import { uploadDocument } from '../utils/api'
import { useApp } from '../context/AppContext'

export default function UploadModal({ onClose }) {
  const { addDoc } = useApp()
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragover, setDragover] = useState(false)
  const inputRef = useRef()

  const allowed = ['pdf', 'txt', 'md', 'markdown']

  const addFiles = (fileList) => {
    const valid = [...fileList].filter(f => {
      const ext = f.name.split('.').pop().toLowerCase()
      return allowed.includes(ext)
    })
    setFiles(prev => [...prev, ...valid.map(f => ({ file: f, progress: 0, done: false, error: null }))])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    addFiles(e.dataTransfer.files)
  }

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)

    for (let i = 0; i < files.length; i++) {
      const entry = files[i]
      try {
        const doc = await uploadDocument(entry.file, (pct) => {
          setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: pct } : f))
        })
        addDoc(doc)
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: 100, done: true } : f))
      } catch (err) {
        const msg = err.response?.data?.detail || 'Upload failed'
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, error: msg } : f))
      }
    }

    setUploading(false)
    setTimeout(onClose, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card p-7 w-[440px] max-w-[90vw] fade-up">
        <h3 className="font-serif text-xl mb-1" style={{ color: 'var(--text)' }}>Upload Documents</h3>
        <p className="text-sm mb-5" style={{ color: 'var(--text2)' }}>PDF, TXT, or Markdown · Max 10 MB each</p>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragover(true) }}
          onDragLeave={() => setDragover(false)}
          onDrop={handleDrop}
          className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 mb-4"
          style={{
            borderColor: dragover ? 'var(--gold)' : 'var(--border2)',
            background: dragover ? 'rgba(212,168,67,.06)' : 'transparent',
          }}>
          <div className="text-3xl mb-3">📂</div>
          <p className="text-sm" style={{ color: 'var(--text2)' }}>Drop files here or <span style={{ color: 'var(--gold2)' }}>click to browse</span></p>
          <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>.pdf · .txt · .md · .markdown</p>
        </div>
        <input ref={inputRef} type="file" multiple accept=".pdf,.txt,.md,.markdown"
          className="hidden" onChange={e => addFiles(e.target.files)} />

        {/* File list */}
        {files.length > 0 && (
          <div className="flex flex-col gap-2 mb-5">
            {files.map((entry, i) => (
              <div key={i} className="rounded-lg p-3" style={{ background: 'var(--bg3)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm flex-1 truncate" style={{ color: entry.error ? 'var(--rust)' : 'var(--text)' }}>
                    {entry.file.name}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text3)' }}>
                    {(entry.file.size / 1024).toFixed(0)} KB
                  </span>
                  {!uploading && !entry.done && (
                    <button onClick={() => removeFile(i)} className="text-xs" style={{ color: 'var(--text3)' }}>✕</button>
                  )}
                  {entry.done && <span className="text-xs" style={{ color: 'var(--sage)' }}>✓</span>}
                </div>
                {entry.error && <p className="text-xs" style={{ color: 'var(--rust)' }}>{entry.error}</p>}
                {(uploading || entry.done) && !entry.error && (
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg4)' }}>
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: entry.progress + '%',
                        background: entry.done ? 'var(--sage)' : 'var(--gold)',
                      }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-gold" onClick={handleUpload}
            disabled={uploading || !files.length}
            style={{ opacity: (!files.length || uploading) ? .5 : 1, cursor: (!files.length || uploading) ? 'not-allowed' : 'pointer' }}>
            {uploading ? 'Uploading…' : `Add ${files.length > 0 ? files.length + ' ' : ''}File${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}
