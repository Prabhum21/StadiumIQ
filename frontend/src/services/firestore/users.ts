import { db } from '@/lib/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { UserProfile } from '@/context/AuthContext';

export const updateUser = async (uid: string, data: Partial<UserProfile>) => {
  const docRef = doc(db, 'users', uid);
  return await updateDoc(docRef, data);
};
