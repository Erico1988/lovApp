import React, { useState } from 'react';
import { Calendar, User, Filter, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'MARKET' | 'TASK' | 'USER';
  entityId: string;
  details: string;
  timestamp: Date;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    userId: '1',
    userName: 'RAKOTOARISOA Narindra',
    action: 'CREATE',
    entityType: 'MARKET',
    entityId: 'MARK-2024-001',
    details: 'Création du marché "Équipements informatiques"',
    timestamp: new Date('2024-03-10T10:30:00'),
  },
  {
    id: '2',
    userId: '1',
    userName: 'RAKOTOARISOA Narindra',
    action: 'UPDATE',
    entityType: 'TASK',
    entityId: 'TASK-001',
    details: 'Mise à jour du statut de la tâche "Installation" à "EN_COURS"',
    timestamp: new Date('2024-03-11T14:15:00'),
  },
];

const ActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: '',
    entityType: '',
    action: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange = (!filters.startDate || new Date(activity.timestamp) >= new Date(filters.startDate)) &&
                            (!filters.endDate || new Date(activity.timestamp) <= new Date(filters.endDate));
    const matchesEntityType = !filters.entityType || activity.entityType === filters.entityType;
    const matchesAction = !filters.action || activity.action === filters.action;

    return matchesSearch && matchesDateRange && matchesEntityType && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'MARKET':
        return '📊';
      case 'TASK':
        return '📋';
      case 'USER':
        return '👤';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Journal d'Activités</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActivities([])}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Effacer l'historique
          </button>
          <button
            onClick={() => {/* Export logic */}}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Exporter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'entité</label>
            <select
              value={filters.entityType}
              onChange={(e) => setFilters(prev => ({ ...prev, entityType: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              <option value="MARKET">Marchés</option>
              <option value="TASK">Tâches</option>
              <option value="USER">Utilisateurs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Toutes</option>
              <option value="CREATE">Création</option>
              <option value="UPDATE">Modification</option>
              <option value="DELETE">Suppression</option>
            </select>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans les activités..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
                {getEntityIcon(activity.entityType)}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                    {activity.action}
                  </span>
                  <span className="text-sm text-gray-600">
                    {format(activity.timestamp, 'PPpp', { locale: fr })}
                  </span>
                </div>
                
                <p className="text-gray-900">{activity.details}</p>
                
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{activity.userName}</span>
                  <span className="text-gray-400">•</span>
                  <span>ID: {activity.entityId}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune activité trouvée pour les filtres sélectionnés
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;