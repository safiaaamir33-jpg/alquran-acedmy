import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileCheck2,
  GraduationCap,
  Bell,
  Image as ImageIcon,
  Star,
  Inbox,
  Bot,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  Loader2,
  PlusCircle,
  FileImage
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
  badgeCounts?: {
    admissions?: number;
    messages?: number;
    reviews?: number;
  };
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
  badgeCounts,
}) => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      label: 'Admissions',
      path: '/admin/admissions',
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: badgeCounts?.admissions,
    },
    {
      label: 'Messages Inbox',
      path: '/admin/messages',
      icon: <Inbox className="w-4 h-4" />,
      badge: badgeCounts?.messages,
    },
    { label: 'Courses', path: '/admin/courses', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Teachers', path: '/admin/teachers', icon: <Users className="w-4 h-4" /> },
    { label: 'Students & Fees', path: '/admin/students', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Announcements', path: '/admin/announcements', icon: <Bell className="w-4 h-4" /> },
    { label: 'Admission Posters', path: '/admin/posters', icon: <FileImage className="w-4 h-4" /> },
    { label: 'Photo Gallery', path: '/admin/gallery', icon: <ImageIcon className="w-4 h-4" /> },
    {
      label: 'Reviews',
      path: '/admin/reviews',
      icon: <Star className="w-4 h-4" />,
      badge: badgeCounts?.reviews,
    },
    { label: 'AI Chatbot', path: '/admin/chatbot', icon: <Bot className="w-4 h-4" /> },
    { label: 'Site Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F8F4] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-[#075E46] animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#075E46]">Verifying Admin Authorization...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F3F8F4] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-emerald-100 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#24352F]">Admin Authentication Required</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            You must be logged in with an active administrator profile to access the Noor Al-Quran management system.
          </p>
          <button
            onClick={() => onNavigate('/admin/login')}
            className="w-full py-3 rounded-xl bg-[#075E46] hover:bg-[#064e3b] text-white font-bold text-sm shadow-md transition-all"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  const handleMenuClick = (path: string) => {
    onNavigate(path);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F8F4] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#075E46] text-white flex-col justify-between shadow-xl flex-shrink-0 border-r border-[#0B7A53]">
        <div>
          {/* Logo / Header */}
          <div className="p-5 border-b border-[#0B7A53] flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                <span>Noor Al-Quran</span>
              </h2>
              <p className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">
                Admin Control Center
              </p>
            </div>
            <button
              onClick={() => onNavigate('/')}
              title="View Public Website"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-[#075E46] shadow-sm font-bold'
                      : 'text-white/80 hover:bg-[#0B7A53] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#075E46] text-white'
                          : 'bg-[#D4AF37] text-[#24352F]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & logout */}
        <div className="p-4 border-t border-[#0B7A53] bg-black/10">
          <div className="text-xs truncate font-medium text-white/90">
            {user?.email || 'Admin'}
          </div>
          <button
            onClick={() => logout()}
            className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-red-800/40 hover:bg-red-800/70 text-red-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-base sm:text-lg text-[#075E46]">
              {menuItems.find((i) => i.path === currentPath)?.label || 'Admin Management'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="px-3.5 py-1.5 rounded-xl border border-emerald-200 text-[#075E46] hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live Site</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-72 bg-[#075E46] text-white flex flex-col justify-between p-4 shadow-2xl h-full">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#0B7A53]">
                <h3 className="font-bold text-base text-white">Noor Al-Quran Admin</h3>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleMenuClick(item.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      currentPath === item.path
                        ? 'bg-white text-[#075E46] font-bold'
                        : 'text-white/80 hover:bg-[#0B7A53]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#24352F]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#0B7A53]">
              <div className="text-xs truncate font-medium text-white/90 mb-2">
                {user?.email || 'Admin'}
              </div>
              <button
                onClick={() => logout()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-red-800/40 text-red-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
