/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/


import { Link } from "react-router"

/*
this is the main entry point into the projects page. 
It is currently empty.
*/

function ProjectPage() 
{
    return (
    <>
        <h1>Please create the project page here!</h1>
        <Link to = "/"> go to home </Link>
        <Members members={members}/>
        <Sponsors sponsors={sponsors}/>
    </>
    )
}

function Members(props:any){
  return(<>
    <div>
      {props.members.map((name:string)=> <Member name={name}/>)}
    </div>
  </>)
}
const members = ["hans flippy", "","ha\nha\nha" , "piet", "memebr METEENHEELERGLANGENAAMWAT IRRITANTISVOORFORMATTING", "geertje", "robje jetten"]

function Member(props:any){
  return(<>
    {props.name}
  </>)
}

function Sponsors(props:any){
  return(<>
    <div>
      {props.sponsors.map((name:string)=> <Sponsor name={name}/>)}
    </div>
  </>)
}
const sponsors = ["", "robje jetten"]

function Sponsor(props:any){
  return(<>
    {props.name}
  </>)
}


export default ProjectPage