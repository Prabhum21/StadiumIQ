import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Incident } from '@/types';

export const addIncident = async (data: Omit<Incident, 'id'>) => {
  return await addDoc(collection(db, 'incidents'), data);
};

export const updateIncident = async (id: string, data: Partial<Incident>) => {
  const docRef = doc(db, 'incidents', id);
  return await updateDoc(docRef, data);
};
