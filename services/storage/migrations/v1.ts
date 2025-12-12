import { CURRENT_SCHEMA_VERSION, PersistedState } from '../types';

/**
 * Migração para versão 1 (baseline)
 * Esta é a versão inicial do schema
 * 
 * Converte dados antigos (sem schemaVersion) para o novo formato
 * ou cria estado inicial vazio
 */
export function migrateToV1(data: any): PersistedState {
  // Se já é um PersistedState válido v1, retornar como está
  if (data && typeof data === 'object' && data.schemaVersion === 1) {
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      reports: Array.isArray(data.reports) ? data.reports : [],
      snapshots: Array.isArray(data.snapshots) ? data.snapshots : [],
    };
  }

  // Se tem dados antigos (sem schemaVersion), migrar
  if (data && typeof data === 'object') {
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      reports: Array.isArray(data.reports) ? data.reports : [],
      snapshots: Array.isArray(data.snapshots) ? data.snapshots : [],
    };
  }

  // Estado inicial vazio
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    reports: [],
    snapshots: [],
  };
}

/**
 * Valida se os dados são compatíveis com a versão 1
 */
export function validateV1(state: PersistedState): boolean {
  if (!state || typeof state !== 'object') return false;
  if (state.schemaVersion !== 1) return false;
  if (!Array.isArray(state.reports)) return false;
  if (!Array.isArray(state.snapshots)) return false;
  
  // Validação básica de estrutura dos reports
  for (const report of state.reports) {
    if (!report || typeof report !== 'object') return false;
    if (!report.id || typeof report.id !== 'string') return false;
    if (!report.name || typeof report.name !== 'string') return false;
  }
  
  // Validação básica de estrutura dos snapshots
  for (const snapshot of state.snapshots) {
    if (!snapshot || typeof snapshot !== 'object') return false;
    if (!snapshot.id || typeof snapshot.id !== 'string') return false;
    if (!snapshot.reportId || typeof snapshot.reportId !== 'string') return false;
  }
  
  return true;
}

