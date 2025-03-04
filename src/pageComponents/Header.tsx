import Logo from "./Logo"

type navbarItem = {
    link: string,
    iconPath: string,
    displayText: string
}

function navbarItem(link: string, iconPath: string, displayText: string): navbarItem {
    return {link: link, iconPath: iconPath, displayText: displayText}
}

const pages: navbarItem[] = [navbarItem("", "", "Home"), navbarItem("", "", "About"), navbarItem("", "", "Projects")]

function Header() {
    return (
        <>
            <div className="bg-blue-950 flex flex-col items-center justify-self-start">
                <div className="flex items-center justify-center">
                    {<Logo size="5em"/>}
                    <h1>Conflux</h1>
                </div>
                <div className="">
                    <Navbar pages={pages}/>
                </div>
            </div>
        </>
    )
}

function Navbar({pages}: { pages: navbarItem[] }) {
    return (
        <div className="w-screen flex items-center justify-center">
            {pages.map((item: navbarItem) => <NavbarItem item={item}/>)}
        </div>
    )
}

function NavbarItem({item}: { item: navbarItem }) {
    return (
        <label
            className="rounded m-3 ml-0 p-1 pl-2 pr-2 text-xl bg-blue-500 hover:bg-blue-400">{item.displayText} </label>
    )
}

export default Header;