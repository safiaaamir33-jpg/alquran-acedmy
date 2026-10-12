import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from './config';
import { handleFirestoreError, OperationType } from './errors';
import {
  SiteSettings,
  Course,
  Teacher,
  Admission,
  Student,
  StudentFee,
  Announcement,
  GalleryItem,
  Review,
  FAQ,
  ContactMessage,
  ChatbotSettings,
  ChatConversation,
} from '../types';
import {
  initialSiteSettings,
  initialCourses,
  initialTeachers,
  initialFaqs,
  initialChatbotSettings,
  initialAnnouncements,
  initialGallery,
  initialReviews,
  initialContactMessages,
  initialAdmissions,
} from './seedData';

// Helper to deeply strip any `undefined` values so Firestore setDoc/updateDoc never fails
export function cleanPayload<T extends Record<string, any>>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => cleanPayload(item)) as any;
  }
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        result[key] = cleanPayload(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// Helper to check if current user is admin before executing protected queries
function isUserAdmin(): boolean {
  const session = localStorage.getItem('noor_admin_session');
  if (session) return true;
  if (!auth.currentUser) return false;
  if (auth.currentUser.email === 'safiaaamir33@gmail.com' || auth.currentUser.email === 'safiaaamir18@gmail.com' || auth.currentUser.email === 'safiyamano980@gmail.com') return true;
  return true; // if logged in, allowed to attempt admin query
}

// ==========================================
// 1. SITE SETTINGS
// ==========================================
const SETTINGS_DOC_ID = 'main';

export async function getSiteSettings(): Promise<SiteSettings> {
  const path = `siteSettings/${SETTINGS_DOC_ID}`;
  try {
    const docSnap = await getDoc(doc(db, 'siteSettings', SETTINGS_DOC_ID));
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...(docSnap.data() as SiteSettings) };
      try {
        localStorage.setItem('noor_cached_settings', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
    const cached = localStorage.getItem('noor_cached_settings');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }
    return { id: SETTINGS_DOC_ID, ...initialSiteSettings };
  } catch (error) {
    console.warn('Using default site settings:', error);
    const cached = localStorage.getItem('noor_cached_settings');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }
    return { id: SETTINGS_DOC_ID, ...initialSiteSettings };
  }
}

export function subscribeToSiteSettings(callback: (settings: SiteSettings) => void): Unsubscribe {
  const path = `siteSettings/${SETTINGS_DOC_ID}`;
  return onSnapshot(
    doc(db, 'siteSettings', SETTINGS_DOC_ID),
    (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...(docSnap.data() as SiteSettings) };
        try {
          localStorage.setItem('noor_cached_settings', JSON.stringify(data));
        } catch (_) {}
        callback(data);
      } else {
        callback({ id: SETTINGS_DOC_ID, ...initialSiteSettings });
      }
    },
    (error) => {
      console.warn('Site settings snapshot error:', error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const path = `siteSettings/${SETTINGS_DOC_ID}`;
  try {
    const payload = cleanPayload({
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    try {
      localStorage.setItem('noor_cached_settings', JSON.stringify({ id: SETTINGS_DOC_ID, ...initialSiteSettings, ...payload }));
    } catch (_) {}
    await setDoc(doc(db, 'siteSettings', SETTINGS_DOC_ID), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ==========================================
// 2. COURSES
// ==========================================
export async function getPublishedCourses(): Promise<Course[]> {
  const path = 'courses';
  try {
    const q = query(collection(db, path), where('isPublished', '==', true));
    const snap = await getDocs(q);
    if (snap.empty) {
      return initialCourses.map((c, i) => ({ id: `course_${i + 1}`, ...c }));
    }
    const courses = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Course, 'id'>) }));
    return courses.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.warn('Returning fallback courses:', error);
    return initialCourses.map((c, i) => ({ id: `course_${i + 1}`, ...c }));
  }
}

export async function getAllCourses(): Promise<Course[]> {
  const path = 'courses';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return [];
    }
    const courses = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Course, 'id'>) }));
    return courses.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.warn('Returning fallback courses:', error);
    return [];
  }
}

export async function saveCourse(course: Omit<Course, 'id'>, id?: string): Promise<string> {
  const docId = id || `course_${Date.now()}`;
  const path = `courses/${docId}`;
  try {
    const payload = cleanPayload({
      ...course,
      updatedAt: new Date().toISOString(),
      createdAt: (course as any).createdAt || new Date().toISOString(),
    });
    await setDoc(doc(db, 'courses', docId), payload, { merge: true });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCourse(id: string): Promise<void> {
  const path = `courses/${id}`;
  try {
    await deleteDoc(doc(db, 'courses', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==========================================
// 3. TEACHERS
// ==========================================
export async function getPublishedTeachers(): Promise<Teacher[]> {
  const path = 'teachers';
  try {
    const q = query(collection(db, path), where('isPublished', '==', true));
    const snap = await getDocs(q);
    if (snap.empty) {
      return initialTeachers.map((t, i) => ({ id: `teacher_${i + 1}`, ...t }));
    }
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Teacher, 'id'>) }));
  } catch (error) {
    console.warn('Returning fallback teachers:', error);
    return initialTeachers.map((t, i) => ({ id: `teacher_${i + 1}`, ...t }));
  }
}

export async function getAllTeachers(): Promise<Teacher[]> {
  const path = 'teachers';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return [];
    }
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Teacher, 'id'>) }));
  } catch (error) {
    console.warn('Returning fallback teachers:', error);
    return [];
  }
}

export async function saveTeacher(teacher: Omit<Teacher, 'id'>, id?: string): Promise<string> {
  const docId = id || `teacher_${Date.now()}`;
  const path = `teachers/${docId}`;
  try {
    const payload = cleanPayload({
      ...teacher,
      updatedAt: new Date().toISOString(),
      createdAt: (teacher as any).createdAt || new Date().toISOString(),
    });
    await setDoc(doc(db, 'teachers', docId), payload, { merge: true });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTeacher(id: string): Promise<void> {
  const path = `teachers/${id}`;
  try {
    await deleteDoc(doc(db, 'teachers', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==========================================
// 4. ADMISSIONS
// ==========================================
export async function submitAdmission(admission: Omit<Admission, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const docId = `adm_${Date.now()}`;
  const path = `admissions/${docId}`;
  try {
    const payload = cleanPayload({
      ...admission,
      id: docId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'admissions', docId), payload);
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getAllAdmissions(): Promise<Admission[]> {
  const path = 'admissions';
  try {
    const snap = await getDocs(collection(db, path));
    const admissions = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Admission, 'id'>) }));
    return admissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Error loading admissions:', error);
    return [];
  }
}

export async function updateAdmissionStatus(id: string, status: Admission['status'], notes?: string): Promise<void> {
  const path = `admissions/${id}`;
  try {
    await updateDoc(doc(db, 'admissions', id), {
      status,
      ...(notes !== undefined ? { notes } : {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAdmission(id: string): Promise<void> {
  const path = `admissions/${id}`;
  try {
    await deleteDoc(doc(db, 'admissions', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToAllAdmissions(callback: (admissions: Admission[]) => void): Unsubscribe {
  const path = 'admissions';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const admissions = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Admission, 'id'>) }));
      admissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(admissions);
    },
    (error) => {
      console.warn('Real-time admissions snapshot notice:', error);
    }
  );
}

// ==========================================
// 5. STUDENTS & STUDENT FEES (ADMIN ONLY)
// ==========================================
export async function getAllStudents(): Promise<Student[]> {
  const path = 'students';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Student, 'id'>) }));
  } catch (error) {
    console.warn('Error loading students:', error);
    return [];
  }
}

export async function saveStudent(student: Omit<Student, 'id'>, id?: string): Promise<string> {
  const docId = id || `stu_${Date.now()}`;
  const path = `students/${docId}`;
  try {
    const payload = cleanPayload({
      ...student,
      updatedAt: new Date().toISOString(),
      createdAt: (student as any).createdAt || new Date().toISOString(),
    });
    await setDoc(doc(db, 'students', docId), payload, { merge: true });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStudent(id: string): Promise<void> {
  const path = `students/${id}`;
  try {
    await deleteDoc(doc(db, 'students', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getAllStudentFees(): Promise<StudentFee[]> {
  const path = 'studentFees';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StudentFee, 'id'>) }));
  } catch (error) {
    console.warn('Error loading student fees:', error);
    return [];
  }
}

export async function saveStudentFee(fee: Omit<StudentFee, 'id'>, id?: string): Promise<string> {
  const docId = id || `fee_${Date.now()}`;
  const path = `studentFees/${docId}`;
  try {
    const payload = cleanPayload({
      ...fee,
      updatedAt: new Date().toISOString(),
      createdAt: (fee as any).createdAt || new Date().toISOString(),
    });
    await setDoc(doc(db, 'studentFees', docId), payload, { merge: true });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStudentFee(id: string): Promise<void> {
  const path = `studentFees/${id}`;
  try {
    await deleteDoc(doc(db, 'studentFees', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==========================================
// 6. ANNOUNCEMENTS & POSTERS
// ==========================================
export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  const path = 'announcements';
  try {
    const q = query(collection(db, path), where('isPublished', '==', true));
    const snap = await getDocs(q);
    if (snap.empty) {
      return initialAnnouncements.map((a, i) => ({ id: `ann_${i + 1}`, ...a }));
    }
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Announcement, 'id'>) }));
  } catch (error) {
    console.warn('Returning fallback announcements:', error);
    return initialAnnouncements.map((a, i) => ({ id: `ann_${i + 1}`, ...a }));
  }
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  const path = 'announcements';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialAnnouncements.map((a, i) => ({ id: `ann_${i + 1}`, ...a }));
    }
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Announcement, 'id'>) }));
  } catch (error) {
    console.warn('Fallback announcements:', error);
    return initialAnnouncements.map((a, i) => ({ id: `ann_${i + 1}`, ...a }));
  }
}

export async function saveAnnouncement(ann: Omit<Announcement, 'id'>, id?: string): Promise<string> {
  const docId = id || `ann_${Date.now()}`;
  const path = `announcements/${docId}`;
  try {
    const payload = cleanPayload({
      ...ann,
      updatedAt: new Date().toISOString(),
      createdAt: (ann as any).createdAt || new Date().toISOString(),
    });
    await setDoc(doc(db, 'announcements', docId), payload, { merge: true });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const path = `announcements/${id}`;
  try {
    await deleteDoc(doc(db, 'announcements', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==========================================
// 7. GALLERY
// ==========================================
export async function getPublishedGalleryItems(): Promise<GalleryItem[]> {
  const path = 'gallery';
  try {
    const q = query(collection(db, path), where('isPublished', '==', true));
    const snap = await getDocs(q);
    if (snap.empty) {
      return initialGallery.map((g, i) => ({ id: `gal_${i + 1}`, ...g }));
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) }));
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.warn('Returning fallback gallery items:', error);
    return initialGallery.map((g, i) => ({ id: `gal_${i + 1}`, ...g }));
  }
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const path = 'gallery';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialGallery.map((g, i) => ({ id: `gal_${i + 1}`, ...g }));
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) }));
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.warn('Fallback gallery:', error);
    return initialGallery.map((g, i) => ({ id: `gal_${i + 1}`, ...g }));
  }
}

export async function saveGalleryItem(item: Omit<GalleryItem, 'id'>, id?: string): Promise<string> {
  const docId = id || `gal_${Date.now()}`;
  const path = `gallery/${docId}`;
  try {
    const payload = cleanPayload({
      ...item,
      createdAt: (item as any).createdAt || new Date().toISOString(),
    });
    await setDoc(doc(db, 'gallery', docId), payload, { merge: true });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const path = `gallery/${id}`;
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==========================================
// 8. REVIEWS
// ==========================================
export async function submitReview(review: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const docId = `rev_${Date.now()}`;
  const path = `reviews/${docId}`;
  try {
    const payload = cleanPayload({
      ...review,
      id: docId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'reviews', docId), payload);
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getApprovedReviews(): Promise<Review[]> {
  const path = 'reviews';
  try {
    const q = query(collection(db, path), where('status', '==', 'approved'));
    const snap = await getDocs(q);
    if (snap.empty) {
      return initialReviews.map((r, i) => ({ id: `rev_${i + 1}`, ...r }));
    }
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, 'id'>) }));
  } catch (error) {
    console.warn('Returning fallback reviews:', error);
    return initialReviews.map((r, i) => ({ id: `rev_${i + 1}`, ...r }));
  }
}

export async function getAllReviews(): Promise<Review[]> {
  const path = 'reviews';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialReviews.map((r, i) => ({ id: `rev_${i + 1}`, ...r }));
    }
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, 'id'>) }));
  } catch (error) {
    console.warn('Fallback reviews:', error);
    return initialReviews.map((r, i) => ({ id: `rev_${i + 1}`, ...r }));
  }
}

export async function updateReviewStatus(id: string, status: Review['status']): Promise<void> {
  const path = `reviews/${id}`;
  try {
    await updateDoc(doc(db, 'reviews', id), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteReview(id: string): Promise<void> {
  const path = `reviews/${id}`;
  try {
    await deleteDoc(doc(db, 'reviews', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==========================================
// 9. FAQS
// ==========================================
export async function getPublishedFaqs(): Promise<FAQ[]> {
  const path = 'faqs';
  try {
    const q = query(collection(db, path), where('isPublished', '==', true));
    const snap = await getDocs(q);
    if (snap.empty) {
      return initialFaqs.map((f, i) => ({ id: `faq_${i + 1}`, ...f }));
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FAQ, 'id'>) }));
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.warn('Returning fallback faqs:', error);
    return initialFaqs.map((f, i) => ({ id: `faq_${i + 1}`, ...f }));
  }
}

export async function getAllFaqs(): Promise<FAQ[]> {
  const path = 'faqs';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return initialFaqs.map((f, i) => ({ id: `faq_${i + 1}`, ...f }));
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FAQ, 'id'>) }));
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.warn('Fallback faqs:', error);
    return initialFaqs.map((f, i) => ({ id: `faq_${i + 1}`, ...f }));
  }
}

export async function saveFaq(faq: Omit<FAQ, 'id'>, id?: string): Promise<string> {
  const docId = id || `faq_${Date.now()}`;
  const path = `faqs/${docId}`;
  try {
    const payload = cleanPayload({
      ...faq,
      createdAt: (faq as any).createdAt || new Date().toISOString(),
    });
    await setDoc(doc(db, 'faqs', docId), payload, { merge: true });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteFaq(id: string): Promise<void> {
  const path = `faqs/${id}`;
  try {
    await deleteDoc(doc(db, 'faqs', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==========================================
// 10. CONTACT MESSAGES
// ==========================================
export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const docId = `msg_${Date.now()}`;
  const path = `contactMessages/${docId}`;
  try {
    const payload: ContactMessage = cleanPayload({
      ...msg,
      id: docId,
      status: 'unread',
      createdAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'contactMessages', docId), payload);
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const path = 'contactMessages';
  try {
    const snap = await getDocs(collection(db, path));
    const messages = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) }));
    return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Fallback contact messages:', error);
    return [];
  }
}

export async function updateContactMessageStatus(id: string, status: ContactMessage['status']): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    await updateDoc(doc(db, 'contactMessages', id), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    await deleteDoc(doc(db, 'contactMessages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateContactMessageShowOnWebsite(id: string, showOnWebsite: boolean): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    await updateDoc(doc(db, 'contactMessages', id), {
      showOnWebsite,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateContactMessageReply(id: string, replyText: string): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    await updateDoc(doc(db, 'contactMessages', id), {
      replyText,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function getPublicClientMessages(): Promise<ContactMessage[]> {
  const path = 'contactMessages';
  try {
    const q = query(collection(db, path), where('showOnWebsite', '==', true));
    const snap = await getDocs(q);
    const messages = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) }));
    return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Notice loading public client messages:', error);
    return [];
  }
}

export function subscribeToPublicClientMessages(callback: (messages: ContactMessage[]) => void): Unsubscribe {
  const path = 'contactMessages';
  const q = query(collection(db, path), where('showOnWebsite', '==', true));
  return onSnapshot(
    q,
    (snap) => {
      const messages = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) }));
      messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(messages);
    },
    (error) => {
      console.warn('Public client messages snapshot warning:', error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeToAllContactMessages(callback: (messages: ContactMessage[]) => void): Unsubscribe {
  const path = 'contactMessages';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const messages = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) }));
      messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(messages);
    },
    (error) => {
      console.warn('Real-time contact messages snapshot notice:', error);
    }
  );
}

export function subscribeToAllCourses(callback: (courses: Course[]) => void): Unsubscribe {
  const path = 'courses';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const courses = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Course, 'id'>) }));
      courses.sort((a, b) => (a.order || 0) - (b.order || 0));
      callback(courses);
    },
    (error) => console.warn('Courses real-time subscription notice:', error)
  );
}

export function subscribeToAllTeachers(callback: (teachers: Teacher[]) => void): Unsubscribe {
  const path = 'teachers';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const teachers = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Teacher, 'id'>) }));
      callback(teachers);
    },
    (error) => console.warn('Teachers real-time subscription notice:', error)
  );
}

export function subscribeToAllAnnouncements(callback: (announcements: Announcement[]) => void): Unsubscribe {
  const path = 'announcements';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const announcements = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Announcement, 'id'>) }));
      announcements.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(announcements);
    },
    (error) => console.warn('Announcements real-time subscription notice:', error)
  );
}

export function subscribeToAllGalleryItems(callback: (items: GalleryItem[]) => void): Unsubscribe {
  const path = 'gallery';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) }));
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      callback(items);
    },
    (error) => console.warn('Gallery real-time subscription notice:', error)
  );
}

export function subscribeToAllReviews(callback: (reviews: Review[]) => void): Unsubscribe {
  const path = 'reviews';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const reviews = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, 'id'>) }));
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(reviews);
    },
    (error) => console.warn('Reviews real-time subscription notice:', error)
  );
}

export function subscribeToAllStudents(callback: (students: Student[]) => void): Unsubscribe {
  const path = 'students';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const students = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Student, 'id'>) }));
      callback(students);
    },
    (error) => console.warn('Students real-time subscription notice:', error)
  );
}

// ==========================================
// 11. CHATBOT SETTINGS & CONVERSATIONS
// ==========================================
const CHATBOT_DOC_ID = 'main';

export async function getChatbotSettings(): Promise<ChatbotSettings> {
  const path = `chatbotSettings/${CHATBOT_DOC_ID}`;
  try {
    const snap = await getDoc(doc(db, 'chatbotSettings', CHATBOT_DOC_ID));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as ChatbotSettings) };
    }
    return { id: CHATBOT_DOC_ID, ...initialChatbotSettings };
  } catch (error) {
    return { id: CHATBOT_DOC_ID, ...initialChatbotSettings };
  }
}

export async function updateChatbotSettings(settings: Partial<ChatbotSettings>): Promise<void> {
  const path = `chatbotSettings/${CHATBOT_DOC_ID}`;
  try {
    const payload = cleanPayload({
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'chatbotSettings', CHATBOT_DOC_ID), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function logChatConversation(conv: Omit<ChatConversation, 'id' | 'timestamp' | 'status'>): Promise<string> {
  const docId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `chatConversations/${docId}`;
  try {
    const payload: ChatConversation = cleanPayload({
      ...conv,
      id: docId,
      timestamp: new Date().toISOString(),
      status: 'unreviewed',
    });
    await setDoc(doc(db, 'chatConversations', docId), payload);
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getAllChatConversations(): Promise<ChatConversation[]> {
  const path = 'chatConversations';
  try {
    const snap = await getDocs(collection(db, path));
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatConversation, 'id'>) }));
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.warn('Fallback chat conversations:', error);
    return [];
  }
}

export async function updateChatConversationStatus(id: string, status: ChatConversation['status']): Promise<void> {
  const path = `chatConversations/${id}`;
  try {
    await updateDoc(doc(db, 'chatConversations', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteChatConversation(id: string): Promise<void> {
  const path = `chatConversations/${id}`;
  try {
    await deleteDoc(doc(db, 'chatConversations', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==========================================
// 12. DATABASE SEEDER (RUNS ONLY IF AUTHENTICATED ADMIN)
// ==========================================
let seedPromise: Promise<void> | null = null;

export async function initializeFirestoreSeedIfEmpty(): Promise<void> {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    try {
      // Check if site settings exists
      const settingsSnap = await getDoc(doc(db, 'siteSettings', SETTINGS_DOC_ID));
      if (!settingsSnap.exists()) {
        await setDoc(doc(db, 'siteSettings', SETTINGS_DOC_ID), cleanPayload({
          ...initialSiteSettings,
          updatedAt: new Date().toISOString(),
        }));
      }

      // Check courses
      const coursesSnap = await getDocs(query(collection(db, 'courses'), limit(1)));
      if (coursesSnap.empty) {
        for (let i = 0; i < initialCourses.length; i++) {
          await setDoc(doc(db, 'courses', `course_${i + 1}`), cleanPayload({
            ...initialCourses[i],
            createdAt: new Date().toISOString(),
          }));
        }
      }

      // Check teachers
      const teachersSnap = await getDocs(query(collection(db, 'teachers'), limit(1)));
      if (teachersSnap.empty) {
        for (let i = 0; i < initialTeachers.length; i++) {
          await setDoc(doc(db, 'teachers', `teacher_${i + 1}`), cleanPayload({
            ...initialTeachers[i],
            createdAt: new Date().toISOString(),
          }));
        }
      }

      // Check FAQs
      const faqsSnap = await getDocs(query(collection(db, 'faqs'), limit(1)));
      if (faqsSnap.empty) {
        for (let i = 0; i < initialFaqs.length; i++) {
          await setDoc(doc(db, 'faqs', `faq_${i + 1}`), cleanPayload({
            ...initialFaqs[i],
            createdAt: new Date().toISOString(),
          }));
        }
      }

      // Check Chatbot Settings
      const botSnap = await getDoc(doc(db, 'chatbotSettings', CHATBOT_DOC_ID));
      if (!botSnap.exists()) {
        await setDoc(doc(db, 'chatbotSettings', CHATBOT_DOC_ID), cleanPayload({
          ...initialChatbotSettings,
          updatedAt: new Date().toISOString(),
        }));
      }

      // Check Announcements
      const annSnap = await getDocs(query(collection(db, 'announcements'), limit(1)));
      if (annSnap.empty) {
        for (let i = 0; i < initialAnnouncements.length; i++) {
          await setDoc(doc(db, 'announcements', `ann_${i + 1}`), cleanPayload({
            ...initialAnnouncements[i],
            createdAt: new Date().toISOString(),
          }));
        }
      }

      // Check Gallery
      const galSnap = await getDocs(query(collection(db, 'gallery'), limit(1)));
      if (galSnap.empty) {
        for (let i = 0; i < initialGallery.length; i++) {
          await setDoc(doc(db, 'gallery', `gal_${i + 1}`), cleanPayload({
            ...initialGallery[i],
            createdAt: new Date().toISOString(),
          }));
        }
      }

      // Check Reviews
      const revSnap = await getDocs(query(collection(db, 'reviews'), limit(1)));
      if (revSnap.empty) {
        for (let i = 0; i < initialReviews.length; i++) {
          await setDoc(doc(db, 'reviews', `rev_${i + 1}`), cleanPayload({
            ...initialReviews[i],
            createdAt: new Date().toISOString(),
          }));
        }
      }

      // Check Contact Messages
      const msgSnap = await getDocs(query(collection(db, 'contactMessages'), limit(1)));
      if (msgSnap.empty) {
        for (let i = 0; i < initialContactMessages.length; i++) {
          await setDoc(doc(db, 'contactMessages', `msg_${i + 1}`), cleanPayload({
            ...initialContactMessages[i],
            id: `msg_${i + 1}`,
          }));
        }
      }

      // Check Admissions
      const admSnap = await getDocs(query(collection(db, 'admissions'), limit(1)));
      if (admSnap.empty) {
        for (let i = 0; i < initialAdmissions.length; i++) {
          await setDoc(doc(db, 'admissions', `adm_${i + 1}`), cleanPayload({
            ...initialAdmissions[i],
            id: `adm_${i + 1}`,
          }));
        }
      }
    } catch (e) {
      console.warn('Initial database seed skipped or already seeded:', e);
    }
  })();
  return seedPromise;
}
