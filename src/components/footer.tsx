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
    <footer className="mt-16 flex h-32 w-full justify-center bg-gray-800">
      <div className="flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-8">
        <div className="xs:flex-row flex flex-col items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full">
            <img className="h-full w-full object-cover" src={logo} alt="" />
          </div>
          <div className="text-2xl font-bold tracking-wide text-white uppercase">
            Conflux
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3 py-4 sm:px-16">
          <p className="flex font-medium text-white">
            © Utrecht University (ICS){" "}
            <span className="hidden pl-1 sm:block">2025</span>
          </p>
          <a
            className="flex items-center gap-2 font-medium text-gray-200 transition-colors duration-200 hover:text-white"
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
