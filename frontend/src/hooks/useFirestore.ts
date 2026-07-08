'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CrowdData, TransportData, FoodVendor, Incident, Volunteer, Venue, Alert } from '@/types';

export function useCollection<T>(collectionName: string, queryConstraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...queryConstraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]); // Simplification: queryConstraints are omitted from dependency array to avoid deep comparison issues

  return { data, loading, error };
}

export const useCrowd = () => useCollection<CrowdData>('crowd');
export const useTransport = () => useCollection<TransportData>('transport');
export const useFood = () => useCollection<FoodVendor>('food');
export const useIncidents = () => useCollection<Incident>('incidents');
export const useVolunteers = () => useCollection<Volunteer>('volunteers');
export const useVenue = () => useCollection<Venue>('venues');
export const useAlerts = () => useCollection<Alert>('alerts');
