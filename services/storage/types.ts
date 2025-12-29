import { Report } from '@/models/report';
import { Snapshot } from '@/models/snapshot';

/**
 * Estado persistido completo do aplicativo
 * Inclui versionamento para permitir migrações futuras
 */
export interface PersistedState {
  schemaVersion: number;
  reports: Report[];
  snapshots: Snapshot[];
}

/**
 * Versão atual do schema
 * Incrementar quando houver mudanças estruturais nos dados
 */
export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Chave única para armazenar o estado completo
 */
export const PERSISTED_STATE_KEY = '@clarus/state';

/**
 * Resultado de uma operação de importação
 */
export interface ImportResult {
  success: boolean;
  error?: string;
  reportsCount: number;
  snapshotsCount: number;
}

