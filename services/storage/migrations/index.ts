import { CURRENT_SCHEMA_VERSION, PersistedState } from '../types';
import { migrateToV1, validateV1 } from './v1';

/**
 * Tipo para função de migração
 */
type MigrationFunction = (state: any) => PersistedState;

/**
 * Registro de todas as migrações disponíveis
 * Cada chave é a versão de destino
 */
const migrations: Record<number, MigrationFunction> = {
  1: migrateToV1,
  // Futuras migrações:
  // 2: migrateToV2,
  // 3: migrateToV3,
};

/**
 * Aplica todas as migrações necessárias para atualizar o estado
 * para a versão atual do schema
 */
export function applyMigrations(data: any): PersistedState {
  // Se não há dados, retornar estado inicial
  if (!data) {
    return migrateToV1(null);
  }

  // Detectar versão atual dos dados
  let currentVersion = 0;
  if (data && typeof data === 'object' && typeof data.schemaVersion === 'number') {
    currentVersion = data.schemaVersion;
  }

  // Se já está na versão atual, validar e retornar
  if (currentVersion === CURRENT_SCHEMA_VERSION) {
    const migrated = migrateToV1(data);
    if (validateV1(migrated)) {
      return migrated;
    }
    // Se validação falhou, tentar migrar novamente
    console.warn('State validation failed, attempting migration');
  }

  // Aplicar migrações sequencialmente
  let state: any = data;
  
  // Se não tem versão, começar da v1
  if (currentVersion === 0) {
    state = migrateToV1(data);
    currentVersion = 1;
  }

  // Aplicar migrações incrementais até a versão atual
  while (currentVersion < CURRENT_SCHEMA_VERSION) {
    const nextVersion = currentVersion + 1;
    const migration = migrations[nextVersion];
    
    if (!migration) {
      console.error(`No migration found for version ${nextVersion}`);
      break;
    }
    
    state = migration(state);
    currentVersion = nextVersion;
    
    console.log(`Migrated from version ${currentVersion - 1} to ${currentVersion}`);
  }

  // Validar estado final
  if (currentVersion === CURRENT_SCHEMA_VERSION && validateV1(state)) {
    return state;
  }

  // Se chegou aqui, algo deu errado
  console.error('Migration failed, returning empty state');
  return migrateToV1(null);
}

/**
 * Valida se o estado está na versão atual e é válido
 */
export function validateState(state: PersistedState): boolean {
  if (state.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    return false;
  }
  
  return validateV1(state);
}

