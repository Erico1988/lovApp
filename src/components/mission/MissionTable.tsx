import React from 'react';
import { MoreVertical, MapPin, Users, Calendar, Clock } from 'lucide-react';
import { Mission, MissionStatus } from '../../types/mission';

interface MissionTableProps {
  onSelectMission: (mission: Mission) => void;
}

const MissionTable: React.FC<MissionTableProps> = ({ onSelectMission }) => {
  const missions = [
    {
      id: '1',
      title: 'Mission Fianarantsoa - Suivi des marchés',
      type: 'FIELD',
      status: MissionStatus.IN_PROGRESS,
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      location: 'Fianarantsoa',
      team: ['Marie Lambert', 'Pierre Martin'],
      progress: 65
    },
    {
      id: '2',
      title: 'Mission Manakara - Formation',
      type: 'TRAINING',
      status: MissionStatus.PLANNED,
      startDate: '2024-03-18',
      endDate: '2024-03-19',
      location: 'Manakara',
      team: ['Sophie Dubois'],
      progress: 0
    }
  ];

  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case MissionStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case MissionStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case MissionStatus.ON_HOLD:
        return 'bg-yellow-100 text-yellow-800';
      case MissionStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lieu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Équipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progression
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {missions.map((mission) => (
              <tr
                key={mission.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectMission(mission as Mission)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{mission.title}</div>
                  <div className="text-sm text-gray-500">{mission.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{mission.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{mission.team.length} membres</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {new Date(mission.startDate).toLocaleDateString()} - {new Date(mission.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(mission.status)}`}>
                    {mission.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${mission.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{mission.progress}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MissionTable;