import { useReportsContext } from '@/contexts/ReportsContext';
import { Report } from '@/models/report';
import { MonthlyProjection } from '@/models/projections';
import { useEffect } from 'react';

/**
 * Hook to access and manage reports
 */
export function useReports() {
  const context = useReportsContext();

  // Auto-load snapshots when accessing a report
  const getReportWithSnapshots = async (id: string): Promise<Report | null> => {
    const report = context.getReport(id);
    if (report) {
      await context.loadSnapshots(id);
    }
    return report;
  };

  return {
    // State
    reports: context.reports,
    isLoading: context.isLoading,

    // Methods
    loadReports: context.loadReports,
    getReport: context.getReport,
    getReportWithSnapshots,
    createReport: context.createReport,
    updateReport: context.updateReport,
    deleteReport: context.deleteReport,
    duplicateReport: context.duplicateReport,

    // Projections
    getProjections: context.getProjections,
    getGoalHit: context.getGoalHit,
  };
}

/**
 * Hook to get a specific report by ID
 */
export function useReport(reportId: string | null) {
  const { getReport, getProjections, getGoalHit, loadSnapshots, updateReport } = useReportsContext();

  useEffect(() => {
    if (reportId) {
      loadSnapshots(reportId);
    }
  }, [reportId, loadSnapshots]);

  if (!reportId) {
    return {
      report: null,
      projections: [],
      goalHit: { goalHitIndex: null, goalHitDate: null },
      updateReport: async () => {},
    };
  }

  const report = getReport(reportId);
  const projections = report ? getProjections(reportId) : [];
  const goalHit = report ? getGoalHit(reportId) : { goalHitIndex: null, goalHitDate: null };

  return {
    report,
    projections,
    goalHit,
    updateReport: (updates: Partial<Report>) => updateReport(reportId, updates),
  };
}

