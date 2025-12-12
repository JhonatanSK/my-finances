import { useReportsContext } from '@/contexts/ReportsContext';
import { Report } from '@/models/report';
import { useCallback, useEffect, useMemo } from 'react';

/**
 * Hook to access and manage reports
 */
export function useReports() {
  const {
    reports,
    isLoading,
    loadReports,
    getReport,
    loadSnapshots,
    createReport,
    updateReport,
    deleteReport,
    duplicateReport,
    getProjections,
    getGoalHit,
    getHealthSummary,
  } = useReportsContext();

  // Auto-load snapshots when accessing a report
  const getReportWithSnapshots = useCallback(
    async (id: string): Promise<Report | null> => {
      const report = getReport(id);
      if (report) {
        await loadSnapshots(id);
      }
      return report;
    },
    [getReport, loadSnapshots]
  );

  // Memoizar o retorno para evitar criar novo objeto a cada render
  return useMemo(
    () => ({
      // State
      reports,
      isLoading,

      // Methods
      loadReports,
      getReport,
      getReportWithSnapshots,
      createReport,
      updateReport,
      deleteReport,
      duplicateReport,

      // Projections
      getProjections,
      getGoalHit,
      getHealthSummary,
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
      getReportWithSnapshots,
    ]
  );
}

/**
 * Hook to get a specific report by ID
 */
export function useReport(reportId: string | null) {
  const { getReport, getProjections, getGoalHit, getHealthSummary, loadSnapshots, updateReport } = useReportsContext();

  useEffect(() => {
    if (reportId) {
      loadSnapshots(reportId);
    }
  }, [reportId, loadSnapshots]);

  return useMemo(() => {
    if (!reportId) {
      return {
        report: null,
        projections: [],
        goalHit: { goalHitIndex: null, goalHitDate: null },
        health: null,
        updateReport: async () => {},
      };
    }

    const report = getReport(reportId);
    const projections = report ? getProjections(reportId) : [];
    const goalHit = report ? getGoalHit(reportId) : { goalHitIndex: null, goalHitDate: null };
    const health = report ? getHealthSummary(reportId) : null;

    return {
      report,
      projections,
      goalHit,
      health,
      updateReport: (updates: Partial<Report>) => updateReport(reportId, updates),
    };
  }, [reportId, getReport, getProjections, getGoalHit, getHealthSummary, updateReport]);
}

