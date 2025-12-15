import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { AssetList } from './components/AssetList';
import { AssetDetail } from './components/AssetDetail';
import { InventoryMovement } from './components/InventoryMovement';
import { FaultTracking } from './components/FaultTracking';
import { UserManagement } from './components/UserManagement';
import { WorldlineLogo } from './components/WorldlineLogo';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Asset Manager' | 'Technician' | 'Employee';
  avatar?: string;
};

type View = 'dashboard' | 'assets' | 'asset-detail' | 'inventory' | 'faults' | 'users';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: View, assetId?: string) => {
    setCurrentView(view);
    if (assetId) {
      setSelectedAssetId(assetId);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-1.5">
                <WorldlineLogo className="h-32" />
                <div className="h-8 w-px bg-gray-300"></div>
                <h1 className="text-[#00A3A1]">AssetFlow</h1>
              </div>
              <nav className="flex gap-1">
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-teal-50 text-[#00A3A1]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigate('assets')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'assets' || currentView === 'asset-detail'
                      ? 'bg-teal-50 text-[#00A3A1]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Assets
                </button>
                <button
                  onClick={() => handleNavigate('inventory')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'inventory'
                      ? 'bg-teal-50 text-[#00A3A1]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Inventory
                </button>
                <button
                  onClick={() => handleNavigate('faults')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'faults'
                      ? 'bg-teal-50 text-[#00A3A1]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Faults
                </button>
                {user.role === 'Admin' && (
                  <button
                    onClick={() => handleNavigate('users')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentView === 'users'
                        ? 'bg-teal-50 text-[#00A3A1]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Users
                  </button>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-gray-900">{user.name}</div>
                <div className="text-gray-500">{user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {currentView === 'dashboard' && <Dashboard user={user} onNavigate={handleNavigate} />}
        {currentView === 'assets' && <AssetList user={user} onNavigate={handleNavigate} />}
        {currentView === 'asset-detail' && selectedAssetId && (
          <AssetDetail assetId={selectedAssetId} user={user} onBack={() => handleNavigate('assets')} />
        )}
        {currentView === 'inventory' && <InventoryMovement user={user} />}
        {currentView === 'faults' && <FaultTracking user={user} />}
        {currentView === 'users' && <UserManagement user={user} />}
      </main>
    </div>
  );
}