import { useState } from "react";
import { Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router'
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="w-full bg-primary text-primary-foreground p-4 md:p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-secondary rounded-full" />
        <span className="text-xl font-bold">CONFLUX</span>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center">
        <Link to="/getting-started">
          <Button variant="ghost" className="text-primary-foreground">Getting Started</Button>
        </Link>
        <Link to="/recent-projects">
          <Button variant="ghost" className="text-primary-foreground">Recent Projects</Button>
        </Link>
        <Link to="/my-projects">
          <Button variant="ghost" className="text-primary-foreground">My Projects</Button>
        </Link>
        <Link to="/search">
            <Button variant="ghost" className="text-primary-foreground"><Search className="w-6 h-6 text-primary-foreground hover:text-secondary" /></Button>
        </Link>
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <User className="w-6 h-6 text-primary-foreground hover:text-secondary" />
          </Button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-primary text-primary-foreground rounded-md shadow-lg">
              <Link to="/profile" className="block px-4 py-2 text-primary-foreground hover:bg-secondary">Profile</Link>
              <Link to="/settings" className="block px-4 py-2 text-primary-foreground hover:bg-secondary">Settings</Link>
              <Link to="/logout" className="block px-4 py-2 text-primary-foreground hover:bg-secondary">Log Out</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex gap-4">
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="w-6 h-6 text-primary-foreground" />
        </Button>
        <Link to="/profile">
          <Button variant="ghost" size="icon">
            <User className="w-6 h-6 text-primary-foreground" />
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