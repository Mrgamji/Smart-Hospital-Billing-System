import { useState } from 'react';
import { Building2, LayoutDashboard, FileText, Users, Package, Stethoscope, Settings, LogOut, Menu, X, UserCog } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { BillableItemsManager } from './components/admin/BillableItemsManager';
import { PackagesManager } from './components/admin/PackagesManager';
import { TreatmentsManager } from './components/admin/TreatmentsManager';
import { PatientManager } from './components/billing/PatientManager';
import { InvoiceCreator } from './components/billing/InvoiceCreator';
import { InvoicesList } from './components/billing/InvoicesList';
import { ManageDoctors } from './components/admin/manageDoctors';

type Page =
  | 'dashboard'
  | 'create-invoice'
  | 'invoices'
  | 'patients'
  | 'billables'
  | 'packages'
  | 'treatments'
  | 'manage-doctors';

function AppContent() {
  const { user, userRole, signOut, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const isAdmin = userRole === 'admin';

  const navigation = [
    { id: 'dashboard' as Page, name: 'Dashboard', icon: LayoutDashboard, show: true },
    { id: 'create-invoice' as Page, name: 'Create Invoice', icon: FileText, show: true },
    { id: 'invoices' as Page, name: 'Invoices', icon: FileText, show: true },
    { id: 'patients' as Page, name: 'Patients', icon: Users, show: true },
    { id: 'billables' as Page, name: 'Billable Items', icon: Settings, show: isAdmin },
    { id: 'packages' as Page, name: 'Packages', icon: Package, show: isAdmin },
    { id: 'treatments' as Page, name: 'Treatments', icon: Stethoscope, show: isAdmin },
    { id: 'manage-doctors' as Page, name: 'Manage Doctors', icon: UserCog, show: isAdmin },
  ].filter(item => item.show);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'create-invoice':
        return <InvoiceCreator />;
      case 'invoices':
        return <InvoicesList />;
      case 'patients':
        return <PatientManager />;
      case 'billables':
        return <BillableItemsManager />;
      case 'packages':
        return <PackagesManager />;
      case 'treatments':
        return <TreatmentsManager />;
      case 'manage-doctors':
        return <ManageDoctors />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 size={24} className="text-blue-600" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-bold text-gray-900">Hospital</h1>
                  <p className="text-xs text-gray-500">Billing System</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${!sidebarOpen && 'justify-center'}`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className={`mb-3 ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen && (
              <>
                <div className="text-sm font-medium text-gray-900">{user.email}</div>
                <div className="text-xs text-gray-500 capitalize">{userRole || 'User'}</div>
              </>
            )}
          </div>
          <button
            onClick={signOut}
            className={`w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
