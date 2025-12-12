import { MonthlyProjection } from '@/models/projections';
import { Report } from '@/models/report';
import { Snapshot } from '@/models/snapshot';
import { calculateHealthSummary, HealthSummary } from '@/services/calculations/health';
import { findGoalHit, generateProjections, getHighlightedMonthValues } from '@/services/calculations/projections';
import { localStorageService } from '@/services/storage/LocalStorageService';
import { getCurrentDateTime } from '@/utils/date';
import { generateId } from '@/utils/uuid';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ReportsContextValue {
  // Reports state
  reports: Report[];
  isLoading: boolean;
  
  // Reports methods
  loadReports: () => Promise<void>;
  getReport: (id: string) => Report | null;
  createReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Report>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  duplicateReport: (id: string) => Promise<Report>;
  
  // Projections
  getProjections: (reportId: string) => MonthlyProjection[];
  getGoalHit: (reportId: string) => { goalHitIndex: number | null; goalHitDate: string | null };
  getHealthSummary: (reportId: string) => HealthSummary | null;
  
  // Snapshots state
  getSnapshots: (reportId: string) => Snapshot[];
  loadSnapshots: (reportId: string) => Promise<void>;
  createSnapshot: (reportId: string, notes?: string) => Promise<Snapshot>;
  deleteSnapshot: (snapshotId: string) => Promise<void>;
}

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

interface ReportsProviderProps {
  children: ReactNode;
}

export function ReportsProvider({ children }: ReportsProviderProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [snapshots, setSnapshots] = useState<Map<string, Snapshot[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedReports = await localStorageService.getReports();
      setReports(loadedReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const getReport = useCallback(
    (id: string): Report | null => {
      return reports.find((r) => r.id === id) ?? null;
    },
    [reports]
  );

  const createReport = useCallback(
    async (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> => {
      const now = getCurrentDateTime();
      const newReport: Report = {
        ...reportData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };

      await localStorageService.saveReport(newReport);
      setReports((prev) => [...prev, newReport]);
      return newReport;
    },
    []
  );

  const updateReport = useCallback(
    async (id: string, updates: Partial<Report>): Promise<void> => {
      const existingReport = getReport(id);
      if (!existingReport) {
        throw new Error(`Report with id ${id} not found`);
      }

      const updatedReport: Report = {
        ...existingReport,
        ...updates,
        id,
        updatedAt: getCurrentDateTime(),
      };

      await localStorageService.saveReport(updatedReport);
      setReports((prev) => prev.map((r) => (r.id === id ? updatedReport : r)));
    },
    [getReport]
  );

  const deleteReport = useCallback(async (id: string): Promise<void> => {
    await localStorageService.deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    // Remove snapshots from state
    setSnapshots((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const duplicateReport = useCallback(
    async (id: string): Promise<Report> => {
      const existingReport = getReport(id);
      if (!existingReport) {
        throw new Error(`Report with id ${id} not found`);
      }

      const duplicatedReport: Report = {
        ...existingReport,
        id: generateId(),
        name: `${existingReport.name} (Cópia)`,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      };

      await localStorageService.saveReport(duplicatedReport);
      setReports((prev) => [...prev, duplicatedReport]);
      return duplicatedReport;
    },
    [getReport]
  );

  const getProjections = useCallback(
    (reportId: string): MonthlyProjection[] => {
      const report = getReport(reportId);
      if (!report) return [];
      return generateProjections(report);
    },
    [getReport]
  );

  const getGoalHit = useCallback(
    (reportId: string) => {
      const report = getReport(reportId);
      if (!report) return { goalHitIndex: null, goalHitDate: null };
      const projections = getProjections(reportId);
      return findGoalHit(projections, report.goalAmount);
    },
    [getReport, getProjections]
  );

  const getHealthSummary = useCallback(
    (reportId: string): HealthSummary | null => {
      const report = getReport(reportId);
      if (!report) return null;
      const projections = getProjections(reportId);
      return calculateHealthSummary(report, projections);
    },
    [getReport, getProjections]
  );

  const getSnapshots = useCallback(
    (reportId: string): Snapshot[] => {
      return snapshots.get(reportId) ?? [];
    },
    [snapshots]
  );

  const loadSnapshots = useCallback(async (reportId: string): Promise<void> => {
    try {
      const loadedSnapshots = await localStorageService.getSnapshotsByReport(reportId);
      setSnapshots((prev) => {
        const newMap = new Map(prev);
        newMap.set(reportId, loadedSnapshots);
        return newMap;
      });
    } catch (error) {
      console.error('Error loading snapshots:', error);
    }
  }, []);

  const createSnapshot = useCallback(
    async (reportId: string, notes?: string): Promise<Snapshot> => {
      const report = getReport(reportId);
      if (!report) {
        throw new Error(`Report with id ${reportId} not found`);
      }

      const projections = getProjections(reportId);
      const goalHit = findGoalHit(projections, report.goalAmount);
      const finalAmount = projections.length > 0 ? projections[projections.length - 1].finalAmount : 0;
      const highlightedMonthValues = getHighlightedMonthValues(projections, report.highlightMonths);

      const snapshot: Snapshot = {
        id: generateId(),
        reportId,
        createdAt: getCurrentDateTime(),
        initialAmountAtSnapshot: report.initialAmount,
        annualRateAtSnapshot: report.annualRate,
        goalAmountAtSnapshot: report.goalAmount,
        simulationYearsAtSnapshot: report.simulationYears,
        goalHitMonthIndex: goalHit.goalHitIndex,
        goalHitDate: goalHit.goalHitDate,
        finalAmountAtEnd: finalAmount,
        highlightedMonthValues,
        notes,
        projections, // Save full projections for comparison
      };

      await localStorageService.saveSnapshot(snapshot);
      
      // Update local state
      setSnapshots((prev) => {
        const newMap = new Map(prev);
        const currentSnapshots = newMap.get(reportId) ?? [];
        newMap.set(reportId, [snapshot, ...currentSnapshots]);
        return newMap;
      });

      return snapshot;
    },
    [getReport, getProjections]
  );

  const deleteSnapshot = useCallback(async (snapshotId: string): Promise<void> => {
    await localStorageService.deleteSnapshot(snapshotId);
    
    // Update local state
    setSnapshots((prev) => {
      const newMap = new Map(prev);
      for (const [reportId, snapshotsList] of newMap.entries()) {
        const filtered = snapshotsList.filter((s) => s.id !== snapshotId);
        if (filtered.length === 0) {
          newMap.delete(reportId);
        } else {
          newMap.set(reportId, filtered);
        }
      }
      return newMap;
    });
  }, []);

  const value: ReportsContextValue = useMemo(
    () => ({
      reports,
      isLoading,
      loadReports,
      getReport,
      createReport,
      updateReport,
      deleteReport,
      duplicateReport,
      getProjections,
      getGoalHit,
      getHealthSummary,
      getSnapshots,
      loadSnapshots,
      createSnapshot,
      deleteSnapshot,
    }),
    [
      reports,
      isLoading,
      loadReports,
      getReport,
      createReport,
      updateReport,
      deleteReport,
      duplicateReport,
      getProjections,
      getGoalHit,
      getHealthSummary,
      getSnapshots,
      loadSnapshots,
      createSnapshot,
      deleteSnapshot,
    ]
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReportsContext(): ReportsContextValue {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReportsContext must be used within a ReportsProvider');
  }
  return context;
}

