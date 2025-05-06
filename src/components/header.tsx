/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import logo from "@/assets/golfslag.png";
import { useState, useEffect, useRef } from "react";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import config from "@/config";

/** Header component <br>
 * Displays the main pages, search icon and the profile menu with fold-out functionality. <br>On mobile, the menu folds to a menu icon.
 */
export default function Header() {
  const [isUserMenuHovered, setIsUserMenuHovered] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const hideMenuTimer = useRef<NodeJS.Timeout | null>(null);

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

  const handleMouseEnter = () => {
    if (hideMenuTimer.current) {
      clearTimeout(hideMenuTimer.current);
      hideMenuTimer.current = null;
    }
    setIsUserMenuHovered(true);
  };

  const handleMouseLeave = () => {
    hideMenuTimer.current = setTimeout(() => {
      setIsUserMenuHovered(false);
    }, 150);
  };

  return (
    <header
      className={`bg-primary text-primary-foreground sticky flex w-full items-center justify-center py-2 transition-all duration-400 ease-in-out ${
        isScrollingUp ? "top-0" : "-top-20"
      } z-1`}
    >
      <div className="flex w-full max-w-6xl items-center justify-between">
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
            <Button variant="ghost">
              <Search className="h-6 w-6" />
            </Button>
          </Link>
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-testid="user-menu-container"
          >
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
              </Button>
            </Link>
            {isUserMenuHovered && (
              <div
                className="bg-background absolute top-full right-0 mt-1 w-48 rounded-md border shadow-lg"
                data-testid="user-dropdown"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/profile"
                  className="hover:bg-secondary hover:text-secondary-foreground block rounded-t-md px-4 py-2"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="hover:bg-secondary hover:text-secondary-foreground block px-4 py-2"
                >
                  Settings
                </Link>
                <Link
                  to={`${config.apiBaseURL}/session/logout?redirectUri=${encodeURIComponent(
                    config.webUIUrl,
                  )}`}
                  className="hover:bg-secondary hover:text-secondary-foreground block rounded-b-md px-4 py-2"
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
