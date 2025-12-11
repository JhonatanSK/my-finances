import AsyncStorage from '@react-native-async-storage/async-storage';
import { Report } from '@/models/report';
import { Snapshot } from '@/models/snapshot';
import { StorageService } from './StorageService';

const REPORTS_KEY = '@my-finances/reports';
const SNAPSHOTS_KEY = '@my-finances/snapshots';

class LocalStorageServiceImpl implements StorageService {
  // ==================== Reports ====================

  async getReports(): Promise<Report[]> {
    try {
      const data = await AsyncStorage.getItem(REPORTS_KEY);
      if (!data) return [];
      return JSON.parse(data) as Report[];
    } catch (error) {
      console.error('Error loading reports:', error);
      return [];
    }
  }

  async getReportById(id: string): Promise<Report | null> {
    const reports = await this.getReports();
    return reports.find((r) => r.id === id) ?? null;
  }

  async saveReport(report: Report): Promise<void> {
    try {
      const reports = await this.getReports();
      const index = reports.findIndex((r) => r.id === report.id);

      if (index >= 0) {
        reports[index] = report;
      } else {
        reports.push(report);
      }

      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  }

  async deleteReport(id: string): Promise<void> {
    try {
      const reports = await this.getReports();
      const filtered = reports.filter((r) => r.id !== id);
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(filtered));

      // Also delete associated snapshots
      const snapshots = await this.getAllSnapshots();
      const filteredSnapshots = snapshots.filter((s) => s.reportId !== id);
      await AsyncStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(filteredSnapshots));
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  // ==================== Snapshots ====================

  private async getAllSnapshots(): Promise<Snapshot[]> {
    try {
      const data = await AsyncStorage.getItem(SNAPSHOTS_KEY);
      if (!data) return [];
      return JSON.parse(data) as Snapshot[];
    } catch (error) {
      console.error('Error loading snapshots:', error);
      return [];
    }
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
    try {
      const snapshots = await this.getAllSnapshots();
      const index = snapshots.findIndex((s) => s.id === snapshot.id);

      if (index >= 0) {
        snapshots[index] = snapshot;
      } else {
        snapshots.push(snapshot);
      }

      await AsyncStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots));
    } catch (error) {
      console.error('Error saving snapshot:', error);
      throw error;
    }
  }

  async deleteSnapshot(id: string): Promise<void> {
    try {
      const snapshots = await this.getAllSnapshots();
      const filtered = snapshots.filter((s) => s.id !== id);
      await AsyncStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting snapshot:', error);
      throw error;
    }
  }

  // ==================== Backup ====================

  async exportData(): Promise<string> {
    const reports = await this.getReports();
    const snapshots = await this.getAllSnapshots();
    return JSON.stringify({ reports, snapshots }, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      if (data.reports) {
        await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(data.reports));
      }
      if (data.snapshots) {
        await AsyncStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(data.snapshots));
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

// Singleton instance
export const localStorageService = new LocalStorageServiceImpl();
