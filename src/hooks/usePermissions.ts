// src/hooks/usePermissions.ts

import { User } from '../types/types';

export const usePermissions = (currentUser: User) => {
  const isAdmin = currentUser.role === 'ADMIN_PRINCIPAL' || currentUser.role === 'ADMIN_SECONDAIRE';
  const canManageMarket = (coordination: string) =>
    currentUser.role === 'ADMIN_PRINCIPAL' ||
    (currentUser.role === 'ADMIN_SECONDAIRE' && currentUser.permissions.includes(coordination));

  return { isAdmin, canManageMarket };
};
