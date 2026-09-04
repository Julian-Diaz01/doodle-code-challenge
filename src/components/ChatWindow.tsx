import bodyBg from '../assets/body-bg.png'
import { Composer } from './Composer'


export function ChatWindow() {
  return (
    <div
      className="flex h-dvh justify-center bg-page"
      style={{ backgroundImage: `url(${bodyBg})`, backgroundRepeat: 'repeat' }}
    >
        <Composer />
    </div>
  )
}
