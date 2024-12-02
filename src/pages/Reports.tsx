import React, { useState } from 'react';
import { BarChart2, PieChart, TrendingUp, Download, FileText, Calendar, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReportData {
  id: string;
  title: string;
  type: 'monthly' | 'financial' | 'trends';
  date: Date;
  data: any;
}

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedType, setSelectedType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const mockReports: ReportData[] = [
    {
      id: '1',
      title: 'Synthèse mensuelle',
      type: 'monthly',
      date: new Date(),
      data: {
        plannedTasks: 45,
        completedTasks: 38,
        delayedTasks: 7,
        physicalProgress: 84,
      }
    },
    {
      id: '2',
      title: 'Analyse budgétaire',
      type: 'financial',
      date: new Date(),
      data: {
        totalBudget: 15000000,
        spent: 12500000,
        remaining: 2500000,
        overBudgetTasks: 2,
      }
    },
    {
      id: '3',
      title: 'Tendances et prévisions',
      type: 'trends',
      date: new Date(),
      data: {
        completionTrend: 'positive',
        estimatedCompletion: '2024-06-30',
        riskLevel: 'medium',
      }
    },
  ];

  const handleExport = (format: 'pdf' | 'excel') => {
    // Implementation would go here
    console.log(`Exporting in ${format} format`);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="month">Mensuel</option>
              <option value="quarter">Trimestriel</option>
              <option value="year">Annuel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de rapport</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="monthly">Synthèse mensuelle</option>
              <option value="financial">Analyse budgétaire</option>
              <option value="trends">Tendances</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {report.type === 'monthly' && <BarChart2 className="w-6 h-6 text-blue-600" />}
                {report.type === 'financial' && <PieChart className="w-6 h-6 text-green-600" />}
                {report.type === 'trends' && <TrendingUp className="w-6 h-6 text-purple-600" />}
                <h3 className="font-semibold text-lg">{report.title}</h3>
              </div>
              <span className="text-sm text-gray-500">
                {format(report.date, 'PP', { locale: fr })}
              </span>
            </div>

            <div className="space-y-4">
              {report.type === 'monthly' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tâches planifiées</span>
                    <span className="font-medium">{report.data.plannedTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tâches complétées</span>
                    <span className="font-medium text-green-600">{report.data.completedTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tâches en retard</span>
                    <span className="font-medium text-red-600">{report.data.delayedTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Progression physique</span>
                    <span className={`font-medium ${getProgressColor(report.data.physicalProgress)}`}>
                      {report.data.physicalProgress}%
                    </span>
                  </div>
                </>
              )}

              {report.type === 'financial' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Budget total</span>
                    <span className="font-medium">{formatCurrency(report.data.totalBudget)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dépensé</span>
                    <span className="font-medium text-blue-600">{formatCurrency(report.data.spent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Restant</span>
                    <span className="font-medium text-green-600">{formatCurrency(report.data.remaining)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tâches hors budget</span>
                    <span className="font-medium text-red-600">{report.data.overBudgetTasks}</span>
                  </div>
                </>
              )}

              {report.type === 'trends' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tendance d'achèvement</span>
                    <span className={`font-medium ${
                      report.data.completionTrend === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {report.data.completionTrend === 'positive' ? 'Positive' : 'Négative'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date estimée de fin</span>
                    <span className="font-medium">
                      {format(new Date(report.data.estimatedCompletion), 'PP', { locale: fr })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Niveau de risque</span>
                    <span className={`font-medium ${
                      report.data.riskLevel === 'low' ? 'text-green-600' :
                      report.data.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {report.data.riskLevel === 'low' ? 'Faible' :
                       report.data.riskLevel === 'medium' ? 'Moyen' : 'Élevé'}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <FileText className="w-4 h-4" />
                Télécharger le rapport détaillé
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Écarts de planification</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tâche</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date prévue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date réelle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Écart (jours)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  task: "Validation des spécifications",
                  planned: "2024-03-01",
                  actual: "2024-03-05",
                  variance: 4,
                  impact: "Faible"
                },
                {
                  task: "Réception des offres",
                  planned: "2024-03-15",
                  actual: "2024-03-25",
                  variance: 10,
                  impact: "Moyen"
                }
              ].map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.task}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(item.planned), 'PP', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(item.actual), 'PP', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">+{item.variance}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.impact === 'Faible' ? 'bg-green-100 text-green-800' :
                      item.impact === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.impact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;