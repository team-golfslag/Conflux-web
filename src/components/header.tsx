/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import logo from "@/assets/golfslag.png";
import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";
import config from "@/config";

/** Header component <br>
 * Displays the main pages, search icon and the profile menu with fold-out functionality. <br>On mobile, the menu folds to a menu icon.
 */
export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // When scrolling up, the header becomes sticky. When scrolling down, the header stays behind.
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        setIsScrollingUp(false);
      } else {
        setIsScrollingUp(true);
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <header
      className={`bg-primary text-primary-foreground sticky flex w-full items-center justify-center py-3 transition-all duration-400 ease-in-out ${
        isScrollingUp ? "top-0" : "-top-20"
      } z-1`}
    >
      <div className="flex w-full max-w-7xl items-center justify-between">
        <Link to="/dashboard">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full">
              <img
                src={logo}
                alt="Logo"
                className="h-full w-full rounded-full"
              />
            </div>
            <span className="text-xl font-bold uppercase">Conflux</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/projects/search">
            <Button variant="ghost">Search Projects</Button>
          </Link>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <User className="h-6 w-6" />
            </Button>
            {userMenuOpen && (
              <div className="bg-primary text-primary-foreground absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                <Link
                  to="/profile"
                  className="text-primary-foreground hover:bg-secondary hover:text-secondary-foreground block px-4 py-2"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="text-primary-foreground hover:bg-secondary hover:text-secondary-foreground block px-4 py-2"
                >
                  Settings
                </Link>
                <Link
                  to={`${config.apiBaseURL}/session/logout?redirectUri=${encodeURIComponent(
                    config.webUIUrl,
                  )}`}
                  className="text-primary-foreground hover:bg-secondary hover:text-secondary-foreground block px-4 py-2"
                >
                  Log Out
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="flex gap-4 md:hidden">
        <Link to="/projects/search">
          <Button variant="ghost">
            <div className="hover:text-secondary">
              <Search className="text-primary-foreground h-6 w-6" />
            </div>
          </Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost" size="icon">
            <div className="hover:text-secondary">
              <User className="text-primary-foreground h-6 w-6" />
            </div>
          </Button>
        </Link>
      </div>
    </header>
  );
}
