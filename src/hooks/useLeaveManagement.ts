import { useState, useCallback } from 'react';
import { LeaveRequest, LeaveStatus } from '../types/leave';
import { toast } from 'react-toastify';

export const useLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const createLeaveRequest = useCallback((request: LeaveRequest) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      employee: 'RAKOTOARISOA Narindra',
      status: LeaveStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests(prev => [...prev, newRequest]);
    toast.success('Demande de congé soumise avec succès');
    return newRequest;
  }, []);

  const approveLeaveRequest = useCallback((request: LeaveRequest, comment: string) => {
    setLeaveRequests(prev =>
      prev.map(r =>
        r.id === request.id
          ? {
              ...r,
              status: LeaveStatus.APPROVED,
              updatedAt: new Date().toISOString(),
              approvalComment: comment,
            }
          : r
      )
    );
    toast.success('Demande de congé approuvée');
  }, []);

  const rejectLeaveRequest = useCallback((request: LeaveRequest, comment: string) => {
    setLeaveRequests(prev =>
      prev.map(r =>
        r.id === request.id
          ? {
              ...r,
              status: LeaveStatus.REJECTED,
              updatedAt: new Date().toISOString(),
              rejectionComment: comment,
            }
          : r
      )
    );
    toast.error('Demande de congé refusée');
  }, []);

  const selectLeaveRequest = useCallback((request: LeaveRequest | null) => {
    setSelectedRequest(request);
  }, []);

  const getFilteredRequests = useCallback((filters: {
    search?: string;
    status?: LeaveStatus;
    startDate?: string;
    endDate?: string;
  }) => {
    return leaveRequests.filter(request => {
      const matchesSearch = !filters.search || 
        request.employee.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || request.status === filters.status;
      const matchesStartDate = !filters.startDate || 
        new Date(request.startDate) >= new Date(filters.startDate);
      const matchesEndDate = !filters.endDate || 
        new Date(request.endDate) <= new Date(filters.endDate);

      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }, [leaveRequests]);

  return {
    leaveRequests,
    selectedRequest,
    createLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    selectLeaveRequest,
    getFilteredRequests,
  };
};