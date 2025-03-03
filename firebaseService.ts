//   Import necessary Firebase modules and configurations
import { db, auth } from "./firebaseConfig"; // Import Firestore database and Firebase authentication instances
import { 
  collection, addDoc, getDocs, doc, setDoc, deleteDoc, query, where 
} from "firebase/firestore"; // Firestore functions for database operations
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential 
} from "firebase/auth"; // Authentication functions

/** 
 *   Validate email format before registering the user
 * @param {string} email - Email to validate
 * @returns {boolean} - Returns true if email is valid
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/** 
 *   Register a new user in Firebase Authentication
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Returns the newly created user object if successful
 */
export const registerUser = async (email: string, password: string) => {
  try {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }
    
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Ensure only the user object is returned
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/** 
 *  Authenticate a user by logging them in 
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Returns the authenticated user object
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password); // Logs user in
    return userCredential.user; // Returns user data
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/** 
 *   Logs out the currently authenticated user
 * @returns {Promise<void>} - Resolves when the user is logged out
 */
export const logoutUser = async () => {
  try {
    await signOut(auth); // Firebase sign-out function
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

/** 
 *   Books an appointment for a user with a therapist
 * @param {string} userId - ID of the user making the appointment
 * @param {string} therapistId - ID of the therapist
 * @param {string} date - Appointment date (format: YYYY-MM-DD)
 * @param {string} time - Appointment time (e.g., "10:00 AM")
 * @returns {Promise<void>} - Resolves when the appointment is successfully created in Firestore
 */
export const bookAppointment = async (userId: string, therapistId: string, date: string, time: string) => {
  return addDoc(collection(db, "appointments"), {
    userId,
    therapistId,
    date,
    time,
    status: "booked", // Initial status of the appointment
  });
};

/** 
 *   Retrieves all appointments booked by a specific user
 * @param {string} userId - ID of the user whose appointments are being fetched
 * @returns {Promise<Array>} - Returns an array of appointment objects
 */
export const getUserAppointments = async (userId: string) => {
  const q = query(collection(db, "appointments"), where("userId", "==", userId)); // Query to get user's appointments
  const snapshot = await getDocs(q); // Fetch documents from Firestore
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Convert Firestore docs to an array of objects
};

/** 
 *   Cancels an appointment by deleting it from Firestore
 * @param {string} appointmentId - ID of the appointment to be canceled
 * @returns {Promise<void>} - Resolves when the appointment is deleted
 */
export const cancelAppointment = async (appointmentId: string) => {
  return deleteDoc(doc(db, "appointments", appointmentId)); // Deletes the document from Firestore
};

/** 
 *   Fetches all therapists from the Firestore database
 * @returns {Promise<Array<{therapistId: string; name: string}>>} - Array of therapist objects
 */
export const getTherapists = async (): Promise<{ therapistId: string; name: string }[]> => {
  const snapshot = await getDocs(collection(db, "therapists")); // Fetch all therapist records
  return snapshot.docs.map((doc) => ({
    therapistId: doc.id, // Assign Firestore document ID as therapist ID
    ...(doc.data() as { name: string }), // Spread document data (ensuring correct type)
  }));
};

/** 
 *   Retrieves available slots for a given therapist
 * @param {string} therapistId - ID of the therapist
 * @returns {Promise<Array<{day: string; slots: string[]}>>} - Array of available slots grouped by day
 */
export const getAvailableSlots = async (therapistId: string): Promise<{ day: string; slots: string[] }[]> => {
  const q = query(collection(db, "therapists"), where("therapistId", "==", therapistId)); // Query therapist availability
  const snapshot = await getDocs(q); // Fetch data from Firestore
  return snapshot.docs[0]?.data().availability || []; // Return availability data or empty array if none found
};

/** 
 *   Adds a therapist to Firestore
 * @param {string} therapistId - Therapist ID
 * @param {Object} data - Therapist details
 * @returns {Promise<void>}
 */
export const addTherapistToFirestore = async (therapistId: string, data: any) => {
  const therapistRef = doc(collection(db, "therapists"), therapistId);
  await setDoc(therapistRef, data);
};
