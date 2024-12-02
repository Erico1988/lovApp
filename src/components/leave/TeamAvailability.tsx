import React from 'react';
import { Users, Calendar } from 'lucide-react';

const TeamAvailability = () => {
  const team = [
    {
      name: 'Marie Lambert',
      status: 'present',
      nextLeave: '2024-03-15',
      remainingDays: 15,
    },
    {
      name: 'Pierre Martin',
      status: 'absent',
      returnDate: '2024-03-12',
      remainingDays: 10,
    },
    {
      name: 'Sophie Dubois',
      status: 'present',
      nextLeave: '2024-04-01',
      remainingDays: 20,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-500" />
        Disponibilité de l'équipe
      </h3>

      <div className="space-y-4">
        {team.map((member, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">{member.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    member.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {member.status === 'present' ? (
                    <>
                      Prochain congé:{' '}
                      {new Date(member.nextLeave).toLocaleDateString()}
                    </>
                  ) : (
                    <>
                      Retour le:{' '}
                      {new Date(member.returnDate).toLocaleDateString()}
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">
                {member.remainingDays} jours
              </span>
              <p className="text-xs text-gray-500">restants</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Congés à venir
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">15-20 Mars:</span>
            <span className="font-medium">Marie Lambert</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">1-5 Avril:</span>
            <span className="font-medium">Sophie Dubois</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAvailability;