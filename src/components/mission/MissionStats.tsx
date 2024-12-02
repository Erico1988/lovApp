import React from 'react';
import { MapPin, Users, Clock, TrendingUp } from 'lucide-react';

const MissionStats = () => {
  const stats = [
    {
      title: 'Missions en cours',
      value: 5,
      icon: Clock,
      color: 'blue',
      trend: '+2 cette semaine'
    },
    {
      title: 'Équipes déployées',
      value: 12,
      icon: Users,
      color: 'green',
      trend: '3 régions'
    },
    {
      title: 'Sites visités',
      value: 24,
      icon: MapPin,
      color: 'purple',
      trend: '75% objectif'
    },
    {
      title: 'Budget utilisé',
      value: '85%',
      icon: TrendingUp,
      color: 'yellow',
      trend: '12.5M MGA'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <h3 className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</h3>
            </div>
            <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progression</span>
              <span className={`text-${stat.color}-600`}>{stat.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MissionStats;