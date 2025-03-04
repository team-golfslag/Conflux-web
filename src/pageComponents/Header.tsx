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

type headerProps = { currentPage: string };

/**
 * Header component exported to be used in all pages.
 * @returns A header component
 */
function Header(props: headerProps) {
    return (
        <>
            <div className="bg-blue-950 flex flex-col items-center justify-self-start">
                <div className="flex items-center justify-center">
                    {<Logo size="5em"/>}
                    <h1>Conflux</h1>
                </div>
                <div className="">
                    <Navbar pages={pages} currentPage={props.currentPage}/>
                </div>
            </div>
        </>
    )
}


type navbarProps = { pages: navbarItem[], currentPage: string }

/**
 * Navbar component used in the header
 * @param props - the navbar properties, containing a list of pages and the current page.
 * @returns A Navbar component
 */
function Navbar(props: navbarProps) {
    return (
        <div className="w-screen flex items-center justify-center">
            {props.pages.map((item: navbarItem) => <NavbarItem item={item}/>)}
        </div>
    )
}

type navbarItemProps = { item: navbarItem };

/**
 * NavbarItem component used in the Navbar
 * @param props - the navbarItem properties, containing a single navbarItem.
 * @returns A NavbarItem component
 */
function NavbarItem(props: navbarItemProps) {
    return (
        <label
            className="rounded m-3 ml-0 p-1 pl-2 pr-2 text-xl bg-blue-500 hover:bg-blue-400">{props.item.displayText} </label>
    )
}

export default Header;