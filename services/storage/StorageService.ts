import { Report } from '@/models/report';
import { Snapshot } from '@/models/snapshot';

export interface StorageService {
  // Reports
  getReports(): Promise<Report[]>;
  getReportById(id: string): Promise<Report | null>;
  saveReport(report: Report): Promise<void>;
  deleteReport(id: string): Promise<void>;

  // Snapshots
  getSnapshotsByReport(reportId: string): Promise<Snapshot[]>;
  getSnapshotById(id: string): Promise<Snapshot | null>;
  saveSnapshot(snapshot: Snapshot): Promise<void>;
  deleteSnapshot(id: string): Promise<void>;

  // Backup
  exportData(): Promise<string>;
  importData(jsonData: string): Promise<void>;
}
