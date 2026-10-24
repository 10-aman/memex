import axios from 'axios'
import { auth } from '../firebase/config'

// In production set VITE_API_URL (e.g. https://memex-api.onrender.com).
// In local dev it falls back to '/api', which Vite proxies to localhost:8000.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

// Attach the signed-in user's Firebase ID token to every request.
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getDocuments = () => api.get('/documents').then(r => r.data)

export const uploadDocument = (file, onProgress) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/documents/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  }).then(r => r.data)
}

export const deleteDocument = (id) => api.delete(`/documents/${id}`).then(r => r.data)
export const assignCollection = (docId, collectionId) =>
  api.put(`/documents/${docId}/collection`, { collection_id: collectionId }).then(r => r.data)

export const queryDocuments = (question, docIds = null, collectionId = null, history = []) =>
  api.post('/query', { question, doc_ids: docIds, collection_id: collectionId, history }).then(r => r.data)

export const getChats = () => api.get('/chats').then(r => r.data)
export const clearChats = () => api.delete('/chats').then(r => r.data)

export const getCollections = () => api.get('/collections').then(r => r.data)
export const createCollection = (data) => api.post('/collections', data).then(r => r.data)
export const updateCollection = (id, data) => api.put(`/collections/${id}`, data).then(r => r.data)
export const deleteCollection = (id) => api.delete(`/collections/${id}`).then(r => r.data)
