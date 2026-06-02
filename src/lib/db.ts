import { collection, doc, setDoc, getDocs, getDoc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Booking } from "../types";
import { AuthUser } from "./auth";

// --- Bookings ---

export async function createBooking(data: Omit<Booking, "id" | "status" | "createdAt">): Promise<string> {
  const id = Math.random().toString(36).substring(2, 9).toUpperCase();
  const booking: Booking = {
    ...data,
    id,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  
  await setDoc(doc(db, "bookings", id), booking);
  return id;
}

export async function getUserBookings(mobile: string): Promise<Booking[]> {
  const q = query(collection(db, "bookings"), where("mobile", "==", mobile));
  const snap = await getDocs(q);
  const bookings: Booking[] = [];
  snap.forEach(doc => bookings.push(doc.data() as Booking));
  // Sort descending by date locally
  return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const snap = await getDoc(doc(db, "bookings", id));
  if (snap.exists()) {
    return snap.data() as Booking;
  }
  return null;
}

export async function getAllBookings(): Promise<Booking[]> {
  const snap = await getDocs(collection(db, "bookings"));
  const bookings: Booking[] = [];
  snap.forEach(doc => bookings.push(doc.data() as Booking));
  return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateBookingStatus(id: string, status: Booking["status"]): Promise<void> {
  await updateDoc(doc(db, "bookings", id), { status });
}

export async function addBookingFeedback(id: string, rating: number, review: string): Promise<void> {
  await updateDoc(doc(db, "bookings", id), {
    rating,
    review,
    reviewSubmitted: true
  });
}

export async function getReviews(): Promise<Booking[]> {
  const q = query(collection(db, "bookings"), where("rating", "==", 5));
  const snap = await getDocs(q);
  const bookings: Booking[] = [];
  snap.forEach(doc => bookings.push(doc.data() as Booking));
  return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// --- Users ---

export async function syncUserToFirestore(user: AuthUser): Promise<void> {
  if (!user.uid) return;
  // Use UID as document ID
  await setDoc(doc(db, "users", user.uid), user, { merge: true });
}

export async function getAllUsersFromFirestore(): Promise<AuthUser[]> {
  const snap = await getDocs(collection(db, "users"));
  const users: AuthUser[] = [];
  snap.forEach(doc => users.push(doc.data() as AuthUser));
  return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
