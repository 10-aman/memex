import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getDocuments, deleteDocument as apiDelete, getCollections, deleteCollection as apiDeleteCol } from '../utils/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [docs, setDocs] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDocId, setActiveDocId] = useState(null)
  const [activeCollectionId, setActiveCollectionId] = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      const [docsData, colsData] = await Promise.all([getDocuments(), getCollections()])
      setDocs(docsData)
      setCollections(colsData)
    } catch (e) {
      console.error('Failed to fetch data', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addDoc = (doc) => setDocs(prev => [...prev, doc])

  const removeDoc = async (id) => {
    await apiDelete(id)
    setDocs(prev => prev.filter(d => d.id !== id))
    if (activeDocId === id) setActiveDocId(null)
  }

  const addCollection = (col) => setCollections(prev => [...prev, { ...col, doc_count: 0 }])

  const removeCollection = async (id) => {
    await apiDeleteCol(id)
    setCollections(prev => prev.filter(c => c.id !== id))
    setDocs(prev => prev.map(d => d.collection_id === id ? { ...d, collection_id: null } : d))
    if (activeCollectionId === id) setActiveCollectionId(null)
  }

  const updateDocCollection = (docId, collectionId) => {
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, collection_id: collectionId } : d))
    // Update doc_count on collections
    setCollections(prev => prev.map(c => ({
      ...c,
      doc_count: docs.filter(d => (d.id === docId ? collectionId : d.collection_id) === c.id).length
    })))
  }

  return (
    <AppContext.Provider value={{
      docs, collections, loading,
      activeDocId, setActiveDocId,
      activeCollectionId, setActiveCollectionId,
      addDoc, removeDoc,
      addCollection, removeCollection, updateDocCollection,
      refetch: fetchAll,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
