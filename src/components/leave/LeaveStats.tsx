import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const LeaveStats = () => {
  const stats = [
    {
      title: 'Congés en cours',
      value: 3,
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Demandes en attente',
      value: 5,
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'Jours restants (moyenne)',
      value: 15,
      icon: AlertTriangle,
      color: 'green',
    },
    {
      title: 'Demandes approuvées',
      value: 42,
      icon: CheckCircle,
      color: 'purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveStats;