import React from 'react';
import { Task } from '../types/types';

interface DashboardStatsProps {
  tasks: Task[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ tasks }) => {
  const getTaskStats = () => {
    const inProgress = tasks.filter(t => t.status === 'published').length;
    const pending = tasks.filter(t => t.status === 'review').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const highPriority = tasks.filter(t => t.priority === 'high').length;

    return { inProgress, pending, completed, highPriority };
  };

  const stats = getTaskStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">En cours</h3>
        <p className="text-2xl font-bold">{stats.inProgress}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">En attente</h3>
        <p className="text-2xl font-bold">{stats.pending}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Terminées</h3>
        <p className="text-2xl font-bold">{stats.completed}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Priorité haute</h3>
        <p className="text-2xl font-bold">{stats.highPriority}</p>
      </div>
    </div>
  );
};

export default DashboardStats;