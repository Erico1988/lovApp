import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Market } from '../types/types';
import { MARKET_TYPES, COORDINATION_OPTIONS } from '../constants/constants';

interface MarketSelectorProps {
  markets: Market[];
  selectedMarkets: string[];
  onMarketSelect: (marketRef: string) => void;
}

const MarketSelector: React.FC<MarketSelectorProps> = ({
  markets,
  selectedMarkets,
  onMarketSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    marketType: '',
    coordination: '',
    status: ''
  });

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.marketRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.marketDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.marketType || market.marketType === filters.marketType;
    const matchesCoordination = !filters.coordination || market.coordination === filters.coordination;
    const matchesStatus = !filters.status || market.status === filters.status;

    return matchesSearch && matchesType && matchesCoordination && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Sélection des marchés</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un marché..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {isExpanded && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de marché
              </label>
              <select
                value={filters.marketType}
                onChange={(e) => setFilters(prev => ({ ...prev, marketType: e.target.value }))}
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les types</option>
                {Object.entries(MARKET_TYPES).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coordination
              </label>
              <select
                value={filters.coordination}
                onChange={(e) => setFilters(prev => ({ ...prev, coordination: e.target.value }))}
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les coordinations</option>
                {COORDINATION_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="NON_COMMENCE">Non commencé</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINE">Terminé</option>
              </select>
            </div>
          </div>
        )}

        <div className="max-h-60 overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sélection
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Référence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMarkets.map(market => (
                <tr
                  key={market.marketRef}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedMarkets.includes(market.marketRef) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onMarketSelect(market.marketRef)}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedMarkets.includes(market.marketRef)}
                      onChange={() => onMarketSelect(market.marketRef)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {market.marketRef}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {market.marketDescription}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      market.status === 'TERMINE' ? 'bg-green-100 text-green-800' :
                      market.status === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {market.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{selectedMarkets.length} marché(s) sélectionné(s)</span>
          <span>{filteredMarkets.length} résultat(s)</span>
        </div>
      </div>
    </div>
  );
};

export default MarketSelector;