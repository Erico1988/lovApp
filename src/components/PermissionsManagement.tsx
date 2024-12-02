import React, { useState } from 'react';
import { Shield, Lock, Check, X, AlertTriangle } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  customPermissions?: string[];
}

const defaultPermissions: Permission[] = [
  { id: 'market_create', name: 'Créer un marché', description: 'Permet de créer de nouveaux marchés', module: 'Marchés' },
  { id: 'market_edit', name: 'Modifier un marché', description: 'Permet de modifier les marchés existants', module: 'Marchés' },
  { id: 'market_delete', name: 'Supprimer un marché', description: 'Permet de supprimer des marchés', module: 'Marchés' },
  { id: 'task_manage', name: 'Gérer les tâches', description: 'Permet de gérer toutes les tâches', module: 'Tâches' },
  { id: 'user_manage', name: 'Gérer les utilisateurs', description: 'Permet de gérer les utilisateurs', module: 'Utilisateurs' },
  { id: 'reports_view', name: 'Voir les rapports', description: 'Permet de consulter les rapports', module: 'Rapports' },
  { id: 'reports_export', name: 'Exporter les rapports', description: 'Permet d\'exporter les rapports', module: 'Rapports' },
];

const defaultRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: defaultPermissions.map(p => p.id),
  },
  {
    id: 'manager',
    name: 'Gestionnaire',
    description: 'Gestion des marchés et des tâches',
    permissions: ['market_create', 'market_edit', 'task_manage', 'reports_view'],
  },
  {
    id: 'user',
    name: 'Utilisateur',
    description: 'Accès en lecture seule',
    permissions: ['reports_view'],
  },
];

const PermissionsManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRole || !editMode) return;

    setRoles(prevRoles =>
      prevRoles.map(role =>
        role.id === selectedRole.id
          ? {
              ...role,
              permissions: role.permissions.includes(permissionId)
                ? role.permissions.filter(id => id !== permissionId)
                : [...role.permissions, permissionId],
            }
          : role
      )
    );
  };

  const handleSaveChanges = () => {
    setEditMode(false);
    // Ici, vous pourriez implémenter la logique pour sauvegarder les modifications
  };

  const groupedPermissions = defaultPermissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Permissions</h2>
        {selectedRole && (
          <div className="flex items-center gap-4">
            {editMode ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Modifier
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Rôles</h3>
            <div className="space-y-2">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    selectedRole?.id === role.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-gray-500">{role.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-8">
          {selectedRole ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">{selectedRole.name}</h3>
                  <p className="text-gray-600">{selectedRole.description}</p>
                </div>
                {selectedRole.id === 'admin' && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm">Les permissions de l'administrateur ne peuvent pas être modifiées</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([module, permissions]) => (
                  <div key={module}>
                    <h4 className="text-lg font-medium mb-4">{module}</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {permissions.map(permission => (
                        <div
                          key={permission.id}
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            editMode ? 'bg-gray-50' : 'bg-white'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-gray-500">
                              {permission.description}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedRole.permissions.includes(permission.id) ? (
                              <button
                                onClick={() => handlePermissionToggle(permission.id)}
                                disabled={!editMode || selectedRole.id === 'admin'}
                                className={`p-2 rounded-full ${
                                  editMode && selectedRole.id !== 'admin'
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                    : 'bg-green-100 text-green-600'
                                }`}
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePermissionToggle(permission.id)}
                                disabled={!editMode || selectedRole.id === 'admin'}
                                className={`p-2 rounded-full ${
                                  editMode && selectedRole.id !== 'admin'
                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Lock className="w-12 h-12 mx-auto mb-4" />
                <p>Sélectionnez un rôle pour voir et gérer ses permissions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionsManagement;