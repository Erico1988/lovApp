import React, { useState, useEffect } from 'react';
import { Plus, Filter, BarChart2, TrendingUp, Calendar, Building } from 'lucide-react';
import ProjectTable from '../components/ProjectTable';
import AdvancedFilters from '../components/AdvancedFilters';
import MarketFormModal from '../components/MarketFormModal';
import { Market } from '../types/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const mockCurrentUser = {
  id: '1',
  name: 'RAKOTOARISOA Narindra',
  email: 'narindra.defis@gmail.com',
  role: 'ADMIN_PRINCIPAL',
  coordination: 'UCP',
  permissions: ['CIR_FIANARANTSOA', 'CIR_MANAKARA', 'CIR_FORT_DAUPHIN', 'UCP'],
};

const MarketDashboard = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMarketRefs, setSelectedMarketRefs] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    marketType: '',
    coordination: '',
    status: '',
    startDate: '',
    endDate: '',
    budget: { min: '', max: '' },
  });

  // Données pour les graphiques
  const chartData = {
    marketProgress: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      datasets: [{
        label: 'Marchés terminés',
        data: [4, 6, 8, 12, 15, 18],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    marketDistribution: {
      labels: ['En cours', 'Terminé', 'Non commencé', 'En retard'],
      datasets: [{
        data: [30, 20, 40, 10],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ]
      }]
    },
    budgetExecution: {
      labels: ['T1', 'T2', 'T3', 'T4'],
      datasets: [{
        label: 'Budget prévu',
        data: [1000, 2000, 3000, 4000],
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }, {
        label: 'Budget exécuté',
        data: [800, 1600, 2400, 3200],
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }]
    }
  };

  const handleMarketSelect = (marketRef: string) => {
    setSelectedMarketRefs(prev =>
      prev.includes(marketRef)
        ? prev.filter(ref => ref !== marketRef)
        : [...prev, marketRef]
    );
  };

  const handleAddMarket = (newMarket: Market) => {
    setMarkets(prev => [...prev, newMarket]);
    setIsMarketModalOpen(false);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marchés</h1>
          <p className="text-gray-600 mt-1">
            {markets.length} marché(s) au total
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded ${showFilters ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'} shadow-sm`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMarketModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Nouveau Marché
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Marchés</p>
              <h3 className="text-2xl font-bold text-gray-900">{markets.length}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En cours</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {markets.filter(m => m.status === 'EN_COURS').length}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Terminés</p>
              <h3 className="text-2xl font-bold text-green-600">
                {markets.filter(m => m.status === 'TERMINE').length}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BarChart2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Planifiés</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {markets.filter(m => m.status === 'NON_COMMENCE').length}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Progression des marchés</h3>
          <Line data={chartData.marketProgress} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Distribution des marchés</h3>
          <Pie data={chartData.marketDistribution} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Exécution budgétaire</h3>
          <Bar data={chartData.budgetExecution} />
        </div>
      </div>

      {/* Filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <AdvancedFilters
              onFilterChange={handleFilterChange}
              totalResults={markets.length}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table des marchés */}
      <div className="bg-white rounded-lg shadow-sm">
        <ProjectTable
          markets={markets}
          currentUser={mockCurrentUser}
          onMarketSelect={handleMarketSelect}
          onAddTask={() => {}}
          onTaskStart={() => {}}
          onTaskExecute={() => {}}
          onUpdateMarketStatus={() => {}}
        />
      </div>

      {/* Modal d'ajout de marché */}
      <MarketFormModal
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
        onSubmit={handleAddMarket}
        currentUser={mockCurrentUser}
      />
    </div>
  );
};

export default MarketDashboard;