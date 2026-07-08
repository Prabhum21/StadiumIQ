import { useMemo } from 'react';
import { CrowdData, Incident, Volunteer } from '@/types';

export function useDashboardMetrics(
  crowdData: CrowdData[],
  incidentsData: Incident[],
  volunteersData: Volunteer[]
) {
  const totalAttendance = useMemo(
    () => crowdData.reduce((acc, curr) => acc + curr.peopleCount, 0),
    [crowdData]
  );

  const activeIncidents = useMemo(
    () => incidentsData.filter((i) => i.status !== 'Resolved').length,
    [incidentsData]
  );

  const avgQueueTime = useMemo(
    () =>
      crowdData.length > 0
        ? Math.round(crowdData.reduce((acc, curr) => acc + curr.queueTime, 0) / crowdData.length)
        : 0,
    [crowdData]
  );

  const availableVolunteers = useMemo(
    () => volunteersData.filter((v) => v.availability === 'Available').length,
    [volunteersData]
  );

  return {
    totalAttendance,
    activeIncidents,
    avgQueueTime,
    availableVolunteers,
  };
}
