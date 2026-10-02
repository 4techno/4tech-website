"use client";

import { collection, doc, getDoc, runTransaction, serverTimestamp, setDoc, Timestamp, writeBatch } from "firebase/firestore";
import { deleteObject, getBlob, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { getFirebaseClient } from "@/lib/firebase";
import { portalCapabilities } from "./portal-config";
import { safeFileName, validateQuote, validateUpload, type MediaCategory, type PortalFile, type ProjectStatus, type QuoteInput } from "./portal-model";

function currentUser() {
  const client = getFirebaseClient(), user = client.auth.currentUser;
  if (!user || !user.emailVerified) throw new Error("Sign in with a verified account to continue.");
  return { ...client, user };
}
async function ownerClient() {
  const client = currentUser();
  const token = await client.user.getIdTokenResult();
  if (client.auth.currentUser?.uid !== client.user.uid) throw new Error("Your sign-in changed. Refresh before continuing.");
  if (token.claims.owner !== true) throw new Error("This action requires owner access.");
  return client;
}
export async function publishProjectUpdate(uid: string, requestId: string, status: ProjectStatus, message: string) {
  const { db } = await ownerClient();
  const text = message.trim();
  if (text.length < 3 || text.length > 4000) throw new Error("Add an update between 3 and 4,000 characters.");
  const batch = writeBatch(db), request = doc(db, "users", uid, "requests", requestId);
  batch.update(request, { status, updateMessage: text, updatedAt: serverTimestamp() });
  batch.set(doc(collection(request, "updates")), { status, message: text, createdAt: serverTimestamp() });
  batch.set(doc(collection(db, "users", uid, "notifications")), { title: "Project update", body: text.slice(0, 500), requestId, read: false, createdAt: serverTimestamp() });
  await batch.commit();
}
export async function sendQuotation(uid: string, requestId: string, input: QuoteInput) {
  const { db } = await ownerClient(), values = validateQuote(input);
  const batch = writeBatch(db);
  batch.set(doc(collection(db, "users", uid, "requests", requestId, "quotes")), {
    ...values, validUntil: Timestamp.fromMillis(values.validUntil), currency: "INR", status: "Sent", createdAt: serverTimestamp(), respondedAt: null,
  });
  batch.set(doc(collection(db, "users", uid, "notifications")), { title: "Your quotation is ready", body: values.title, requestId, read: false, createdAt: serverTimestamp() });
  await batch.commit();
}
export async function respondToQuotation(uid: string, requestId: string, quoteId: string, response: "Accepted" | "Declined") {
  const { db, user } = currentUser();
  if (user.uid !== uid) throw new Error("Your sign-in changed. Refresh before continuing.");
  const quote = doc(db, "users", uid, "requests", requestId, "quotes", quoteId);
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(quote);
    if (!snapshot.exists() || snapshot.data().status !== "Sent") throw new Error("This quotation has already been answered.");
    if (snapshot.data().validUntil.toMillis() <= Date.now()) throw new Error("This quotation has expired. Ask 4tech for an updated quotation.");
    transaction.update(quote, { status: response, respondedAt: serverTimestamp() });
  });
}
export async function saveNotificationPreferences(emailEnabled: boolean) {
  const { db, user } = currentUser();
  if (emailEnabled && !portalCapabilities.emailNotifications) throw new Error("Email notifications are not available yet.");
  await setDoc(doc(db, "users", user.uid, "preferences", "notifications"), { emailEnabled, updatedAt: serverTimestamp() });
}
export async function markNotificationRead(id: string) {
  const { db, user } = currentUser();
  await setDoc(doc(db, "users", user.uid, "notifications", id), { read: true }, { merge: true });
}
export async function uploadPortalFile(file: File, destination: { uid: string; requestId: string } | { category: MediaCategory }, onProgress: (progress: number) => void) {
  if (!portalCapabilities.uploads) throw new Error("File storage has not been enabled yet.");
  const ownerMedia = "category" in destination;
  const { db, auth, user } = ownerMedia ? await ownerClient() : currentUser();
  if (!ownerMedia && user.uid !== destination.uid && (await user.getIdTokenResult()).claims.owner !== true) throw new Error("This project belongs to another account.");
  validateUpload(file, ownerMedia);
  const id = crypto.randomUUID();
  const storagePath = ownerMedia ? `owner-media/${user.uid}/${destination.category}/${id}` : `request-files/${destination.uid}/${destination.requestId}/${id}`;
  const record = ownerMedia ? doc(db, "ownerMedia", user.uid, destination.category, id) : doc(db, "users", destination.uid, "requests", destination.requestId, "files", id);
  const objectRef = ref(getStorage(auth.app), storagePath);
  const task = uploadBytesResumable(objectRef, file, { contentType: file.type, cacheControl: "private, max-age=0, no-store", customMetadata: { uploadedBy: user.uid } });
  await new Promise<void>((resolve, reject) => task.on("state_changed", snapshot => onProgress(Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)), reject, () => resolve()));
  try {
    await setDoc(record, { name: safeFileName(file.name), storagePath, contentType: file.type, size: file.size, createdAt: serverTimestamp() });
  } catch (error) {
    try { await deleteObject(objectRef); } catch { /* Owner can remove an orphan object in the Storage console. */ }
    throw error;
  }
}
export async function getPrivateFileBlob(file: PortalFile): Promise<Blob> {
  if (!portalCapabilities.uploads) throw new Error("File storage is not available yet.");
  const { auth, user } = currentUser();
  // getBlob uses the signed-in Firebase identity. Do not expose tokenized public URLs.
  const blob = await getBlob(ref(getStorage(auth.app), file.storagePath), 10 * 1024 * 1024);
  if (auth.currentUser?.uid !== user.uid) throw new Error("Your sign-in changed. Open the file again after signing in.");
  return blob;
}
export async function removeOwnerPhoto(category: MediaCategory, file: PortalFile) {
  const { auth, db, user } = await ownerClient();
  const expected = `owner-media/${user.uid}/${category}/${file.id}`;
  if (file.storagePath !== expected) throw new Error("Photo location does not match this library.");
  const { deleteDoc } = await import("firebase/firestore");
  try { await deleteObject(ref(getStorage(auth.app), expected)); }
  catch (error) { if (!(error && typeof error === "object" && "code" in error && error.code === "storage/object-not-found")) throw error; }
  await deleteDoc(doc(db, "ownerMedia", user.uid, category, file.id));
}
export async function readCustomerProfile(uid: string) {
  const { db } = await ownerClient();
  const profile = await getDoc(doc(db, "users", uid));
  return profile.exists() ? profile.data() : null;
}
export function portalError(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = String(error.code);
    if (code.includes("permission-denied") || code.includes("unauthorized")) return "This action is not available for your account. The portal may still need its access rules enabled.";
    if (code.includes("failed-precondition")) return "This workspace needs a database configuration update. Contact 4tech.";
    if (code.includes("unauthenticated")) return "Please sign in again.";
    if (code.includes("unavailable") || code.includes("network")) return "Connection interrupted. Please reconnect and try again.";
  }
  return error instanceof Error && !error.message.startsWith("Firebase") ? error.message : "This action could not be completed. Please try again.";
}
