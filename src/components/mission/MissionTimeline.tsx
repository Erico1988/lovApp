import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MissionTimeline = () => {
  const timeline = [
    {
      id: 1,
      title: 'Mission Fianarantsoa',
      date: new Date(2024, 2, 15),
      type: 'start',
      location: 'Fianarantsoa',
      team: ['Marie Lambert', 'Pierre Martin']
    },
    {
      id: 2,
      title: 'Mission Manakara',
      date: new Date(2024, 2, 18),
      type: 'upcoming',
      location: 'Manakara',
      team: ['Sophie Dubois']
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        Chronologie des missions
      </h3>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>

        <div className="space-y-6">
          {timeline.map((event) => (
            <div key={event.id} className="relative pl-10">
              <div className={`absolute left-2 top-2 w-4 h-4 rounded-full ${
                event.type === 'start' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.type === 'start' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {event.type === 'start' ? 'En cours' : 'À venir'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{format(event.date, 'PPP', { locale: fr })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{event.team.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionTimeline;