import { ChatWindow } from './components/ChatWindow'
import { CURRENT_USER, sampleMessages } from './data/sampleMessages'

function App() {
  return <ChatWindow messages={sampleMessages} currentUser={CURRENT_USER} />
}

export default App
