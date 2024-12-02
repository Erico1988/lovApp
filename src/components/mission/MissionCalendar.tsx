import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Mission } from '../../types/mission';

const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface MissionCalendarProps {
  onSelectMission: (mission: Mission) => void;
}

const MissionCalendar: React.FC<MissionCalendarProps> = ({ onSelectMission }) => {
  const events = [
    {
      id: 1,
      title: 'Mission Fianarantsoa - Suivi des marchés',
      start: new Date(2024, 2, 15),
      end: new Date(2024, 2, 20),
      type: 'FIELD',
      team: ['Marie Lambert', 'Pierre Martin'],
      location: 'Fianarantsoa'
    },
    {
      id: 2,
      title: 'Mission Manakara - Formation',
      start: new Date(2024, 2, 18),
      end: new Date(2024, 2, 19),
      type: 'TRAINING',
      team: ['Sophie Dubois'],
      location: 'Manakara'
    },
  ];

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '';
    switch (event.type) {
      case 'FIELD':
        backgroundColor = '#60A5FA';
        break;
      case 'TRAINING':
        backgroundColor = '#34D399';
        break;
      default:
        backgroundColor = '#9CA3AF';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0',
        display: 'block',
      },
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => onSelectMission(event as Mission)}
        messages={{
          next: "Suivant",
          previous: "Précédent",
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          agenda: "Agenda",
        }}
      />
    </div>
  );
};

export default MissionCalendar;