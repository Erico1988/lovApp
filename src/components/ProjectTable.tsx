import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Market, User } from '../types/types';
import { ChevronDown, ChevronRight, Building, Plus } from 'lucide-react';
import { MARKET_TYPES, COORDINATION_OPTIONS } from '../constants/constants';
import { getMarketTasksInfo } from '../utils/marketUtils';
import { motion } from 'framer-motion';
import { usePermissions } from '../hooks/usePermissions';
import { generateTaskId } from '../utils/taskUtils'; // Importer la fonction utilitaire

interface ProjectTableProps {
  markets: Market[];
  currentUser: User;
  onMarketSelect: (marketRef: string) => void;
  onAddTask: (marketRef: string) => void;
  onTaskStart: (taskId: string) => void;
  onTaskExecute: (taskId: string) => void;
  onUpdateMarketStatus: (marketRef: string) => void; // Nouvelle prop pour mettre à jour le statut du marché
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  markets,
  currentUser,
  onMarketSelect,
  onAddTask,
  onTaskStart,
  onTaskExecute,
  onUpdateMarketStatus,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Market | '';
    direction: 'asc' | 'desc';
  }>({ key: '', direction: 'asc' });
  const [expandedMarkets, setExpandedMarkets] = useState<string[]>([]);
  const [selectedCoordination, setSelectedCoordination] = useState<string>('');
  const [selectedMarketRefs, setSelectedMarketRefs] = useState<string[]>([]);

  const { isAdmin, canManageMarket } = usePermissions(currentUser);

  const filteredMarkets = useMemo(() => {
    let filtered = markets.filter(market => {
      if (isAdmin) return true;
      return canManageMarket(market.coordination);
    });

    if (selectedCoordination) {
      filtered = filtered.filter(market => market.coordination === selectedCoordination);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key]! > b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [markets, currentUser, selectedCoordination, sortConfig, isAdmin, canManageMarket]);

  const taskCountsByMarket = useMemo(() => {
    return markets.reduce((acc, market) => {
      const tasks = market.tasks || [];
      acc[market.marketRef] = {
        totalTasks: tasks.length,
        notStartedTasks: tasks.filter(task => task.status === 'NON_COMMENCE').length,
        inProgressTasks: tasks.filter(task => task.status === 'EN_COURS').length,
        completedTasks: tasks.filter(task => task.status === 'TERMINE').length,
      };
      return acc;
    }, {} as Record<string, { totalTasks: number; notStartedTasks: number; inProgressTasks: number; completedTasks: number }>);
  }, [markets]);

  const toggleMarketExpansion = (marketId: string) => {
    setExpandedMarkets(current =>
      current.includes(marketId)
        ? current.filter(id => id !== marketId)
        : [...current, marketId]
    );
  };

  const handleMarketCheckboxChange = (marketRef: string) => {
    setSelectedMarketRefs(current =>
      current.includes(marketRef)
        ? current.filter(ref => ref !== marketRef)
        : [...current, marketRef]
    );
    onMarketSelect(marketRef);
  };

  const handleAddTask = (marketRef: string) => {
    const market = markets.find(m => m.marketRef === marketRef);
    if (market) {
      const taskNumber = (market.tasks || []).length + 1;
      const newTask = {
        id: generateTaskId(marketRef, taskNumber), // Générer l'identifiant unique
        description: `Tâche ${taskNumber}`,
        status: 'NON_COMMENCE',
        startDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        assignedResource: '',
        marketRef: marketRef,
      };
      market.tasks = [...(market.tasks || []), newTask];
      onAddTask(marketRef);
      onUpdateMarketStatus(marketRef); // Mettre à jour le statut du marché
    }
  };

  const handleTaskStart = (taskId: string) => {
    onTaskStart(taskId);
    const marketRef = markets.find(market => market.tasks?.some(task => task.id === taskId))?.marketRef;
    if (marketRef) {
      onUpdateMarketStatus(marketRef); // Mettre à jour le statut du marché
    }
  };

  const handleTaskExecute = (taskId: string) => {
    onTaskExecute(taskId);
    const marketRef = markets.find(market => market.tasks?.some(task => task.id === taskId))?.marketRef;
    if (marketRef) {
      onUpdateMarketStatus(marketRef); // Mettre à jour le statut du marché
    }
  };

  const formatBudget = (value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return value;
    return numericValue.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' });
  };

  const getLastTask = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return null;
    return tasks.reduce((prev, current) => (prev.id > current.id ? prev : current));
  };

  return (
    <div className="space-y-4">
      {currentUser.role !== 'USER' && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-4">
            <Building className="w-5 h-5 text-gray-500" />
            <label htmlFor="coordination-select" className="sr-only">
              Sélectionner la coordination
            </label>
            <select
              id="coordination-select"
              value={selectedCoordination}
              onChange={e => setSelectedCoordination(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Sélectionner la coordination"
            >
              {COORDINATION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sélection
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordination
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de Marché
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réf. Marché
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description du Marché
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut du Marché
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget Prévisionnel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ligne Budgétaire Utilisée
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PTBA
                </th>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMarkets.map(market => {
                const { marketStatus, lastAddedTask } = getMarketTasksInfo(market.marketRef, markets);
                const taskCounts = taskCountsByMarket[market.marketRef];
                return (
                  <React.Fragment key={market.id}>
                    <tr
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedMarketRefs.includes(market.marketRef) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleMarketExpansion(market.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          aria-label={`${expandedMarkets.includes(market.id) ? 'Réduire' : 'Étendre'} ${market.marketRef}`}
                        >
                          {expandedMarkets.includes(market.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <label htmlFor={`market-checkbox-${market.marketRef}`} className="sr-only">
                          Sélectionner {market.marketRef}
                        </label>
                        <input
                          id={`market-checkbox-${market.marketRef}`}
                          type="checkbox"
                          checked={selectedMarketRefs.includes(market.marketRef)}
                          onChange={() => handleMarketCheckboxChange(market.marketRef)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          aria-label={`Sélectionner ${market.marketRef}`}
                        />
                      </td>
                      <td className="px-4 py-3">{market.coordination || 'Non spécifié'}</td>
                      <td className="px-4 py-3">
                        {MARKET_TYPES[market.marketType] || 'Type inconnu'}
                      </td>
                      <td className="px-4 py-3 font-medium">{market.marketRef || 'Non défini'}</td>
                      <td className="px-4 py-3">{market.marketDescription || 'Non défini'}</td>
                      <td className="px-4 py-3">{market.status || 'Non démarré'}</td> {/* Le statut est mis à jour dynamiquement */}
                      <td className="px-4 py-3">{formatBudget(market.budgetPrev) || 'Non défini'}</td>
                      <td className="px-4 py-3">
                        {market.ligneBudgetaireUtilisee && market.ligneBudgetaireUtilisee.length > 0 ? (
                          market.ligneBudgetaireUtilisee.map((ligne, index) => (
                            <div key={index}>{ligne}</div>
                          ))
                        ) : (
                          'Non défini'
                        )}
                      </td>
                      <td className="px-4 py-3">{market.ptba || 'Non défini'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleAddTask(market.marketRef);
                            }}
                            className="p-1 bg-green-600 text-white hover:bg-green-700 rounded"
                            aria-label={`Ajouter une nouvelle tâche à ${market.marketRef}`}
                          >
                            Nouvelle tâche
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedMarkets.includes(market.id) && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <td colSpan={11} className="px-4 py-3">
                          <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Réf. Marché
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Nombre de tâches
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Tâches non commencées
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Tâches en cours
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Tâches terminées
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  <tr>
                                    <td className="px-4 py-3 font-medium">{market.marketRef || 'Non défini'}</td>
                                    <td className="px-4 py-3">{taskCounts.totalTasks}</td>
                                    <td className="px-4 py-3">{taskCounts.notStartedTasks}</td>
                                    <td className="px-4 py-3">{taskCounts.inProgressTasks}</td>
                                    <td className="px-4 py-3">{taskCounts.completedTasks}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-800">Dernière tâche ajoutée</h3>
                            {market.tasks && market.tasks.length > 0 ? (
                              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <p className="text-sm font-medium text-gray-700">
                                  {getLastTask(market.tasks)?.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ID: {getLastTask(market.tasks)?.id}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Statut: {getLastTask(market.tasks)?.status}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Aucune tâche ajoutée.</p>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

ProjectTable.propTypes = {
  markets: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  onMarketSelect: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onTaskStart: PropTypes.func.isRequired,
  onTaskExecute: PropTypes.func.isRequired,
  onUpdateMarketStatus: PropTypes.func.isRequired, // Ajout de la nouvelle prop
};

export default ProjectTable;
