import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { FoodVendor } from "@/types";

export const addFoodVendor = async (data: Omit<FoodVendor, "id">) => {
  return await addDoc(collection(db, "food"), data);
};

export const updateFoodVendor = async (id: string, data: Partial<FoodVendor>) => {
  const docRef = doc(db, "food", id);
  return await updateDoc(docRef, data);
};
