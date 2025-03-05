import {Link} from "react-router"
import Logo from "./Logo"
import {Component} from "react";

type navbarItem = {
    link: string,
    iconPath: string,
    displayText: string
}

function navbarItem(link: string, iconPath: string, displayText: string): navbarItem {
    return {link: link, iconPath: iconPath, displayText: displayText}
}

const pages: navbarItem[] = [navbarItem("/", "", "Home"), navbarItem("/settings", "", "Settings"), navbarItem("/projectsPage", "", "Projects")]

// type headerProps = { location: Location };

/**
 * Header component exported to be used in all pages.
 * @returns A header component
 */
function Header() {
    return (
        <>
            <div className="bg-blue-950 flex flex-col items-center justify-self-start sticky top-0">
                <div className="flex items-center justify-center">
                    {<Logo size="5em"/>}
                    <h1 className="text-5xl ">Conflux</h1>
                </div>
                <div className="">
                    <Navbar pages={pages}/>
                </div>
            </div>
        </>
    )
}


type navbarProps = { pages: navbarItem[] }

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
 * NavbarItem component used in the Navbar, only renders the icon when iconPath is not an empty string
 * @param props - the navbarItem properties, containing a single navbarItem.
 * @returns A NavbarItem component
 */
function NavbarItem(this: Component<navbarItemProps, { pathname: string }>, props: navbarItemProps) {

    /*
    Suggestie: de Button van de huidige pagina groter/andere kleur maken om aan te geven dat het de huidige pagina is.
    let classname: string = "rounded m-3 ml-0 bg-blue-500 hover:bg-blue-400"

    if (pathname === props.item.link)
        classname += "p-1 pl-2 pr-2 text-4xl"
    else classname += "p-1 pl-2 pr-2 text-xl"
    */

    return (
        <div className="p-1 pl-2 pr-2 text-xl rounded m-3 ml-0 bg-blue-500 hover:bg-blue-400">
            {props.item.iconPath !== "" &&
                <img alt={props.item.displayText + " icon"} src={props.item.iconPath}/>
            }
            <Link
                to={props.item.link}>
                {props.item.displayText}
            </Link>
        </div>
    )
}

export default Header;