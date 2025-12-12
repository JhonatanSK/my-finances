import { Report } from '@/models/report';
import { Snapshot } from '@/models/snapshot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMigrations, validateState } from './migrations';
import { StorageService } from './StorageService';
import { CURRENT_SCHEMA_VERSION, PERSISTED_STATE_KEY, PersistedState } from './types';

// Chaves antigas (para migração de dados existentes)
const REPORTS_KEY = '@my-finances/reports';
const SNAPSHOTS_KEY = '@my-finances/snapshots';

class LocalStorageServiceImpl implements StorageService {
  private cachedState: PersistedState | null = null;
  private isInitialized = false;

  /**
   * Inicializa o estado, carregando e migrando dados se necessário
   */
  private async initializeState(): Promise<PersistedState> {
    if (this.isInitialized && this.cachedState) {
      return this.cachedState;
    }

    try {
      // Tentar carregar estado versionado
      const stateData = await AsyncStorage.getItem(PERSISTED_STATE_KEY);
      
      let rawData: any = null;
      if (stateData) {
        try {
          rawData = JSON.parse(stateData);
        } catch (error) {
          console.error('Error parsing state data:', error);
          rawData = null;
        }
      }

      // Se não há estado versionado, tentar migrar dados antigos
      if (!rawData || !rawData.schemaVersion) {
        rawData = await this.migrateLegacyData();
      }

      // Aplicar migrações
      const migratedState = applyMigrations(rawData);

      // Validar estado migrado
      if (!validateState(migratedState)) {
        console.error('Migrated state validation failed, using empty state');
        this.cachedState = {
          schemaVersion: CURRENT_SCHEMA_VERSION,
          reports: [],
          snapshots: [],
        };
      } else {
        this.cachedState = migratedState;
      }

      // Salvar estado migrado
      await this.persistState(this.cachedState);

      // Limpar dados antigos após migração bem-sucedida
      if (rawData && (!rawData.schemaVersion || rawData.schemaVersion !== CURRENT_SCHEMA_VERSION)) {
        await this.clearLegacyData();
      }

      this.isInitialized = true;
      return this.cachedState;
    } catch (error) {
      console.error('Error initializing state:', error);
      // Retornar estado vazio em caso de erro
      this.cachedState = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        reports: [],
        snapshots: [],
      };
      this.isInitialized = true;
      return this.cachedState;
    }
  }

  /**
   * Migra dados do formato antigo (chaves separadas) para o novo formato
   */
  private async migrateLegacyData(): Promise<any> {
    try {
      const reportsData = await AsyncStorage.getItem(REPORTS_KEY);
      const snapshotsData = await AsyncStorage.getItem(SNAPSHOTS_KEY);

      const reports = reportsData ? JSON.parse(reportsData) : [];
      const snapshots = snapshotsData ? JSON.parse(snapshotsData) : [];

      if (reports.length > 0 || snapshots.length > 0) {
        console.log('Migrating legacy data to versioned format');
        return {
          reports: Array.isArray(reports) ? reports : [],
          snapshots: Array.isArray(snapshots) ? snapshots : [],
        };
      }
    } catch (error) {
      console.error('Error migrating legacy data:', error);
    }

    return null;
  }

  /**
   * Limpa dados antigos após migração bem-sucedida
   */
  private async clearLegacyData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REPORTS_KEY);
      await AsyncStorage.removeItem(SNAPSHOTS_KEY);
      console.log('Legacy data cleared');
    } catch (error) {
      console.error('Error clearing legacy data:', error);
    }
  }

  /**
   * Persiste o estado completo
   */
  private async persistState(state: PersistedState): Promise<void> {
    try {
      await AsyncStorage.setItem(PERSISTED_STATE_KEY, JSON.stringify(state));
      this.cachedState = state;
    } catch (error) {
      console.error('Error persisting state:', error);
      throw error;
    }
  }

  /**
   * Obtém o estado atual (inicializa se necessário)
   */
  private async getState(): Promise<PersistedState> {
    return this.initializeState();
  }

  // ==================== Reports ====================

  async getReports(): Promise<Report[]> {
    const state = await this.getState();
    return state.reports;
  }

  async getReportById(id: string): Promise<Report | null> {
    const state = await this.getState();
    return state.reports.find((r) => r.id === id) ?? null;
  }

  async saveReport(report: Report): Promise<void> {
    const state = await this.getState();
    const index = state.reports.findIndex((r) => r.id === report.id);

    if (index >= 0) {
      state.reports[index] = report;
    } else {
      state.reports.push(report);
    }

    await this.persistState(state);
  }

  async deleteReport(id: string): Promise<void> {
    const state = await this.getState();
    state.reports = state.reports.filter((r) => r.id !== id);
    
    // Also delete associated snapshots
    state.snapshots = state.snapshots.filter((s) => s.reportId !== id);

    await this.persistState(state);
  }

  // ==================== Snapshots ====================

  private async getAllSnapshots(): Promise<Snapshot[]> {
    const state = await this.getState();
    return state.snapshots;
  }

  async getSnapshotsByReport(reportId: string): Promise<Snapshot[]> {
    const snapshots = await this.getAllSnapshots();
    return snapshots
      .filter((s) => s.reportId === reportId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getSnapshotById(id: string): Promise<Snapshot | null> {
    const snapshots = await this.getAllSnapshots();
    return snapshots.find((s) => s.id === id) ?? null;
  }

  async saveSnapshot(snapshot: Snapshot): Promise<void> {
    const state = await this.getState();
    const index = state.snapshots.findIndex((s) => s.id === snapshot.id);

    if (index >= 0) {
      state.snapshots[index] = snapshot;
    } else {
      state.snapshots.push(snapshot);
    }

    await this.persistState(state);
  }

  async deleteSnapshot(id: string): Promise<void> {
    const state = await this.getState();
    state.snapshots = state.snapshots.filter((s) => s.id !== id);
    await this.persistState(state);
  }

  // ==================== Backup ====================

  async exportData(): Promise<string> {
    const state = await this.getState();
    
    // Exportar com schemaVersion para facilitar importação futura
    const exportData: PersistedState = {
      schemaVersion: state.schemaVersion,
      reports: state.reports,
      snapshots: state.snapshots,
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      // Validar JSON
      let parsedData: any;
      try {
        parsedData = JSON.parse(jsonData);
      } catch (error) {
        throw new Error('Invalid JSON format');
      }

      // Validar estrutura básica
      if (!parsedData || typeof parsedData !== 'object') {
        throw new Error('Invalid data structure');
      }

      // Se tem schemaVersion, aplicar migrações
      let importedState: PersistedState;
      if (parsedData.schemaVersion) {
        importedState = applyMigrations(parsedData);
      } else {
        // Dados antigos sem versionamento, migrar
        importedState = applyMigrations({
          reports: parsedData.reports || [],
          snapshots: parsedData.snapshots || [],
        });
      }

      // Validar estado importado
      if (!validateState(importedState)) {
        throw new Error('Imported data validation failed');
      }

      // Validar arrays
      if (!Array.isArray(importedState.reports)) {
        throw new Error('Reports must be an array');
      }
      if (!Array.isArray(importedState.snapshots)) {
        throw new Error('Snapshots must be an array');
      }

      // Validar estrutura básica dos reports
      for (const report of importedState.reports) {
        if (!report || typeof report !== 'object') {
          throw new Error('Invalid report structure');
        }
        if (!report.id || typeof report.id !== 'string') {
          throw new Error('Report must have a valid id');
        }
      }

      // Validar estrutura básica dos snapshots
      for (const snapshot of importedState.snapshots) {
        if (!snapshot || typeof snapshot !== 'object') {
          throw new Error('Invalid snapshot structure');
        }
        if (!snapshot.id || typeof snapshot.id !== 'string') {
          throw new Error('Snapshot must have a valid id');
        }
        if (!snapshot.reportId || typeof snapshot.reportId !== 'string') {
          throw new Error('Snapshot must have a valid reportId');
        }
      }

      // Persistir dados importados
      await this.persistState(importedState);
      
      // Invalidar cache para forçar recarregamento
      this.cachedState = importedState;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

// Singleton instance
export const localStorageService = new LocalStorageServiceImpl();
