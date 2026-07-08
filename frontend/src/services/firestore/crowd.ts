import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { CrowdData } from '@/types';

export const addCrowdData = async (data: Omit<CrowdData, 'id'>) => {
  return await addDoc(collection(db, 'crowd'), data);
};

export const updateCrowdData = async (id: string, data: Partial<CrowdData>) => {
  const docRef = doc(db, 'crowd', id);
  return await updateDoc(docRef, data);
};
