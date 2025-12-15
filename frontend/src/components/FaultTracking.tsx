import { useState } from 'react';
import { AlertTriangle, Plus, Filter, Search, Clock, CheckCircle, XCircle, User, Calendar, FileText } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Asset Manager' | 'Technician' | 'Employee';
};

type Fault = {
  id: string;
  faultId: string;
  assetTag: string;
  assetName: string;
  status: 'New' | 'Assigned' | 'In Progress' | 'Resolved';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  type: string;
  description: string;
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  location: string;
  department: string;
  sla: string;
  rootCause?: string;
  resolution?: string;
};

type FaultTrackingProps = {
  user: User;
};

export function FaultTracking({ user }: FaultTrackingProps) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFault, setSelectedFault] = useState<Fault | null>(null);

  // Mock fault data
  const mockFaults: Fault[] = [
    {
      id: '1',
      faultId: 'FLT-2024-001',
      assetTag: 'PRN-001',
      assetName: 'Canon ImageClass Printer',
      status: 'In Progress',
      severity: 'High',
      type: 'Hardware Failure',
      description: 'Printer not responding, paper jam error persists after clearing',
      reportedBy: 'John Doe',
      reportedDate: '2024-06-10 09:30',
      assignedTo: 'Mike Tech',
      location: 'Building A - Floor 3',
      department: 'Marketing',
      sla: '2024-06-12 17:00',
      rootCause: 'Paper feed mechanism worn out',
    },
    {
      id: '2',
      faultId: 'FLT-2024-002',
      assetTag: 'LAP-015',
      assetName: 'Dell XPS 13',
      status: 'New',
      severity: 'Critical',
      type: 'Software Issue',
      description: 'Laptop crashes randomly, blue screen errors',
      reportedBy: 'Sarah Smith',
      reportedDate: '2024-06-11 14:15',
      location: 'Building B - Floor 2',
      department: 'Finance',
      sla: '2024-06-11 18:00',
    },
    {
      id: '3',
      faultId: 'FLT-2024-003',
      assetTag: 'SRV-001',
      assetName: 'Dell PowerEdge Server',
      status: 'Assigned',
      severity: 'Critical',
      type: 'Performance',
      description: 'Server running slow, high CPU usage affecting all services',
      reportedBy: 'IT Manager',
      reportedDate: '2024-06-11 08:00',
      assignedTo: 'Mike Tech',
      location: 'Data Center',
      department: 'IT Department',
      sla: '2024-06-11 12:00',
    },
    {
      id: '4',
      faultId: 'FLT-2024-004',
      assetTag: 'MON-008',
      assetName: 'LG UltraWide Monitor',
      status: 'Resolved',
      severity: 'Low',
      type: 'Display Issue',
      description: 'Monitor flickering occasionally',
      reportedBy: 'Emma Wilson',
      reportedDate: '2024-06-09 10:00',
      assignedTo: 'Mike Tech',
      location: 'Building A - Floor 1',
      department: 'Design',
      sla: '2024-06-14 17:00',
      rootCause: 'Loose cable connection',
      resolution: 'Replaced display cable, tested for 24 hours - issue resolved',
    },
    {
      id: '5',
      faultId: 'FLT-2024-005',
      assetTag: 'DSK-023',
      assetName: 'HP EliteDesk Desktop',
      status: 'In Progress',
      severity: 'Medium',
      type: 'Network',
      description: 'Cannot connect to network, Ethernet port not working',
      reportedBy: 'Robert Brown',
      reportedDate: '2024-06-10 16:45',
      assignedTo: 'Jane Network Tech',
      location: 'Building C - Floor 2',
      department: 'HR',
      sla: '2024-06-13 17:00',
    },
  ];

  const [faults] = useState<Fault[]>(mockFaults);

  const filteredFaults = faults.filter((fault) => {
    const matchesSearch =
      fault.faultId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fault.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fault.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || fault.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || fault.severity === filterSeverity;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-700',
      'Assigned': 'bg-purple-100 text-purple-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Resolved': 'bg-green-100 text-green-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      'Low': 'bg-green-100 text-green-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
      'High': 'bg-orange-100 text-orange-700',
      'Critical': 'bg-red-100 text-red-700',
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New':
        return <AlertTriangle className="w-5 h-5 text-blue-600" />;
      case 'Assigned':
      case 'In Progress':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const isSLAExceeded = (slaDate: string, status: string) => {
    if (status === 'Resolved') return false;
    return new Date(slaDate) < new Date();
  };

  const canManageFaults = user.role === 'Admin' || user.role === 'Asset Manager' || user.role === 'Technician';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Fault Tracking & Maintenance</h2>
          <p className="text-gray-600">Report and manage asset faults and maintenance requests</p>
        </div>
        <button
          onClick={() => setShowReportForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Report Fault
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Search Faults</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by fault ID, asset tag, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Status</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Severity</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-gray-600 mb-1">Total Faults</div>
          <div className="text-gray-900">{faults.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-gray-600 mb-1">Open</div>
          <div className="text-gray-900">
            {faults.filter((f) => f.status !== 'Resolved').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-gray-600 mb-1">In Progress</div>
          <div className="text-gray-900">
            {faults.filter((f) => f.status === 'In Progress').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-gray-600 mb-1">Resolved</div>
          <div className="text-gray-900">
            {faults.filter((f) => f.status === 'Resolved').length}
          </div>
        </div>
      </div>

      {/* Fault Cards */}
      <div className="space-y-4">
        {filteredFaults.map((fault) => (
          <div
            key={fault.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedFault(fault)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  {getStatusIcon(fault.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{fault.faultId}</h3>
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(fault.status)}`}>
                      {fault.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${getSeverityColor(fault.severity)}`}>
                      {fault.severity}
                    </span>
                    {isSLAExceeded(fault.sla, fault.status) && (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        SLA Exceeded
                      </span>
                    )}
                  </div>

                  <div className="text-gray-600 mb-3">{fault.assetTag} - {fault.assetName}</div>

                  <p className="text-gray-900 mb-4">{fault.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <div>
                        <div>Reported by:</div>
                        <div className="text-gray-900">{fault.reportedBy}</div>
                      </div>
                    </div>

                    {fault.assignedTo && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <div>
                          <div>Assigned to:</div>
                          <div className="text-gray-900">{fault.assignedTo}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <div>Reported:</div>
                        <div className="text-gray-900">{new Date(fault.reportedDate).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <div>
                        <div>SLA Due:</div>
                        <div className={isSLAExceeded(fault.sla, fault.status) ? 'text-red-600' : 'text-gray-900'}>
                          {new Date(fault.sla).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {fault.rootCause && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="text-yellow-800">Root Cause: {fault.rootCause}</div>
                    </div>
                  )}

                  {fault.resolution && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-green-800">Resolution: {fault.resolution}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFaults.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No faults found matching your criteria</p>
        </div>
      )}

      {/* Report Fault Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-gray-900 mb-6">Report New Fault</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Asset *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select an asset...</option>
                  <option>LAP-001 - Dell XPS 15</option>
                  <option>DSK-002 - HP EliteDesk 800</option>
                  <option>PRN-003 - Canon ImageClass</option>
                  <option>SRV-001 - Dell PowerEdge Server</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Fault Type *</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Hardware Failure</option>
                    <option>Software Issue</option>
                    <option>Network</option>
                    <option>Performance</option>
                    <option>Display Issue</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Severity *</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description *</label>
                <textarea
                  rows={4}
                  placeholder="Describe the fault in detail..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    placeholder="Building and floor"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Department *</label>
                  <input
                    type="text"
                    placeholder="Department name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {canManageFaults && (
                <div>
                  <label className="block text-gray-700 mb-2">Assign To</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Unassigned</option>
                    <option>Mike Tech</option>
                    <option>Jane Network Tech</option>
                    <option>Bob Hardware Tech</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReportForm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Submit Fault Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fault Detail Modal */}
      {selectedFault && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-gray-900 mb-2">{selectedFault.faultId}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full ${getStatusColor(selectedFault.status)}`}>
                    {selectedFault.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full ${getSeverityColor(selectedFault.severity)}`}>
                    {selectedFault.severity}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedFault(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-gray-600 mb-1">Asset</div>
                <div className="text-gray-900">{selectedFault.assetTag} - {selectedFault.assetName}</div>
              </div>

              <div>
                <div className="text-gray-600 mb-1">Description</div>
                <div className="text-gray-900">{selectedFault.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-600 mb-1">Reported By</div>
                  <div className="text-gray-900">{selectedFault.reportedBy}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Reported Date</div>
                  <div className="text-gray-900">{new Date(selectedFault.reportedDate).toLocaleString()}</div>
                </div>
              </div>

              {selectedFault.assignedTo && (
                <div>
                  <div className="text-gray-600 mb-1">Assigned To</div>
                  <div className="text-gray-900">{selectedFault.assignedTo}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-600 mb-1">Location</div>
                  <div className="text-gray-900">{selectedFault.location}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Department</div>
                  <div className="text-gray-900">{selectedFault.department}</div>
                </div>
              </div>

              <div>
                <div className="text-gray-600 mb-1">SLA Due Date</div>
                <div className={isSLAExceeded(selectedFault.sla, selectedFault.status) ? 'text-red-600' : 'text-gray-900'}>
                  {new Date(selectedFault.sla).toLocaleString()}
                  {isSLAExceeded(selectedFault.sla, selectedFault.status) && ' (Exceeded)'}
                </div>
              </div>

              {selectedFault.rootCause && (
                <div>
                  <div className="text-gray-600 mb-1">Root Cause</div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                    {selectedFault.rootCause}
                  </div>
                </div>
              )}

              {selectedFault.resolution && (
                <div>
                  <div className="text-gray-600 mb-1">Resolution</div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    {selectedFault.resolution}
                  </div>
                </div>
              )}
            </div>

            {canManageFaults && selectedFault.status !== 'Resolved' && (
              <div className="flex gap-3 mt-6">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Update Status
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Mark as Resolved
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
