
const pages = ["menu", "about", "projects"]


function Header() {
    return (
        <>
            <div>
                Wow een navbar
                <Navbar pages={pages}/>
            </div>
        </>
    )
}


function Navbar(props:any){
    return (
        <div className="h-auto w-screen bg-blue-800 ">
            {props.pages.map((name:any)=> <NavbarItem name={name}/>)}
        </div>
    )
}

function NavbarItem(props:any){
    return (
        <label className="rounded h-12 m-2 text-xl bg-blue-500 hover:bg-blue-400">{props.name} </label>
    )
}


export default Header;