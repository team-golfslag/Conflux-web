/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/


import {useState} from 'react'
import {Link} from 'react-router'
import Header from '../pageComponents/Header'

/*
This is a (temporary) file which serves as that which is seen at home. It has links to the other pages.
./App.css may give an error, but it should just work. Ask Max to intimidate the computer for you
*/

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className="h-screen flex flex-col items-center bg-primary text-primary-text">
                <Header currentPage={"/"}/>
                <h1 className="text-5xl">Vite + React</h1>
                <div className="card m-5">
                    <button className="border-1 p-3 hover:bg-blue-900" onClick={() => setCount((count) => count + 1)}>
                        count is {count}
                    </button>
                </div>
                <Link to="/projectsPage">Go to projectsPage </Link>
                <hr/>
                <Link to="/settings">Go to settings </Link>
            </div>
        </>
    )
}

export default App