import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ChatbotProvider } from './context/ChatbotContext'
import Navbar from './components/Navbar'
import ChatbotWidget from './components/ChatbotWidget'
import Home from './pages/Home'
import LearnHub from './pages/LearnHub'
import Simulation from './pages/Simulation'
import Calculator from './pages/Calculator'

export default function App() {
  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <ChatbotProvider>
          <div style={{ width: '100vw', minHeight: '100vh', overflowX: 'hidden' }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<LearnHub />} />
              <Route path="/learn/:module" element={<Simulation />} />
              <Route path="/calculator" element={<Calculator />} />
            </Routes>
            <ChatbotWidget />
          </div>
        </ChatbotProvider>
      </DndProvider>
    </BrowserRouter>
  )
}
