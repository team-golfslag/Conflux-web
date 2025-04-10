/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import logo from "@/assets/golfslag.png";
import {SiGithub} from "@icons-pack/react-simple-icons";

/** Footer component <br>
 * * This component is used to display the footer of the page.
 */
export default function Footer() {

    return (
        <footer className="flex h-30 w-full justify-center bg-primary">
            <div className="flex w-full max-w-6xl items-center px-8 py-4">
                <img className="w-16 h-16" src={logo} alt=""/>
                <div className="flex flex-col w-full justify-center px-16 py-4">
                    <p className="text-white">© Utrecht University (ICS) 2025</p>
                        <a className="flex gap-2 items-center text-zinc-300 hover:text-white" href="https://github.com/team-golfslag">
                            <SiGithub size={16} />
                            Github
                        </a>
                </div>
            </div>
        </footer>
    );
}