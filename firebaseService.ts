// src/services/firebaseService.ts
import { db, auth } from "./firebaseConfig";
import { 
  collection, addDoc, getDocs, doc, deleteDoc, query, where 
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
} from "firebase/auth";

/** 🔹 Function to register a new user */
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/** 🔹 Function to log in a user */
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/** 🔹 Function to log out a user */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

/** 🔹 Book an appointment */
export const bookAppointment = async (userId: string, therapistId: string, date: string, time: string) => {
  return addDoc(collection(db, "appointments"), {
    userId,
    therapistId,
    date,
    time,
    status: "booked",
  });
};

/** 🔹 Get user's appointments */
export const getUserAppointments = async (userId: string) => {
  const q = query(collection(db, "appointments"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/** 🔹 Cancel an appointment */
export const cancelAppointment = async (appointmentId: string) => {
  return deleteDoc(doc(db, "appointments", appointmentId));
};

/** 🔹 Get therapists (FIXED EXPORT) */
export const getTherapists = async (): Promise<{ therapistId: string; name: string }[]> => {
  const snapshot = await getDocs(collection(db, "therapists"));
  return snapshot.docs.map((doc) => ({
    therapistId: doc.id,
    ...(doc.data() as { name: string }),
  }));
};

/** 🔹 Get available slots for a therapist (FIXED TYPE) */
export const getAvailableSlots = async (therapistId: string): Promise<{ day: string; slots: string[] }[]> => {
  const q = query(collection(db, "therapists"), where("therapistId", "==", therapistId));
  const snapshot = await getDocs(q);
  return snapshot.docs[0]?.data().availability || [];
};
