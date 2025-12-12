import React, { useEffect } from 'react';
import { useReportsContext } from '@/contexts/ReportsContext';
import { Snapshot } from '@/models/snapshot';

/**
 * Hook to access and manage snapshots for a specific report
 */
export function useSnapshots(reportId: string | null) {
  const context = useReportsContext();

  useEffect(() => {
    if (reportId) {
      context.loadSnapshots(reportId);
    }
  }, [reportId, context]);

  const snapshots = reportId ? context.getSnapshots(reportId) : [];

  return {
    snapshots,
    createSnapshot: (notes?: string) => {
      if (!reportId) {
        throw new Error('reportId is required to create a snapshot');
      }
      return context.createSnapshot(reportId, notes);
    },
    deleteSnapshot: context.deleteSnapshot,
    loadSnapshots: () => {
      if (!reportId) {
        throw new Error('reportId is required to load snapshots');
      }
      return context.loadSnapshots(reportId);
    },
  };
}

/**
 * Hook to get a specific snapshot by ID
 */
export function useSnapshot(snapshotId: string | null) {
  const { getSnapshots } = useReportsContext();
  const [snapshot, setSnapshot] = React.useState<Snapshot | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (!snapshotId) {
      setSnapshot(null);
      setIsLoading(false);
      return;
    }

    // Find snapshot across all reports
    const findSnapshot = async () => {
      setIsLoading(true);
      try {
        // We need to search through all reports' snapshots
        // For now, we'll use the storage service directly
        const { localStorageService } = await import('@/services/storage/LocalStorageService');
        const found = await localStorageService.getSnapshotById(snapshotId);
        setSnapshot(found);
      } catch (error) {
        console.error('Error loading snapshot:', error);
        setSnapshot(null);
      } finally {
        setIsLoading(false);
      }
    };

    findSnapshot();
  }, [snapshotId]);

  return {
    snapshot,
    isLoading,
  };
}

