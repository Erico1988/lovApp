import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  startDate: string;
  dueDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: string;
}

interface VarianceTrackingProps {
  tasks: Task[];
}

const VarianceTracking: React.FC<VarianceTrackingProps> = ({ tasks }) => {
  const calculateVariance = (task: Task) => {
    const planned = {
      start: new Date(task.startDate),
      end: new Date(task.dueDate)
    };
    
    const actual = {
      start: task.actualStartDate ? new Date(task.actualStartDate) : new Date(),
      end: task.actualEndDate ? new Date(task.actualEndDate) : new Date()
    };

    return {
      startVariance: differenceInDays(actual.start, planned.start),
      endVariance: task.actualEndDate ? differenceInDays(actual.end, planned.end) : null,
      remainingDays: differenceInDays(new Date(task.dueDate), new Date())
    };
  };

  const getVarianceColor = (variance: number) => {
    if (variance <= 0) return 'text-green-600';
    if (variance <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (task: Task) => {
    const variance = calculateVariance(task);
    if (variance.startVariance > 5) return 'bg-red-600';
    if (variance.startVariance > 0) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-500" />
        Suivi des Écarts
      </h2>

      <div className="space-y-6">
        {tasks.map(task => {
          const variance = calculateVariance(task);
          const progressBarColor = getProgressBarColor(task);

          return (
            <div key={task.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-500">
                    Prévu: {format(new Date(task.startDate), 'PP', { locale: fr })} - {format(new Date(task.dueDate), 'PP', { locale: fr })}
                  </p>
                </div>
                {variance.startVariance > 0 && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Retard détecté</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Écart de démarrage</span>
                  <span className={getVarianceColor(variance.startVariance)}>
                    {variance.startVariance > 0 ? `+${variance.startVariance}` : variance.startVariance} jours
                  </span>
                </div>

                {variance.endVariance !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Écart de fin</span>
                    <span className={getVarianceColor(variance.endVariance)}>
                      {variance.endVariance > 0 ? `+${variance.endVariance}` : variance.endVariance} jours
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jours restants</span>
                  <span className={variance.remainingDays < 0 ? 'text-red-600' : 'text-gray-900'}>
                    {variance.remainingDays} jours
                  </span>
                </div>

                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${progressBarColor} transition-all duration-300`}
                      style={{
                        width: `${Math.min(100, Math.max(0, 100 - (variance.startVariance * 10)))}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VarianceTracking;