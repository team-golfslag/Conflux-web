/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import logo from "@/assets/golfslag.png";
import { useState, useEffect, useRef } from "react";
import { Search, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import config from "@/config";
import { PermissionLevel } from "@team-golfslag/conflux-api-client/src/client";
import { useSession } from "@/hooks/SessionContext";

/** Header component <br>
 * Displays the main pages, search icon and the profile menu with fold-out functionality. <br>On mobile, the menu folds to a menu icon.
 */
export default function Header() {
  const session = useSession();
  const superAdmin =
    session?.session?.user?.permission_level === PermissionLevel.SuperAdmin;

  const [isUserMenuHovered, setIsUserMenuHovered] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const hideMenuTimer = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        setIsUserMenuHovered(false);
        userButtonRef.current?.focus();
        break;
      case "ArrowDown":
        if (!isUserMenuHovered) {
          setIsUserMenuHovered(true);
        }
        break;
      case "Enter":
      case " ":
        if (!isUserMenuHovered) {
          event.preventDefault();
          setIsUserMenuHovered(true);
        }
        break;
      default:
        break;
    }
  };

  const toggleMenu = () => {
    setIsUserMenuHovered((prev) => !prev);
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuHovered(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`sticky flex w-full items-center justify-center border-b border-gray-700/50 bg-gray-800 text-white shadow-xl transition-all duration-500 ease-out ${
        isScrollingUp ? "top-0" : "-top-20"
      } z-50`}
    >
      <div className="flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
        <Link to="/dashboard" className="group">
          <div className="flex items-center gap-4 transition-transform duration-200">
            <div className="h-12 w-12 overflow-hidden rounded-full shadow-lg transition-all duration-200">
              <img
                src={logo}
                alt="Logo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold tracking-wide text-white uppercase">
              Conflux
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/projects/search">
            <Button
              variant="ghost"
              className="rounded-lg border-0 px-6 py-2 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-white/10 hover:text-white"
            >
              Search Projects
            </Button>
          </Link>

          {/* System Admin Button - Only show for super admins */}
          {superAdmin && (
            <Link to="/admin">
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-lg border-0 px-4 py-2 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-white/10 hover:text-white"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden lg:inline">Admin</span>
              </Button>
            </Link>
          )}

          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-testid="user-menu-container"
            ref={userMenuRef}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              onKeyDown={handleKeyDown}
              aria-haspopup="true"
              aria-expanded={isUserMenuHovered}
              aria-label="User menu"
              ref={userButtonRef}
              className="h-12 w-12 rounded-full border-0 text-white ring-2 ring-transparent transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-white hover:ring-white/20"
            >
              <User className="h-6 w-6" />
            </Button>
            {isUserMenuHovered && (
              <div
                className="absolute top-full right-0 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200/20 bg-white/95 shadow-xl backdrop-blur-md"
                data-testid="user-dropdown"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                {/* Profile Section */}
                <Link
                  to="/profile"
                  className="block transition-colors duration-200 hover:bg-gray-50"
                  role="menuitem"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-2 border-b border-gray-200/50 bg-gray-50/80 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-gray-900">
                        {session?.session?.user?.person?.name ||
                          session?.session?.name ||
                          "User"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {session?.session?.user?.person?.email ||
                          "user@example.com"}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Logout Section */}
                <div className="py-1">
                  <Link
                    to={`${config.apiBaseURL}/session/logout?redirectUri=${encodeURIComponent(
                      config.webUIUrl,
                    )}`}
                    className="block px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Log Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="flex gap-4 px-4 sm:px-8 md:hidden">
        <Link to="/projects/search">
          <Button
            variant="ghost"
            className="h-12 w-12 rounded-full border-0 text-white transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-white"
          >
            <Search className="h-6 w-6" />
          </Button>
        </Link>

        {/* System Admin Button for Mobile - Only show for super admins */}
        {superAdmin && (
          <Link to="/admin">
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-full border-0 text-white transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-white"
            >
              <Shield className="h-6 w-6" />
            </Button>
          </Link>
        )}

        <Link to="/profile">
          <Button
            variant="ghost"
            className="h-12 w-12 rounded-full border-0 text-white transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-white"
          >
            <User className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
