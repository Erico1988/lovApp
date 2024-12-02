import React, { useState } from 'react';
import { Users, AlertTriangle, Calendar, Briefcase } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'HUMAIN' | 'MATERIEL';
  role?: string;
  availability: number;
  assignedTasks: number;
  coordination: string;
  skills?: string[];
  status: 'DISPONIBLE' | 'OCCUPÉ' | 'SURCHARGÉ';
}

const ResourceManagement = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      name: 'Marie Lambert',
      type: 'HUMAIN',
      role: 'Chef de projet',
      availability: 100,
      assignedTasks: 3,
      coordination: 'CIR_FIANARANTSOA',
      skills: ['Gestion de projet', 'Analyse financière'],
      status: 'OCCUPÉ'
    },
    {
      id: '2',
      name: 'Véhicule 4x4',
      type: 'MATERIEL',
      availability: 80,
      assignedTasks: 2,
      coordination: 'CIR_MANAKARA',
      status: 'DISPONIBLE'
    }
  ]);

  const [newResource, setNewResource] = useState<Partial<Resource>>({
    type: 'HUMAIN',
    status: 'DISPONIBLE'
  });

  const calculateStatus = (assigned: number, availability: number): Resource['status'] => {
    const ratio = (assigned / availability) * 100;
    if (ratio >= 90) return 'SURCHARGÉ';
    if (ratio >= 70) return 'OCCUPÉ';
    return 'DISPONIBLE';
  };

  const handleAddResource = () => {
    if (newResource.name && newResource.type && newResource.coordination) {
      const resourceToAdd: Resource = {
        id: Date.now().toString(),
        name: newResource.name,
        type: newResource.type as 'HUMAIN' | 'MATERIEL',
        role: newResource.role,
        availability: 100,
        assignedTasks: 0,
        coordination: newResource.coordination,
        skills: newResource.skills,
        status: 'DISPONIBLE'
      };

      setResources(prev => [...prev, resourceToAdd]);
      setNewResource({
        type: 'HUMAIN',
        status: 'DISPONIBLE'
      });
    }
  };

  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'SURCHARGÉ':
        return 'bg-red-100 text-red-800';
      case 'OCCUPÉ':
        return 'bg-yellow-100 text-yellow-800';
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Ressources</h2>
        <button
          onClick={() => document.getElementById('addResourceForm')?.classList.remove('hidden')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ajouter une ressource
        </button>
      </div>

      <div id="addResourceForm" className="hidden bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Nouvelle Ressource</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={newResource.name || ''}
              onChange={e => setNewResource(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={newResource.type}
              onChange={e => setNewResource(prev => ({ ...prev, type: e.target.value as 'HUMAIN' | 'MATERIEL' }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="HUMAIN">Humaine</option>
              <option value="MATERIEL">Matérielle</option>
            </select>
          </div>
          {newResource.type === 'HUMAIN' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle</label>
              <input
                type="text"
                value={newResource.role || ''}
                onChange={e => setNewResource(prev => ({ ...prev, role: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Coordination</label>
            <select
              value={newResource.coordination || ''}
              onChange={e => setNewResource(prev => ({ ...prev, coordination: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner une coordination</option>
              <option value="CIR_FIANARANTSOA">CIR Fianarantsoa</option>
              <option value="CIR_MANAKARA">CIR Manakara</option>
              <option value="CIR_FORT_DAUPHIN">CIR Fort-Dauphin</option>
              <option value="UCP">UCP</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => document.getElementById('addResourceForm')?.classList.add('hidden')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleAddResource}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <div key={resource.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {resource.type === 'HUMAIN' ? (
                  <Users className="w-8 h-8 text-blue-600" />
                ) : (
                  <Briefcase className="w-8 h-8 text-green-600" />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{resource.name}</h3>
                  <p className="text-gray-600">{resource.role || resource.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(resource.status)}`}>
                {resource.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tâches assignées</span>
                <span className="font-medium">{resource.assignedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Disponibilité</span>
                <span className="font-medium">{resource.availability}%</span>
              </div>
              {resource.type === 'HUMAIN' && resource.skills && (
                <div>
                  <span className="text-gray-600">Compétences</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resource.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {resource.status === 'SURCHARGÉ' && (
              <div className="mt-4 flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">Surcharge détectée</span>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Coordination</span>
                <span className="text-sm font-medium">{resource.coordination}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceManagement;