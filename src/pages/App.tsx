import { useState } from 'react'
import { Link } from 'react-router'
import './App.css'

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
      <Link to="/projectPagina" >Go to projectPagina </Link>
      <hr/>
      <Link to="/settings" >Go to settings </Link>
    </>
  )
}

export default App
