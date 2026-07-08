import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Venue } from '@/types';

export const addVenue = async (data: Omit<Venue, 'id'>) => {
  return await addDoc(collection(db, 'venues'), data);
};

export const updateVenue = async (id: string, data: Partial<Venue>) => {
  const docRef = doc(db, 'venues', id);
  return await updateDoc(docRef, data);
};
