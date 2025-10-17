import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ user, onLogout, children, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={onLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-gray-600"
                data-testid="mobile-menu-button"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Space Grotesk' }}>
                {title}
              </h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;