/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import logo from "@/assets/golfslag.png";
import config from "@/config.ts";

function App() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 bg-white/60 p-8 shadow-2xl md:p-12">
          <div className="mb-8 flex justify-center">
            <img
              className="h-20 w-20 rounded-full object-contain md:h-28 md:w-28"
              src={logo}
              alt="Conflux project logo"
            />
          </div>

          <div className="space-y-6 text-center">
            <div className="space-y-3">
              <h1 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-4xl font-bold text-transparent md:text-6xl dark:from-white dark:to-slate-200">
                Welcome to Conflux
              </h1>
              <p className="text-lg font-medium text-slate-600 md:text-xl dark:text-slate-300">
                The application for streamlined project administration
              </p>
            </div>

            <div className="space-y-4">
              <p className="mx-auto max-w-lg text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-400">
                Developed for SURF, Conflux helps manage projects and integrates
                with modern services like RAiD, ORCiD, ROR and more.
              </p>

              <p className="text-base text-slate-600 md:text-lg dark:text-slate-400">
                Please log in for a personalized experience
              </p>
            </div>

            {/* CTA section */}
            <div className="pt-4">
              <Button
                onClick={validation}
                className="group relative overflow-hidden bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </Button>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 border-t border-slate-200/50 pt-6 dark:border-slate-700/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Built by Utrecht University students for the Software Project
              course
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

const validation = () =>
  (window.location.href =
    config.apiBaseURL +
    "/session/login?redirectUri=" +
    encodeURIComponent(`${config.webUIUrl}/dashboard`));

export default App;
