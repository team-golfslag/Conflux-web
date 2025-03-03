/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/


import { useState } from 'react'
import { Link } from 'react-router'
import './App.css'
//import {useQuery} from "@tanstack/react-query"

/*
This is a (temporary) file which serves as that which is seen at home. It has links to the other pages.
./App.css may give an error, but it should just work. Ask Max to intimidate the computer for you
*/

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <Link to="/projectsPage" >Go to projectsPage </Link>
      <hr/>
      <Link to="/settings" >Go to settings </Link>
    </>
  )
}

export default App