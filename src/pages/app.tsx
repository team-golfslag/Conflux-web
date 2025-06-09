/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import config from "@/config.ts";
import Logo from "@/components/icons/logo";

function App() {
  return (
    <div className="relative min-h-screen w-full bg-gray-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gray-200/20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-slate-200/20 blur-3xl"></div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-3xl border border-gray-200 bg-white p-8 shadow-lg md:p-16">
          <div className="mb-10 flex justify-center">
            <div className="relative">
              <Logo size="160" />
            </div>
          </div>

          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-5xl leading-tight font-bold text-gray-800 md:text-7xl">
                Welcome to Conflux
              </h1>
              <p className="text-xl leading-relaxed font-medium text-gray-600 md:text-2xl">
                The application for streamlined project administration
              </p>
            </div>

            <div className="space-y-6">
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-700 md:text-xl">
                Developed for SURF, Conflux helps manage projects and integrates
                with modern services like RAiD, ORCiD, ROR and more.
              </p>

              <p className="text-lg text-gray-600 md:text-xl">
                Please log in for a personalized experience
              </p>
            </div>

            {/* CTA section */}
            <div className="pt-6">
              <Button
                onClick={validation}
                className="group relative overflow-hidden rounded-xl bg-gray-800 px-10 py-4 text-xl font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-900 hover:shadow-xl active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Get Started
                  <svg
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Button>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-sm leading-relaxed text-gray-500">
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
