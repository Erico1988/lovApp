import React, { createContext, useContext } from 'react';
import { useTaskPlanning, PlannedTask } from '../hooks/useTaskPlanning';

interface PlanningContextType {
  plannedTasks: PlannedTask[];
  addTaskToPlanning: (task: PlannedTask) => void;
  removeTaskFromPlanning: (taskId: string) => void;
  updateTaskInPlanning: (taskId: string, updates: Partial<PlannedTask>) => void;
  getTasksByDateRange: (startDate: string, endDate: string) => PlannedTask[];
  getTasksByMarket: (marketRef: string) => PlannedTask[];
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const planning = useTaskPlanning();

  return (
    <PlanningContext.Provider value={planning}>
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (context === undefined) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};