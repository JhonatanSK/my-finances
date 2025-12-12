import { MonthlyProjection } from '@/models/projections';
import { Report } from '@/models/report';
import { Snapshot } from '@/models/snapshot';
import { findGoalHit, generateProjections, getHighlightedMonthValues } from '@/services/calculations/projections';
import { localStorageService } from '@/services/storage/LocalStorageService';
import { getCurrentDateTime } from '@/utils/date';
import { generateId } from '@/utils/uuid';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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

  // Load reports on mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const loadedReports = await localStorageService.getReports();
      setReports(loadedReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getReport = (id: string): Report | null => {
    return reports.find((r) => r.id === id) ?? null;
  };

  const createReport = async (
    reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Report> => {
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
  };

  const updateReport = async (id: string, updates: Partial<Report>): Promise<void> => {
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
  };

  const deleteReport = async (id: string): Promise<void> => {
    await localStorageService.deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    // Remove snapshots from state
    setSnapshots((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const duplicateReport = async (id: string): Promise<Report> => {
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
  };

  const getProjections = (reportId: string): MonthlyProjection[] => {
    const report = getReport(reportId);
    if (!report) return [];
    return generateProjections(report);
  };

  const getGoalHit = (reportId: string) => {
    const report = getReport(reportId);
    if (!report) return { goalHitIndex: null, goalHitDate: null };
    const projections = getProjections(reportId);
    return findGoalHit(projections, report.goalAmount);
  };

  const getSnapshots = (reportId: string): Snapshot[] => {
    return snapshots.get(reportId) ?? [];
  };

  const loadSnapshots = async (reportId: string): Promise<void> => {
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
  };

  const createSnapshot = async (reportId: string, notes?: string): Promise<Snapshot> => {
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
  };

  const deleteSnapshot = async (snapshotId: string): Promise<void> => {
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
  };

  const value: ReportsContextValue = {
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
    getSnapshots,
    loadSnapshots,
    createSnapshot,
    deleteSnapshot,
  };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReportsContext(): ReportsContextValue {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReportsContext must be used within a ReportsProvider');
  }
  return context;
}

