/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import config from "@/config.ts";
import Logo from "@/components/icons/logo";
import { useBackendStatus } from "@/lib/backendStatusContext";
import { AlertTriangle, RefreshCw } from "lucide-react";

function App() {
  const { isBackendDown, isChecking, retryConnection } = useBackendStatus();

  // Show backend down message if backend is down
  if (isBackendDown) {
    return (
      <div className="relative min-h-screen w-full bg-gray-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-red-200/20 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl"></div>
        </div>

        <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
          <Card className="w-full max-w-lg border border-red-200 bg-white p-4 shadow-lg md:p-8">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <Logo size="120" />
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <div className="space-y-3">
                <h1 className="text-3xl leading-tight font-bold text-red-600 md:text-4xl">
                  Conflux is Currently Down
                </h1>
                <p className="text-lg leading-relaxed font-medium text-red-500 md:text-xl">
                  We're experiencing technical difficulties
                </p>
              </div>

              <div className="space-y-4">
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
                  Our servers are temporarily unavailable. We're working to
                  resolve this issue as quickly as possible.
                </p>

                <p className="text-base text-gray-600 md:text-lg">
                  Please check back later or try refreshing the page.
                </p>
              </div>

              {/* Retry section */}
              <div className="pt-4">
                <Button
                  onClick={retryConnection}
                  disabled={isChecking}
                  className="group relative overflow-hidden rounded-xl bg-red-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isChecking ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        Try Again
                        <RefreshCw className="h-5 w-5 transition-transform duration-200 group-hover:rotate-180" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-8 border-t border-red-200 pt-4">
              <p className="text-sm leading-relaxed text-gray-500">
                If this issue persists, please contact support
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading state while checking backend
  if (isChecking) {
    return (
      <div className="relative min-h-screen w-full bg-gray-50">
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
          <Card className="w-full max-w-lg border border-gray-200 bg-white p-4 shadow-lg md:p-8">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <Logo size="120" />
              </div>
            </div>
            <div className="space-y-4 text-center">
              <div className="space-y-3">
                <h1 className="text-3xl leading-tight font-bold text-gray-800 md:text-4xl">
                  Connecting to Conflux
                </h1>
                <p className="text-lg leading-relaxed font-medium text-gray-600 md:text-xl">
                  Please wait while we establish connection...
                </p>
              </div>
              <div className="pt-4">
                <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Normal app content when backend is up
  return (
    <div className="relative min-h-screen w-full bg-gray-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gray-200/20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-slate-200/20 blur-3xl"></div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-lg border border-gray-200 bg-white p-4 shadow-lg md:p-8">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Logo size="120" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <div className="space-y-3">
              <h1 className="text-3xl leading-tight font-bold text-gray-800 md:text-4xl">
                Welcome to Conflux
              </h1>
              <p className="text-lg leading-relaxed font-medium text-gray-600 md:text-xl">
                The application for streamlined project administration
              </p>
            </div>

            <div className="space-y-4">
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
                Developed for SURF, Conflux helps manage projects and integrates
                with modern services like RAiD, ORCiD, ROR and more.
              </p>

              <p className="text-base text-gray-600 md:text-lg">
                Please log in for a personalized experience
              </p>
            </div>

            {/* CTA section */}
            <div className="pt-4">
              <Button
                onClick={validation}
                className="group relative overflow-hidden rounded-xl bg-gray-800 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-900 hover:shadow-xl active:scale-95"
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
          <div className="mt-8 border-t border-gray-200 pt-4">
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
