import { useState } from 'react'
import './App.css'
import { BryntumButton } from '@bryntum/schedulerpro-react'
import UnallocatedGrid from './components/UnallocatedGrid'
import AllocatedGrid from './components/AllocatedGrid'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     {/* <SchedulerPro /> */}
     {/* <BryntumButton
      text = 'Click me'
      onAction = {(sources) => {
        console.log('Button clicked',sources)
      }}
      badge='10'
     /> */}
     <UnallocatedGrid />
     <AllocatedGrid />
    </>
  )
}

export default App
