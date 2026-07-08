import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Volunteer } from '@/types';

export const addVolunteer = async (data: Omit<Volunteer, 'id'>) => {
  return await addDoc(collection(db, 'volunteers'), data);
};

export const updateVolunteer = async (id: string, data: Partial<Volunteer>) => {
  const docRef = doc(db, 'volunteers', id);
  return await updateDoc(docRef, data);
};
