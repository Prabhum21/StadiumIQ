import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { TransportData } from "@/types";

export const addTransport = async (data: Omit<TransportData, "id">) => {
  return await addDoc(collection(db, "transport"), data);
};

export const updateTransport = async (id: string, data: Partial<TransportData>) => {
  const docRef = doc(db, "transport", id);
  return await updateDoc(docRef, data);
};
