/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Button } from "@/components/ui/button.tsx";
import logo from "@/assets/golfslag.png";
import config from "@/config.ts";

function App() {
  return (
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center">
      <div>
        <img
          className="h-30 w-30 rounded-full object-contain"
          src={logo}
          srcSet={logo}
          alt="Golfslag logo"
        />
      </div>
      <div className="m-5 flex flex-col items-center">
        <h1 className="text-6xl">Welcome to Conflux</h1>
        <p>We kindly ask you to login for a more personalized experience</p>
      </div>
      <div>
        <Button onClick={validation}>Log in</Button>
      </div>
    </div>
  );
}

const validation = () =>
  (window.location.href =
    config.apiBaseURL +
    "/session/login?redirect=http%3A%2F%2Flocalhost%3A5173%2Fdashboard");

export default App;
