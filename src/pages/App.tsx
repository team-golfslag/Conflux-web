/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/


import {useState} from 'react'
import {Link} from 'react-router'
import {Button} from '@/components/ui/button'

/*
This is a (temporary) file which serves as that which is seen at home. It has links to the other pages.
./App.css may give an error, but it should just work. Ask Max to intimidate the computer for you
*/


function App() {

    const [count, setCount] = useState(0)

    return (

        <div className='flex justify-center w-full'>
            <div className='flex items-center gap-10 flex-col'>
                <h1>Conflux Start Page!</h1>
                <Button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </Button>
                <Link to="/projectsPage">Go to projectsPage </Link>
                <hr/>
                <Link to="/settings">Go to settings </Link>
            </div>
        </div>

    )
}

export default App