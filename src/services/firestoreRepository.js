import { collection, doc, getDoc, getDocs, addDoc, query, where, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ORDER_COLLECTION } from '@/lib/config';

export async function fetchProducts() {
  const querySnapshot = await getDocs(collection(db, 'Productos'));
  return querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function fetchProductById(productId) {
  const docRef = doc(db, 'Productos', productId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function fetchOrdersByUser(userId) {
  const ordersQuery = query(
    collection(db, ORDER_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function fetchOrderById(orderId) {
  const docRef = doc(db, ORDER_COLLECTION, orderId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function fetchOrderByReference(reference) {
  const referenceQuery = query(
    collection(db, ORDER_COLLECTION),
    where('reference', '==', reference)
  );
  const snapshot = await getDocs(referenceQuery);
  const docSnap = snapshot.docs[0];
  return docSnap ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function fetchOrders() {
  const ordersQuery = query(collection(db, ORDER_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function createOrder(orderData) {
  const ordersCollection = collection(db, ORDER_COLLECTION);
  const orderRef = await addDoc(ordersCollection, orderData);
  return { id: orderRef.id, ...orderData };
}

export async function updateOrder(orderId, updateData) {
  const orderRef = doc(db, ORDER_COLLECTION, orderId);
  await updateDoc(orderRef, updateData);
}
