import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'
import Sidebar from './Sidebar'
import ChatPage from '../pages/ChatPage'
import DocumentsPage from '../pages/DocumentsPage'
import CollectionsPage from '../pages/CollectionsPage'
import HistoryPage from '../pages/HistoryPage'

export default function AppLayout() {
  return (
    <AppProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route index element={<ChatPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  )
}
