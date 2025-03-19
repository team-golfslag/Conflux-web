/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/
import {useState, useEffect} from "react";
import {Menu, Search, User} from "lucide-react";
import {Button} from "@/Components/ui/button.tsx";
import {Link} from 'react-router';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);

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
            className={`w-full bg-primary text-primary-foreground p-4 md:p-6 flex items-center justify-between transition-transform duration-500 ease-in-out ${isScrollingUp ? 'sticky top-0' : '-top-16'} z-1`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-full"/>
                <span className="text-xl font-bold">CONFLUX</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 items-center">
                <Link to="/getting-started">
                    <Button variant="ghost" className="text-primary-foreground bg-primary">Getting Started</Button>
                </Link>
                <Link to="/recent-projects">
                    <Button variant="ghost" className="text-primary-foreground">Recent Projects</Button>
                </Link>
                <Link to="/my-projects">
                    <Button variant="ghost" className="text-primary-foreground">My Projects</Button>
                </Link>
                <Link to="/projects/search">
                    <Button variant="ghost" className="text-primary-foreground">
                        <div className="hover:text-secondary">
                            <Search className="w-6 h-6 text-primary-foreground"/>
                        </div>
                    </Button>
                </Link>
                <div className="relative">
                    <Button variant="ghost" size="icon" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                        <div className="hover:text-secondary">
                            <User className="w-6 h-6 text-primary-foreground"/>
                        </div>
                    </Button>
                    {userMenuOpen && (
                        <div
                            className="absolute right-0 mt-2 w-48 bg-primary text-primary-foreground rounded-md shadow-lg">
                            <Link to="/profile"
                                  className="block px-4 py-2 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">Profile</Link>
                            <Link to="/settings"
                                  className="block px-4 py-2 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">Settings</Link>
                            <Link to="/logout"
                                  className="block px-4 py-2 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">Log
                                Out</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex gap-4">
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <div className="hover:text-secondary">
                        <Menu className="w-6 h-6 text-primary-foreground"/>
                    </div>
                </Button>
                <Link to="/profile">
                    <Button variant="ghost" size="icon">
                        <div className="hover:text-secondary">
                            <User className="w-6 h-6 text-primary-foreground"/>
                        </div>
                    </Button>
                </Link>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-primary p-4 flex flex-col gap-4">
                    <Link to="/getting-started">
                        <Button variant="ghost" className="text-primary-foreground w-full">Getting Started</Button>
                    </Link>
                    <Link to="/recent-projects">
                        <Button variant="ghost" className="text-primary-foreground w-full">Recent Projects</Button>
                    </Link>
                    <Link to="/my-projects">
                        <Button variant="ghost" className="text-primary-foreground w-full">My Projects</Button>
                    </Link>
                </div>
            )}
        </header>
    );
}