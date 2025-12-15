import { useState } from 'react';
import { Search, Filter, Download, Upload, Plus, Eye, Edit2, QrCode, MoreVertical } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Asset Manager' | 'Technician' | 'Employee';
};

type Asset = {
  id: string;
  serialNumber: string;
  assetTag: string;
  type: string;
  category: string;
  model: string;
  vendor: string;
  purchaseCost: number;
  purchaseDate: string;
  warranty: string;
  lifecycleStatus: 'Procured' | 'In Use' | 'Under Maintenance' | 'Repaired' | 'Decommissioned';
  location: string;
  department: string;
  owner: string;
  custodian: string;
};

type AssetListProps = {
  user: User;
  onNavigate: (view: 'asset-detail', assetId: string) => void;
};

export function AssetList({ user, onNavigate }: AssetListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock asset data
  const mockAssets: Asset[] = [
    {
      id: '1',
      serialNumber: 'SN001234567',
      assetTag: 'LAP-001',
      type: 'Laptop',
      category: 'Hardware',
      model: 'Dell XPS 15',
      vendor: 'Dell',
      purchaseCost: 1299.99,
      purchaseDate: '2024-01-15',
      warranty: '2027-01-15',
      lifecycleStatus: 'In Use',
      location: 'Office Building A',
      department: 'IT Department',
      owner: 'IT Manager',
      custodian: 'John Doe',
    },
    {
      id: '2',
      serialNumber: 'SN002345678',
      assetTag: 'DSK-001',
      type: 'Desktop',
      category: 'Hardware',
      model: 'HP EliteDesk 800',
      vendor: 'HP',
      purchaseCost: 899.99,
      purchaseDate: '2024-02-20',
      warranty: '2027-02-20',
      lifecycleStatus: 'In Use',
      location: 'Office Building B',
      department: 'Finance',
      owner: 'Finance Manager',
      custodian: 'Sarah Smith',
    },
    {
      id: '3',
      serialNumber: 'SN003456789',
      assetTag: 'PRN-001',
      type: 'Printer',
      category: 'Peripherals',
      model: 'Canon ImageClass',
      vendor: 'Canon',
      purchaseCost: 599.99,
      purchaseDate: '2023-11-10',
      warranty: '2026-11-10',
      lifecycleStatus: 'Under Maintenance',
      location: 'Office Building A',
      department: 'General',
      owner: 'Facilities',
      custodian: 'N/A',
    },
    {
      id: '4',
      serialNumber: 'SN004567890',
      assetTag: 'SRV-001',
      type: 'Server',
      category: 'Hardware',
      model: 'Dell PowerEdge R740',
      vendor: 'Dell',
      purchaseCost: 5499.99,
      purchaseDate: '2023-06-01',
      warranty: '2028-06-01',
      lifecycleStatus: 'In Use',
      location: 'Data Center',
      department: 'IT Department',
      owner: 'IT Manager',
      custodian: 'IT Team',
    },
    {
      id: '5',
      serialNumber: 'SN005678901',
      assetTag: 'MON-001',
      type: 'Monitor',
      category: 'Peripherals',
      model: 'LG UltraWide 34"',
      vendor: 'LG',
      purchaseCost: 449.99,
      purchaseDate: '2024-03-15',
      warranty: '2027-03-15',
      lifecycleStatus: 'Procured',
      location: 'Warehouse',
      department: 'N/A',
      owner: 'Asset Manager',
      custodian: 'N/A',
    },
  ];

  const [assets] = useState<Asset[]>(mockAssets);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.vendor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || asset.lifecycleStatus === filterStatus;
    const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'Procured': 'bg-blue-100 text-blue-700',
      'In Use': 'bg-green-100 text-green-700',
      'Under Maintenance': 'bg-yellow-100 text-yellow-700',
      'Repaired': 'bg-purple-100 text-purple-700',
      'Decommissioned': 'bg-gray-100 text-gray-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const canEdit = user.role === 'Admin' || user.role === 'Asset Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">AssetFlow</h2>
          <p className="text-gray-600">Manage and track all company assets</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </button>
          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#00A3A1] text-white rounded-lg hover:bg-[#008C8A] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Search Assets</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tag, model, serial number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Lifecycle Status</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="Procured">Procured</option>
                <option value="In Use">In Use</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Repaired">Repaired</option>
                <option value="Decommissioned">Decommissioned</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Peripherals">Peripherals</option>
                <option value="Fleet">Fleet</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Asset Tag</th>
                <th className="px-6 py-3 text-left text-gray-700">Type/Model</th>
                <th className="px-6 py-3 text-left text-gray-700">Serial Number</th>
                <th className="px-6 py-3 text-left text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Location</th>
                <th className="px-6 py-3 text-left text-gray-700">Custodian</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{asset.assetTag}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{asset.type}</div>
                    <div className="text-gray-600">{asset.model}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{asset.serialNumber}</td>
                  <td className="px-6 py-4 text-gray-700">{asset.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(asset.lifecycleStatus)}`}>
                      {asset.lifecycleStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{asset.location}</td>
                  <td className="px-6 py-4 text-gray-700">{asset.custodian}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('asset-detail', asset.id)}
                        className="p-2 text-[#00A3A1] hover:bg-teal-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canEdit && (
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit Asset"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="More Options">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No assets found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-gray-900 mb-6">Add New Asset</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Asset Tag *</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Serial Number *</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Type *</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Category *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Hardware</option>
                  <option>Software</option>
                  <option>Peripherals</option>
                  <option>Fleet</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Model *</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Vendor *</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Purchase Cost *</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Purchase Date *</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Warranty Expiry</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Location *</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Department *</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Lifecycle Status *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Procured</option>
                  <option>In Use</option>
                  <option>Under Maintenance</option>
                  <option>Repaired</option>
                  <option>Decommissioned</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-[#00A3A1] text-white rounded-lg hover:bg-[#008C8A] transition-colors">
                Add Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}