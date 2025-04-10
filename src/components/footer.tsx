/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import logo from "@/assets/golfslag.png";
import { SiGithub } from "@icons-pack/react-simple-icons";

/** Footer component <br>
 * * This component is used to display the footer of the page.
 */
export default function Footer() {
  return (
    <footer className="bg-primary flex h-30 w-full justify-center">
      <div className="flex w-full max-w-6xl items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <img className="h-16 w-16" src={logo} alt="" />
          <div className="text-xl font-semibold text-white uppercase">
            Conflux
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1 px-8 py-4 sm:px-16">
          <p className="flex text-white">
            © Utrecht University (ICS){" "}
            <span className="hidden pl-1 sm:block">2025</span>
          </p>
          <a
            className="flex items-center gap-2 text-zinc-300 hover:text-white"
            href="https://github.com/team-golfslag"
          >
            <SiGithub size={16} />
            Github
          </a>
        </div>
      </div>
    </footer>
  );
}
