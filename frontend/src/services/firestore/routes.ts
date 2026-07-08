import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { RouteData } from '@/types';

export const addRoute = async (data: Omit<RouteData, 'id'>) => {
  return await addDoc(collection(db, 'routes'), data);
};

export const updateRoute = async (id: string, data: Partial<RouteData>) => {
  const docRef = doc(db, 'routes', id);
  return await updateDoc(docRef, data);
};
