import React from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LeaveRequest } from '../../types/leave';

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

interface LeaveCalendarProps {
  onSelectLeave: (leave: LeaveRequest) => void;
}

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({ onSelectLeave }) => {
  const events = [
    {
      id: 1,
      title: 'Congés - Marie Lambert',
      start: new Date(2024, 2, 15),
      end: new Date(2024, 2, 20),
      type: 'PAID',
      employee: 'Marie Lambert',
    },
    {
      id: 2,
      title: 'RTT - Pierre Martin',
      start: new Date(2024, 2, 18),
      end: new Date(2024, 2, 19),
      type: 'RTT',
      employee: 'Pierre Martin',
    },
  ];

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '';
    switch (event.type) {
      case 'PAID':
        backgroundColor = '#60A5FA';
        break;
      case 'UNPAID':
        backgroundColor = '#F87171';
        break;
      case 'RTT':
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
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => onSelectLeave(event as LeaveRequest)}
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

export default LeaveCalendar;