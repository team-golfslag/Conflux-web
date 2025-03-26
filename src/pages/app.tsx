/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/
import {Button} from "@/components/ui/button.tsx";


function App() {
    return <>
        <div className="w-screen h-screen bg-background flex flex-col items-center justify-center">
            <div className="m-5 transition-opacity duration-2000 opacity-100 flex flex-col items-center">
                <h1 className="text-6xl">Welcome to Conflux</h1>
                <p className="">We kindly ask you to login for a more personalized experience</p>
            </div>
            <div className = "transition-opacity duration-3000 opacity-100">
                <Button onClick = {validation}>Log in</Button>
            </div>
        </div>

    </>

}

const validation = () => window.location.href= '/projects/search'


export default App