import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Filter, Search, LayoutGrid, LayoutList } from 'lucide-react';
import LeaveCalendar from '../components/leave/LeaveCalendar';
import LeaveTable from '../components/leave/LeaveTable';
import LeaveStats from '../components/leave/LeaveStats';
import TeamAvailability from '../components/leave/TeamAvailability';
import LeaveRequestModal from '../components/leave/LeaveRequestModal';
import LeaveApprovalModal from '../components/leave/LeaveApprovalModal';
import { LeaveRequest, LeaveStatus, LeaveType } from '../types/leave';
import { toast } from 'react-toastify';

const LeaveManagement = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  // Mock current user's leave balance
  const currentBalance = {
    paid: 25,
    rtt: 10,
    sick: 3,
  };

  const handleCreateRequest = (request: LeaveRequest) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      employee: 'RAKOTOARISOA Narindra',
      status: LeaveStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests(prev => [...prev, newRequest]);
    toast.success('Demande de congé soumise avec succès');
  };

  const handleApproveRequest = (request: LeaveRequest, comment: string) => {
    setLeaveRequests(prev =>
      prev.map(r =>
        r.id === request.id
          ? { ...r, status: LeaveStatus.APPROVED, updatedAt: new Date().toISOString() }
          : r
      )
    );
    toast.success('Demande de congé approuvée');
  };

  const handleRejectRequest = (request: LeaveRequest, comment: string) => {
    setLeaveRequests(prev =>
      prev.map(r =>
        r.id === request.id
          ? { ...r, status: LeaveStatus.REJECTED, updatedAt: new Date().toISOString() }
          : r
      )
    );
    toast.error('Demande de congé refusée');
  };

  const handleSelectRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsApprovalModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Congés</h1>
          <p className="text-gray-600 mt-1">
            Gérez et suivez les demandes de congés de l'équipe
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
              }`}
            >
              <LayoutList className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg ${
                viewMode === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg ${
              showFilters ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
            } shadow-sm`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Nouvelle demande
          </button>
        </div>
      </div>

      <LeaveStats />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          {viewMode === 'calendar' ? (
            <LeaveCalendar onSelectLeave={handleSelectRequest} />
          ) : (
            <LeaveTable onSelectLeave={handleSelectRequest} />
          )}
        </div>
        
        <div className="col-span-12 lg:col-span-3">
          <TeamAvailability />
        </div>
      </div>

      {/* Modals */}
      <LeaveRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleCreateRequest}
        currentBalance={currentBalance}
      />

      {selectedRequest && (
        <LeaveApprovalModal
          isOpen={isApprovalModalOpen}
          onClose={() => {
            setIsApprovalModalOpen(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}
    </div>
  );
};

export default LeaveManagement;