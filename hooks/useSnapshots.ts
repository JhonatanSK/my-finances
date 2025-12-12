import { useReportsContext } from '@/contexts/ReportsContext';
import { Snapshot } from '@/models/snapshot';
import React, { useCallback, useEffect, useMemo } from 'react';

/**
 * Hook to access and manage snapshots for a specific report
 */
export function useSnapshots(reportId: string | null) {
  const { getSnapshots, loadSnapshots, createSnapshot, deleteSnapshot } = useReportsContext();

  useEffect(() => {
    if (reportId) {
      loadSnapshots(reportId);
    }
  }, [reportId, loadSnapshots]);

  const memoizedCreateSnapshot = useCallback(
    (notes?: string) => {
      if (!reportId) {
        throw new Error('reportId is required to create a snapshot');
      }
      return createSnapshot(reportId, notes);
    },
    [reportId, createSnapshot]
  );

  const memoizedLoadSnapshots = useCallback(() => {
    if (!reportId) {
      throw new Error('reportId is required to load snapshots');
    }
    return loadSnapshots(reportId);
  }, [reportId, loadSnapshots]);

  const snapshots = useMemo(() => {
    return reportId ? getSnapshots(reportId) : [];
  }, [reportId, getSnapshots]);

  return useMemo(
    () => ({
      snapshots,
      createSnapshot: memoizedCreateSnapshot,
      deleteSnapshot,
      loadSnapshots: memoizedLoadSnapshots,
    }),
    [snapshots, memoizedCreateSnapshot, deleteSnapshot, memoizedLoadSnapshots]
  );
}

/**
 * Hook to get a specific snapshot by ID
 */
export function useSnapshot(snapshotId: string | null) {
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

