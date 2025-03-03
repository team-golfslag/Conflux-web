import Logo from "./Logo"

const pages = [{link:"", iconPath:"", displayText:"Home"}, 
    {link:"", iconPath:"", displayText:"About"},
    {link:"", iconPath:"", displayText:"Projects"}
    ]


function Header() {
    return (
        <>
            <div>
                {<Logo size="5em"/>}
                <h1>Conflux</h1>
            </div>
            <div>
                Wow een navbar
                <Navbar pages={pages}/>
            </div>
                
        </>
    )
}


type navbarItem = {
    link:string,
    iconPath:string,
    displayText:string
}

function Navbar( {pages} : {pages : [navbarItem]}){
    return (
        <div className="h-auto w-screen bg-blue-800 content-center p-2">
            {pages.map((item:navbarItem)=> <NavbarItem item={item}/>)}
        </div>
    )
}

function NavbarItem({item}:{item:navbarItem}){
    return (
        <label className="rounded m-5 p-1 text-xl bg-blue-500 hover:bg-blue-400">{item.displayText} </label>
    )
}


export default Header;