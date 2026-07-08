import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { Alert } from "@/types";

export const addAlert = async (data: Omit<Alert, "id">) => {
  return await addDoc(collection(db, "alerts"), data);
};

export const updateAlert = async (id: string, data: Partial<Alert>) => {
  const docRef = doc(db, "alerts", id);
  return await updateDoc(docRef, data);
};
