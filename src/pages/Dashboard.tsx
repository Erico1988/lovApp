import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  LineController,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { AlertTriangle, Calendar, Clock, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Task } from '../types/types';
import TaskModal from './TaskModal';
import { format, addDays, isBefore, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  LineController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Données simulées pour les marchés
  const marketStats = {
    enCours: 12,
    termine: 8,
    nonDemarre: 5,
    retard: 3
  };

  // Données simulées pour les tâches
  const taskStats = {
    total: 45,
    enRetard: 7,
    aRisque: 4,
    imminentes: 3
  };

  // Données simulées pour les alertes
  const alerts = [
    {
      id: 1,
      type: 'deadline',
      message: 'Échéance dans 2 jours : Marché M123',
      severity: 'high'
    },
    {
      id: 2,
      type: 'start',
      message: 'Début prévu demain : Installation équipements',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'risk',
      message: 'Risque de retard détecté : Validation documents',
      severity: 'low'
    }
  ];

  // Données pour les graphiques
  const marketProgressData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Marchés terminés',
        data: [4, 6, 8, 12, 15, 18],
        backgroundColor: '#4CAF50',
      }
    ]
  };

  const taskDistributionData = {
    labels: ['En cours', 'Non commencé', 'Terminé', 'En retard'],
    datasets: [
      {
        data: [12, 5, 8, 3],
        backgroundColor: ['#2196F3', '#FFC107', '#4CAF50', '#F44336'],
      }
    ]
  };

  const progressTrendData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        label: 'Progression réelle',
        data: [20, 45, 60, 75],
        borderColor: '#2196F3',
        fill: false
      },
      {
        label: 'Progression prévue',
        data: [25, 50, 75, 100],
        borderColor: '#90CAF9',
        borderDash: [5, 5],
        fill: false
      }
    ]
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-5 h-5" />;
      case 'start':
        return <Calendar className="w-5 h-5" />;
      case 'risk':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 max-w-7xl mx-auto px-6 py-8 ${darkMode ? 'dark' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Tableau de bord</h1>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">Tous les marchés</option>
            <option value="active">Marchés actifs</option>
            <option value="completed">Marchés terminés</option>
          </select>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? 'Mode Clair' : 'Mode Sombre'}
          </button>
        </div>
      </div>

      {/* Statistiques des marchés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Marchés en cours</p>
              <h3 className="text-2xl font-bold text-blue-600">{marketStats.enCours}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progression</span>
              <span className="text-green-600">+12% ce mois</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Marchés terminés</p>
              <h3 className="text-2xl font-bold text-green-600">{marketStats.termine}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Taux de succès</span>
              <span className="text-green-600">95%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Non démarrés</p>
              <h3 className="text-2xl font-bold text-gray-600">{marketStats.nonDemarre}</h3>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">À démarrer</span>
              <span className="text-blue-600">Cette semaine: 2</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En retard</p>
              <h3 className="text-2xl font-bold text-red-600">{marketStats.retard}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Retard moyen</span>
              <span className="text-red-600">5 jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Progression des marchés</h3>
          <Bar data={marketProgressData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Distribution des tâches</h3>
          <Pie data={taskDistributionData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Tendance de progression</h3>
          <Line data={progressTrendData} />
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Alertes récentes</h3>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 p-4 rounded-lg ${getAlertColor(alert.severity)}`}
              >
                {getAlertIcon(alert.type)}
                <div>
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(), 'PPp', { locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Tâches à surveiller</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium">Tâches en retard</p>
                  <p className="text-sm text-gray-600">{taskStats.enRetard} tâches</p>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-700">Voir</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Tâches à risque</p>
                  <p className="text-sm text-gray-600">{taskStats.aRisque} tâches</p>
                </div>
              </div>
              <button className="text-yellow-600 hover:text-yellow-700">Voir</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Échéances imminentes</p>
                  <p className="text-sm text-gray-600">{taskStats.imminentes} tâches</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700">Voir</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour l'édition des tâches */}
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
          isEditing={isEditing}
          onSave={(task) => {
            console.log('Tâche sauvegardée:', task);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;