import { useContext } from 'react'
import { ChatbotContext } from '../context/chatbotContext'

export function useChatbot() {
  return useContext(ChatbotContext)
}
