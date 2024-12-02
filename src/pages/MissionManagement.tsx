import React, { useState } from 'react';
import { Plus, Filter, Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';
import MissionCalendar from '../components/mission/MissionCalendar';
import MissionForm from '../components/mission/MissionForm';
import MissionStats from '../components/mission/MissionStats';
import MissionTable from '../components/mission/MissionTable';
import MissionTimeline from '../components/mission/MissionTimeline';
import { Mission, MissionStatus } from '../types/mission';

const MissionManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [filter, setFilter] = useState({
    status: '',
    type: '',
    dateRange: { start: '', end: '' },
    location: '',
    team: ''
  });

  const handleCreateMission = (missionData: Mission) => {
    // Logic for creating new mission
    console.log('New mission:', missionData);
    setIsFormOpen(false);
  };

  const handleUpdateMission = (missionData: Mission) => {
    // Logic for updating mission
    console.log('Update mission:', missionData);
    setSelectedMission(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Missions</h1>
          <p className="text-gray-600 mt-1">Planification et suivi des missions terrain</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg ${
                view === 'calendar' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg ${
                view === 'list' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Mission
          </button>
        </div>
      </div>

      <MissionStats />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          {view === 'calendar' ? (
            <MissionCalendar onSelectMission={setSelectedMission} />
          ) : (
            <MissionTable onSelectMission={setSelectedMission} />
          )}
        </div>
        
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <MissionTimeline />
        </div>
      </div>

      {/* Mission Form Modal */}
      {(isFormOpen || selectedMission) && (
        <MissionForm
          mission={selectedMission}
          onSubmit={selectedMission ? handleUpdateMission : handleCreateMission}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedMission(null);
          }}
        />
      )}
    </div>
  );
};

export default MissionManagement;