/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/


import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

/*
This is a (temporary) file which serves as that which is seen at home. It has links to the other pages.
./App.css may give an error, but it should just work. Ask Max to intimidate the computer for you
*/

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="w-full text-6xl">Conflux Start Page!</h1>
      <div className="w-screen h-screen flex flex-col justify-items-center justify-center card">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
          <Link to="/projectsPage" >Go to projectsPage </Link>
          <hr/>
          <Link to="/settings" >Go to settings </Link>
      </div>
    </>
  )
}

export default App