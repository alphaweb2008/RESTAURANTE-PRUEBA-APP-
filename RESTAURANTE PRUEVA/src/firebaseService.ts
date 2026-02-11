import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import type { MenuItem, Reservation, BusinessInfo } from './types';

// ============ BUSINESS INFO ============
export const saveBusinessInfo = async (info: BusinessInfo) => {
  await setDoc(doc(db, 'settings', 'businessInfo'), info);
};

export const listenBusinessInfo = (callback: (info: BusinessInfo) => void) => {
  return onSnapshot(doc(db, 'settings', 'businessInfo'), (snap) => {
    if (snap.exists()) {
      callback(snap.data() as BusinessInfo);
    }
  });
};

// ============ MENU ============
export const saveMenuItem = async (item: MenuItem) => {
  const { id, ...data } = item;
  if (id && id.length > 0) {
    await setDoc(doc(db, 'menu', id), data);
    return id;
  } else {
    const ref = await addDoc(collection(db, 'menu'), data);
    return ref.id;
  }
};

export const deleteMenuItem = async (id: string) => {
  await deleteDoc(doc(db, 'menu', id));
};

export const listenMenu = (callback: (items: MenuItem[]) => void) => {
  return onSnapshot(
    query(collection(db, 'menu'), orderBy('category')),
    (snap) => {
      const items: MenuItem[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as MenuItem[];
      callback(items);
    }
  );
};

// ============ RESERVATIONS ============
export const saveReservation = async (res: Omit<Reservation, 'id'>) => {
  const ref = await addDoc(collection(db, 'reservations'), res);
  return ref.id;
};

export const updateReservation = async (id: string, data: Partial<Reservation>) => {
  const { id: _id, ...rest } = data as any;
  await updateDoc(doc(db, 'reservations', id), rest);
};

export const deleteReservation = async (id: string) => {
  await deleteDoc(doc(db, 'reservations', id));
};

export const deleteAllReservations = async () => {
  const snap = await getDocs(collection(db, 'reservations'));
  const promises = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(promises);
};

export const listenReservations = (callback: (items: Reservation[]) => void) => {
  return onSnapshot(
    query(collection(db, 'reservations'), orderBy('date', 'desc')),
    (snap) => {
      const items: Reservation[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Reservation[];
      callback(items);
    }
  );
};

// ============ ADMIN PASSWORD ============
export const saveAdminPassword = async (password: string) => {
  await setDoc(doc(db, 'settings', 'admin'), { password });
};

export const listenAdminPassword = (callback: (password: string) => void) => {
  return onSnapshot(doc(db, 'settings', 'admin'), (snap) => {
    if (snap.exists()) {
      callback(snap.data().password);
    } else {
      callback('admin123');
    }
  });
};
