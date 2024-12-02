import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Calendar, Tag, Clock, AlertTriangle } from 'lucide-react';
import { MARKET_TYPES, COORDINATION_OPTIONS } from '../constants/constants';
import { debounce } from 'lodash';

interface AdvancedFiltersProps {
  onFilterChange: (filters: any) => void;
  totalResults?: number;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFilterChange, totalResults }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    marketType: '',
    coordination: '',
    status: '',
    startDate: '',
    endDate: '',
    budget: {
      min: '',
      max: ''
    },
    priority: '',
    indicator: ''
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Debounced filter change handler
  const debouncedFilterChange = useCallback(
    debounce((newFilters) => {
      onFilterChange(newFilters);
    }, 300),
    []
  );

  useEffect(() => {
    // Track active filters
    const active = Object.entries(filters).reduce((acc: string[], [key, value]) => {
      if (key === 'budget') {
        if (filters.budget.min || filters.budget.max) {
          acc.push('budget');
        }
      } else if (value) {
        acc.push(key);
      }
      return acc;
    }, []);
    setActiveFilters(active);

    debouncedFilterChange(filters);
  }, [filters, debouncedFilterChange]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleBudgetChange = (type: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      budget: { ...prev.budget, [type]: value }
    }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      marketType: '',
      coordination: '',
      status: '',
      startDate: '',
      endDate: '',
      budget: { min: '', max: '' },
      priority: '',
      indicator: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const removeFilter = (filterKey: string) => {
    if (filterKey === 'budget') {
      setFilters(prev => ({
        ...prev,
        budget: { min: '', max: '' }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterKey]: ''
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Filtres avancés</h3>
          {totalResults !== undefined && (
            <span className="text-sm text-gray-500">
              ({totalResults} résultat{totalResults !== 1 ? 's' : ''})
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          {isExpanded ? 'Réduire' : 'Développer'}
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom, référence..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {activeFilters.length > 0 && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de marché
            </label>
            <select
              value={filters.marketType}
              onChange={(e) => handleFilterChange('marketType', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les types</option>
              {Object.entries(MARKET_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coordination
            </label>
            <select
              value={filters.coordination}
              onChange={(e) => handleFilterChange('coordination', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les coordinations</option>
              {COORDINATION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Budget (MGA)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.budget.min}
                onChange={(e) => handleBudgetChange('min', e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.budget.max}
                onChange={(e) => handleBudgetChange('max', e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Indicateur
            </label>
            <select
              value={filters.indicator}
              onChange={(e) => handleFilterChange('indicator', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les indicateurs</option>
              <option value="indicator4">Indicateur 4</option>
              <option value="indicator6">Indicateur 6</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;