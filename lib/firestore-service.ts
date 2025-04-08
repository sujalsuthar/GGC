import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import { glassProducts } from "./glass-data"

// Customer services
export async function getCustomers() {
  const customersRef = collection(db, "customers")
  const q = query(customersRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function getCustomerById(id: string) {
  const docRef = doc(db, "customers", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    }
  }

  return null
}

export async function addCustomer(customerData: any) {
  const customersRef = collection(db, "customers")
  const docRef = await addDoc(customersRef, {
    ...customerData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const newCustomer = await getCustomerById(docRef.id)
  return newCustomer
}

export async function updateCustomer(id: string, customerData: any) {
  const docRef = doc(db, "customers", id)
  await updateDoc(docRef, {
    ...customerData,
    updatedAt: serverTimestamp(),
  })

  return await getCustomerById(id)
}

export async function deleteCustomer(id: string) {
  const docRef = doc(db, "customers", id)
  await deleteDoc(docRef)
  return { success: true }
}

// Bill services
export async function getBills() {
  const billsRef = collection(db, "bills")
  const q = query(billsRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function getBillById(id: string) {
  const docRef = doc(db, "bills", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    }
  }

  return null
}

export async function addBill(billData: any) {
  const billsRef = collection(db, "bills")
  const docRef = await addDoc(billsRef, {
    ...billData,
    date: Timestamp.fromDate(new Date(billData.date)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  // Also add to daily sales
  const dailySalesRef = collection(db, "dailySales")
  await addDoc(dailySalesRef, {
    saleId: billData.invoiceNumber,
    date: Timestamp.fromDate(new Date(billData.date)),
    time: Timestamp.fromDate(new Date(billData.date)),
    customer: billData.customer?.name || "Walk-in Customer",
    amount: billData.total,
    items: billData.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
    createdAt: serverTimestamp(),
  })

  const newBill = await getBillById(docRef.id)
  return newBill
}

export async function deleteBill(id: string) {
  const docRef = doc(db, "bills", id)
  await deleteDoc(docRef)
  return { success: true }
}

// Quotation services
export async function getQuotations() {
  const quotationsRef = collection(db, "quotations")
  const q = query(quotationsRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function getQuotationById(id: string) {
  const docRef = doc(db, "quotations", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    }
  }

  return null
}

export async function addQuotation(quotationData: any) {
  const quotationsRef = collection(db, "quotations")
  const docRef = await addDoc(quotationsRef, {
    ...quotationData,
    date: Timestamp.fromDate(new Date(quotationData.date)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const newQuotation = await getQuotationById(docRef.id)
  return newQuotation
}

export async function deleteQuotation(id: string) {
  const docRef = doc(db, "quotations", id)
  await deleteDoc(docRef)
  return { success: true }
}

// Daily sales services
export async function getDailySales(date: Date) {
  const startDate = new Date(date)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(date)
  endDate.setHours(23, 59, 59, 999)

  const dailySalesRef = collection(db, "dailySales")
  const q = query(
    dailySalesRef,
    where("date", ">=", Timestamp.fromDate(startDate)),
    where("date", "<=", Timestamp.fromDate(endDate)),
    orderBy("date", "asc"),
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// Glass products services
export async function getGlassProducts() {
  const productsRef = collection(db, "glassProducts")
  const snapshot = await getDocs(productsRef)

  if (snapshot.empty) {
    // Seed the products if none exist
    await seedGlassProducts()
    return glassProducts.map((product) => ({
      id: product.id,
      ...product,
    }))
  }

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function seedGlassProducts() {
  const batch = db.batch()

  glassProducts.forEach((product) => {
    const docRef = doc(collection(db, "glassProducts"))
    batch.set(docRef, {
      ...product,
      createdAt: serverTimestamp(),
    })
  })

  await batch.commit()
}
