import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { MARKET_TYPES, COORDINATION_OPTIONS } from '../constants/constants'; // Importer les constantes

interface MarketFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (marketData: any) => void;
  currentUser: {
    coordination: string | null;
    role: string;
  };
}

const MarketForm: React.FC<MarketFormProps> = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [marketData, setMarketData] = useState({
    coordination: currentUser.role === 'ADMIN_PRINCIPAL' ? currentUser.coordination || '' : '',
    marketType: '',
    marketRef: '',
    marketDescription: '',
    budgetPrev: '',
    ligneBudgetaireUtilisee: [''],
    ptba: '',
    marketStatus: 'Non commencé', // Ajouter le statut par défaut
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMarketData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBudgetChange = (index: number, value: string) => {
    const newBudgetLines = [...marketData.ligneBudgetaireUtilisee];
    newBudgetLines[index] = value;
    setMarketData(prevData => ({
      ...prevData,
      ligneBudgetaireUtilisee: newBudgetLines,
    }));
  };

  const addBudgetLine = () => {
    setMarketData(prevData => ({
      ...prevData,
      ligneBudgetaireUtilisee: [...prevData.ligneBudgetaireUtilisee, ''],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation pour la ligne budgétaire utilisée
    const isValidBudgetLine = marketData.ligneBudgetaireUtilisee.every(line => /^\d{1,6}$/.test(line));
    if (!isValidBudgetLine) {
      setError('La ligne budgétaire utilisée doit contenir jusqu\'à 6 chiffres.');
      return;
    }

    onSubmit(marketData);
    onClose();
  };

  const formatBudget = (value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return value;
    return numericValue.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' });
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Nouveau Marché
                      </Dialog.Title>
                      <div className="mt-2">
                        <form onSubmit={handleSubmit}>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Coordination
                            </label>
                            <select
                              name="coordination"
                              value={marketData.coordination}
                              onChange={handleChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="">Sélectionnez une coordination</option>
                              {COORDINATION_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Type de Marché
                            </label>
                            <select
                              name="marketType"
                              value={marketData.marketType}
                              onChange={handleChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="">Sélectionnez un type</option>
                              {Object.entries(MARKET_TYPES).map(([key, value]) => (
                                <option key={key} value={key}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Réf. Marché
                            </label>
                            <input
                              type="text"
                              name="marketRef"
                              value={marketData.marketRef}
                              onChange={handleChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Description du Marché
                            </label>
                            <input
                              type="text"
                              name="marketDescription"
                              value={marketData.marketDescription}
                              onChange={handleChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Budget Prévisionnel
                            </label>
                            <input
                              type="text"
                              name="budgetPrev"
                              value={marketData.budgetPrev}
                              onChange={handleChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Ligne Budgétaire Utilisée
                            </label>
                            {marketData.ligneBudgetaireUtilisee.map((budget, index) => (
                              <input
                                key={index}
                                type="text"
                                name="ligneBudgetaireUtilisee"
                                value={budget}
                                onChange={e => handleBudgetChange(index, e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                              />
                            ))}
                            <button
                              type="button"
                              onClick={addBudgetLine}
                              className="mt-2 text-blue-500 underline"
                            >
                              Ajouter une autre ligne budgétaire
                            </button>
                            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              PTBA
                            </label>
                            <input
                              type="date"
                              name="ptba"
                              value={marketData.ptba}
                              onChange={handleChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              Ajouter
                            </button>
                            <button
                              type="button"
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                              onClick={onClose}
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MarketForm;
