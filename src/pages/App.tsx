/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/


import { useState } from 'react'
import { Link } from 'react-router'
import { primaryButton, secondaryButton } from '../Components/buttons'
import { projectTextBlock } from '../Components/textBlockElements'

/*
This is a (temporary) file which serves as that which is seen at home. It has links to the other pages.
./App.css may give an error, but it should just work. Ask Max to intimidate the computer for you
*/



function App() {

  const [count, setCount] = useState(0) 

  return (
    <div className='flex justify-center pt-50'>
      <div className='flex items-center gap-10 flex-col'>
        <h1 >Vite + React</h1>
          {projectTextBlock("On the weasles with the measles", "This project gives a comprehesive overview on how the measles virus has spread throughout weasles due to the barbie movie. In this essay I will...")}
        <div className="flex justify-normal flex-row">
          {primaryButton("Count is " + count, () => {setCount(count + 1)} )}
          {primaryButton("Another button!")}
          {primaryButton("This increments!", () => {setCount(count + 1)} )}
        </div>
        <div>
          {secondaryButton("Button!", () => {setCount(count + 1)} )}
        </div>
        <Link to="/projectsPage" >Go to projectsPage </Link>
        <hr/>
        <Link to="/settings" >Go to settings </Link>
      </div>
    </div>
    
  )
}

export default App