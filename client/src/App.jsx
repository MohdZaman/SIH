import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='bg-teal-500 hover:blue-300 text-white'>Hello</div>
    </>
  )
}

export default App
