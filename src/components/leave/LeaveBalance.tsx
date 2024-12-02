import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

interface LeaveBalanceProps {
  balance: {
    paid: number;
    rtt: number;
    sick: number;
  };
}

const LeaveBalance: React.FC<LeaveBalanceProps> = ({ balance }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Solde de congés</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700">Congés payés</span>
          </div>
          <span className="font-medium">{balance.paid} jours</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            <span className="text-gray-700">RTT</span>
          </div>
          <span className="font-medium">{balance.rtt} jours</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-700">Maladie</span>
          </div>
          <span className="font-medium">{balance.sick} jours</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="text-sm text-gray-600">
          <p>Année en cours: 2024</p>
          <p className="mt-1">Prochaine attribution: Janvier 2025</p>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalance;