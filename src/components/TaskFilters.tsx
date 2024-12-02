import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

interface TaskFiltersProps {
  filters: {
    searchTerm: string;
    status: string;
    assignedTo: string;
    priority: string;
    startDate: string;
    endDate: string;
    progress: {
      min: string;
      max: string;
    };
  };
  onChange: (filters: any) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900 mb-4">Filtres des tâches</h3>
        <button onClick={toggleExpand} className="text-gray-500 hover:text-gray-700">
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une tâche..."
          value={filters.searchTerm}
          onChange={(e) => onChange({ ...filters, searchTerm: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {isExpanded && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={filters.status}
                onChange={(e) => onChange({ ...filters, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="NON_COMMENCE">Non commencé</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINE">Terminé</option>
                <option value="EN_RETARD">En retard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
              <select
                value={filters.priority}
                onChange={(e) => onChange({ ...filters, priority: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les priorités</option>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
            <input
              type="text"
              value={filters.assignedTo}
              onChange={(e) => onChange({ ...filters, assignedTo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom de la ressource"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progression (%)</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min"
                value={filters.progress.min}
                onChange={(e) => onChange({
                  ...filters,
                  progress: { ...filters.progress, min: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.progress.max}
                onChange={(e) => onChange({
                  ...filters,
                  progress: { ...filters.progress, max: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
