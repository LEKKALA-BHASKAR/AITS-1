import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, BookOpen, GraduationCap, Bell, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ user, onLogout, mobileOpen, setMobileOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/departments', icon: Building2, label: 'Departments' },
    { path: '/admin/sections', icon: BookOpen, label: 'Sections' },
    { path: '/admin/students', icon: GraduationCap, label: 'Students' },
    { path: '/admin/teachers', icon: Users, label: 'Teachers' },
    { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-blue-900" style={{ fontFamily: 'Space Grotesk' }}>AITS CSMS</h2>
        <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`nav-${item.label.toLowerCase()}`}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">{user?.name?.charAt(0) || 'A'}</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{user?.name || 'Admin'}</p>
            <p className="text-sm text-gray-500">{user?.role || 'Super Admin'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          data-testid="logout-button"
          className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r border-gray-200 min-h-screen">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;