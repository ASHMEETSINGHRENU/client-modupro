import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Package,
  Wrench,
  Factory,
  Inbox,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/admin/enquiries', label: 'Enquiries CRM', Icon: Inbox },
  { to: '/admin/divisions', label: 'Divisions', Icon: Layers },
  { to: '/admin/products', label: 'Products', Icon: Package },
  { to: '/admin/services', label: 'Services & Support', Icon: Wrench },
  { to: '/admin/industries', label: 'Industries', Icon: Factory },
  { to: '/admin/media', label: 'Media Library', Icon: ImageIcon },
  { to: '/admin/settings', label: 'Site Settings', Icon: Settings },
];

export default function AdminLayout() {
  const { admin, checkingAuth, logout } = useAuth();
  const { siteSettings } = useSite();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0A1428] text-[#F4EEDF] flex items-center justify-center p-6">
        <div className="bg-[#16294D] border border-[#D9C08B]/40 px-8 py-6 text-center space-y-2">
          <p className="font-mono-code text-xs uppercase tracking-[0.2em] text-[#D9C08B]">
            Verifying Session
          </p>
          <p className="text-sm text-[#F4EEDF]/80">Checking administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Your administrator session has been closed.',
    });
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0A1428] text-[#F4EEDF] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-68 bg-[#16294D] border-r border-[#D9C08B]/25 shrink-0 justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#3F5E8C]/40 flex items-center gap-3">
            <div className="bg-[#F4EEDF] px-2 py-1 border border-[#D9C08B]/50">
              <img
                src={siteSettings?.logoUrl || '/assets/logo/modu-pro-logo.png'}
                alt="Modu Pro"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <p className="font-display text-lg font-semibold uppercase tracking-widest text-[#F4EEDF] leading-none">
                Modu Pro
              </p>
              <p className="font-mono-code text-[10px] uppercase tracking-[0.18em] text-[#D9C08B] mt-1">
                Admin Console
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav aria-label="Admin sidebar navigation" className="p-4 space-y-1">
            {ADMIN_NAV.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-wider border transition-colors ${
                    isActive
                      ? 'bg-[#0A1428] text-[#D9C08B] border-[#D9C08B]/60'
                      : 'border-transparent text-[#F4EEDF]/80 hover:bg-[#0A1428]/50 hover:text-[#D9C08B]'
                  }`
                }
              >
                <Icon aria-hidden="true" className="w-4 h-4 text-[#D9C08B]" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Admin Footer */}
        <div className="p-5 border-t border-[#3F5E8C]/40 space-y-3 bg-[#0A1428]/40">
          <div className="flex items-center gap-2.5">
            <ShieldCheck aria-hidden="true" className="w-4 h-4 text-[#D9C08B] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#F4EEDF] truncate">{admin.name}</p>
              <p className="text-[11px] text-[#F4EEDF]/65 truncate">{admin.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#16294D] border border-[#3F5E8C]/50 hover:border-[#D9C08B] text-[11px] uppercase tracking-wider text-[#F4EEDF]"
            >
              <span>Public Site</span>
              <ExternalLink aria-hidden="true" className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0A1428] border border-[#D9C08B]/40 hover:border-[#D9C08B] text-[11px] uppercase tracking-wider text-[#D9C08B] cursor-pointer"
            >
              <LogOut aria-hidden="true" className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar for Mobile & Breadcrumb */}
        <header className="bg-[#16294D] border-b border-[#D9C08B]/25 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle admin menu"
              className="lg:hidden p-2 bg-[#0A1428] border border-[#D9C08B]/40 text-[#F4EEDF]"
            >
              {sidebarOpen ? (
                <X aria-hidden="true" className="w-5 h-5" />
              ) : (
                <Menu aria-hidden="true" className="w-5 h-5" />
              )}
            </button>
            <div>
              <p className="font-mono-code text-[11px] uppercase tracking-[0.2em] text-[#D9C08B]">
                Modu Pro Innovation Pvt. Ltd.
              </p>
              <p className="text-sm font-medium text-[#F4EEDF]">
                Enterprise Content &amp; Enquiry Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={theme === 'light'}
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              className="inline-flex items-center gap-2 rounded-full bg-[#0A1428] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F4EEDF]"
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0A1428] border border-[#3F5E8C]/60 hover:border-[#D9C08B] text-xs uppercase tracking-wider text-[#F4EEDF]"
            >
              <span>View Live Website</span>
              <ExternalLink aria-hidden="true" className="w-3.5 h-3.5 text-[#D9C08B]" />
            </Link>
          </div>
        </header>

        {/* Mobile Admin Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden bg-[#16294D] border-b border-[#D9C08B]/30 p-4 space-y-1">
            {ADMIN_NAV.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider ${
                    isActive ? 'bg-[#0A1428] text-[#D9C08B]' : 'text-[#F4EEDF]'
                  }`
                }
              >
                <Icon aria-hidden="true" className="w-4 h-4 text-[#D9C08B]" />
                <span>{label}</span>
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider text-[#D9C08B]"
            >
              <LogOut aria-hidden="true" className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
