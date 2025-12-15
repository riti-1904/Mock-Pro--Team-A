import { useState } from 'react';
import { ArrowRight, Package, User, MapPin, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Asset Manager' | 'Technician' | 'Employee';
};

type Movement = {
  id: string;
  assetTag: string;
  assetName: string;
  movementType: 'Check-Out' | 'Check-In' | 'Transfer' | 'Receive';
  from: string;
  to: string;
  custodian: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  notes: string;
  requestedBy: string;
};

type InventoryMovementProps = {
  user: User;
};

export function InventoryMovement({ user }: InventoryMovementProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [movementType, setMovementType] = useState<'Check-Out' | 'Check-In' | 'Transfer' | 'Receive'>('Check-Out');
  const [showForm, setShowForm] = useState(false);

  // Mock movement data
  const mockMovements: Movement[] = [
    {
      id: '1',
      assetTag: 'LAP-001',
      assetName: 'Dell XPS 15',
      movementType: 'Check-Out',
      from: 'IT Storage',
      to: 'John Doe - Marketing',
      custodian: 'John Doe',
      date: '2024-06-10 14:30',
      status: 'Completed',
      notes: 'New employee onboarding',
      requestedBy: 'Sarah Manager',
    },
    {
      id: '2',
      assetTag: 'PRN-005',
      assetName: 'Canon ImageClass Printer',
      movementType: 'Transfer',
      from: 'Building A - Floor 2',
      to: 'Building B - Floor 1',
      custodian: 'Finance Team',
      date: '2024-06-09 10:15',
      status: 'Completed',
      notes: 'Department relocation',
      requestedBy: 'Asset Manager',
    },
    {
      id: '3',
      assetTag: 'DSK-012',
      assetName: 'HP EliteDesk 800',
      movementType: 'Receive',
      from: 'HP Vendor',
      to: 'Warehouse',
      custodian: 'Warehouse Team',
      date: '2024-06-08 09:00',
      status: 'Completed',
      notes: 'New procurement - PO #12345',
      requestedBy: 'Procurement Team',
    },
    {
      id: '4',
      assetTag: 'LAP-023',
      assetName: 'MacBook Pro 16"',
      movementType: 'Check-In',
      from: 'Michael Brown - Development',
      to: 'IT Storage',
      custodian: 'N/A',
      date: '2024-06-07 16:45',
      status: 'Completed',
      notes: 'Employee resignation - asset return',
      requestedBy: 'IT Manager',
    },
    {
      id: '5',
      assetTag: 'MON-008',
      assetName: 'LG UltraWide 34"',
      movementType: 'Check-Out',
      from: 'Warehouse',
      to: 'Design Team',
      custodian: 'Emma Wilson',
      date: '2024-06-11 11:20',
      status: 'Pending',
      notes: 'Additional monitor for design work',
      requestedBy: 'Design Manager',
    },
  ];

  const [movements] = useState<Movement[]>(mockMovements);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Cancelled': 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getMovementTypeColor = (type: string) => {
    const colors = {
      'Check-Out': 'bg-blue-100 text-blue-700',
      'Check-In': 'bg-purple-100 text-purple-700',
      'Transfer': 'bg-orange-100 text-orange-700',
      'Receive': 'bg-green-100 text-green-700',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Inventory Movement</h2>
          <p className="text-gray-600">Track asset check-in, check-out, and transfers</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          New Movement
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'new'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Recent Movements
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          History
        </button>
      </div>

      {/* Movement Cards */}
      <div className="space-y-4">
        {movements.map((movement) => (
          <div key={movement.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{movement.assetTag}</h3>
                    <span className={`px-3 py-1 rounded-full ${getMovementTypeColor(movement.movementType)}`}>
                      {movement.movementType}
                    </span>
                    <span className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(movement.status)}`}>
                      {getStatusIcon(movement.status)}
                      {movement.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{movement.assetName}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <div>
                        <div>From: {movement.from}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <ArrowRight className="w-4 h-4 text-blue-600" />
                          <span>To: {movement.to}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-gray-600">
                      <User className="w-4 h-4 mt-1" />
                      <div>
                        <div>Custodian: {movement.custodian}</div>
                        <div className="mt-1">By: {movement.requestedBy}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 mt-1" />
                      <div>{new Date(movement.date).toLocaleString()}</div>
                    </div>
                  </div>

                  {movement.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-gray-700">
                      <span className="text-gray-600">Notes:</span> {movement.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Movement Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-gray-900 mb-6">New Asset Movement</h3>

            <div className="space-y-4">
              {/* Movement Type */}
              <div>
                <label className="block text-gray-700 mb-2">Movement Type *</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Check-Out', 'Check-In', 'Transfer', 'Receive'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setMovementType(type)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        movementType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Selection */}
              <div>
                <label className="block text-gray-700 mb-2">Asset *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select an asset...</option>
                  <option>LAP-001 - Dell XPS 15</option>
                  <option>DSK-002 - HP EliteDesk 800</option>
                  <option>PRN-003 - Canon ImageClass</option>
                  <option>MON-004 - LG UltraWide 34"</option>
                </select>
              </div>

              {/* From Location */}
              <div>
                <label className="block text-gray-700 mb-2">
                  {movementType === 'Receive' ? 'Vendor/Supplier' : 'From Location'} *
                </label>
                <input
                  type="text"
                  placeholder={movementType === 'Receive' ? 'Enter vendor name' : 'Enter current location'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* To Location */}
              <div>
                <label className="block text-gray-700 mb-2">
                  {movementType === 'Check-Out' ? 'Assign To' : 'To Location'} *
                </label>
                <input
                  type="text"
                  placeholder={movementType === 'Check-Out' ? 'Employee name or department' : 'Enter destination location'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Custodian */}
              {(movementType === 'Check-Out' || movementType === 'Transfer') && (
                <div>
                  <label className="block text-gray-700 mb-2">Custodian *</label>
                  <input
                    type="text"
                    placeholder="Enter custodian name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Additional information about this movement..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Movement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
