type contactItem = { link: string, iconPath: string, displayText: string };

function contactItem(link: string, iconPath: string, displayText: string): contactItem {
    return {link: link, iconPath: iconPath, displayText: displayText}
}

const contactPages: contactItem[] = [contactItem("", "", "Github"), contactItem("", "", "Email"), contactItem("", "", "Contact Us!")]

// type footerProps = { contactPages: contactItem[] };

/**
 * Header component exported to be used in all pages.
 * @returns A header component
 */
function Footer() {
    return (
        <>
            <div className="bg-blue-950 flex flex-col items-center justify-self-start">
                <div>
                    <Contact contactPages={contactPages}/>
                </div>
            </div>
        </>
    )
}


type contactProps = { contactPages: contactItem[] }

function Contact(props: contactProps) {
    return (
        <div>
            {props.contactPages.map((item: contactItem) => <div>{item.displayText}</div>)}
        </div>
    )

}

export default Footer;