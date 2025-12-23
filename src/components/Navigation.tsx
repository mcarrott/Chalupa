import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Flame, Image, Trophy, FileText } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/managers', label: 'Managers', icon: Users },
    { to: '/thunderdome', label: 'Thunder Dome', icon: Flame },
    { to: '/media', label: 'Media', icon: Image },
    { to: '/legacy', label: 'Legacy', icon: Trophy },
    { to: '/rules', label: 'Rules', icon: FileText },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Chalupa Batman</h1>
              <p className="text-xs text-slate-400">Fantasy Football League</p>
            </div>
          </Link>

          <div className="flex space-x-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/50'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
