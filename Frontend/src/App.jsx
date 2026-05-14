import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { MultiBackend, TouchTransition, MouseTransition } from 'react-dnd-multi-backend'
import { ChatbotProvider } from './context/ChatbotContext'
import Navbar from './components/Navbar'
import ChatbotWidget from './components/ChatbotWidget'
import Home from './pages/Home'
import LearnHub from './pages/LearnHub'
import Simulation from './pages/Simulation'
import Calculator from './pages/Calculator'

const dndOptions = {
  backends: [
    { id: 'html5', backend: HTML5Backend, transition: MouseTransition },
    { id: 'touch', backend: TouchBackend, options: { enableMouseEvents: true }, transition: TouchTransition },
  ],
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <DndProvider backend={MultiBackend} options={dndOptions}>
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
