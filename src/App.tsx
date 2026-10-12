import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingChatbot } from './components/chatbot/FloatingChatbot';
import { Toast } from './components/common/Toast';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { CoursesPage } from './pages/public/CoursesPage';
import { TeachersPage } from './pages/public/TeachersPage';
import { OnlineClassesPage } from './pages/public/OnlineClassesPage';
import { AdmissionPage } from './pages/public/AdmissionPage';
import { AnnouncementsPage } from './pages/public/AnnouncementsPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ReviewsPage } from './pages/public/ReviewsPage';
import { ContactPage } from './pages/public/ContactPage';
import { FaqPage } from './pages/public/FaqPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages & Layout
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminTeachersPage } from './pages/admin/AdminTeachersPage';
import { AdminAdmissionsPage } from './pages/admin/AdminAdmissionsPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminPostersPage } from './pages/admin/AdminPostersPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminChatbotPage } from './pages/admin/AdminChatbotPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Types & Services
import {
  SiteSettings,
  Course,
  Teacher,
  Announcement,
  GalleryItem,
  Review,
  FAQ,
  Admission,
  ContactMessage,
  ChatConversation,
  Student,
} from './types';
import {
  getSiteSettings,
  getPublishedCourses,
  getAllCourses,
  getPublishedTeachers,
  getAllTeachers,
  getPublishedAnnouncements,
  getAllAnnouncements,
  getPublishedGalleryItems,
  getAllGalleryItems,
  getApprovedReviews,
  getAllReviews,
  getPublishedFaqs,
  getAllAdmissions,
  getAllContactMessages,
  getAllChatConversations,
  getAllStudents,
  initializeFirestoreSeedIfEmpty,
  subscribeToSiteSettings,
  getPublicClientMessages,
  subscribeToPublicClientMessages,
  subscribeToAllContactMessages,
  subscribeToAllAdmissions,
  subscribeToAllCourses,
  subscribeToAllTeachers,
  subscribeToAllAnnouncements,
  subscribeToAllGalleryItems,
  subscribeToAllReviews,
  subscribeToAllStudents,
} from './firebase/services';
import { initialSiteSettings } from './firebase/seedData';

function AppContent() {
  const { user, isAdmin } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Global State from Firestore
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const cached = localStorage.getItem('noor_cached_settings');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }
    return { id: 'main', ...initialSiteSettings };
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [publicClientMessages, setPublicClientMessages] = useState<ContactMessage[]>([]);

  // Admin Specific Collections
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Real-time synchronization for site settings & public client messages
  useEffect(() => {
    let unsubSettings: (() => void) | undefined;
    let unsubPublicMsgs: (() => void) | undefined;

    try {
      unsubSettings = subscribeToSiteSettings((s) => {
        if (s) setSettings(s);
      });
      unsubPublicMsgs = subscribeToPublicClientMessages((msgs) => {
        if (msgs) setPublicClientMessages(msgs);
      });
    } catch (e) {
      console.warn('Subscription notice:', e);
    }

    return () => {
      if (unsubSettings) unsubSettings();
      if (unsubPublicMsgs) unsubPublicMsgs();
    };
  }, []);

  // Real-time synchronization for Admin Collections (Messages, Admissions, Courses, etc.)
  useEffect(() => {
    if (!user || !isAdmin) return;

    let unsubMsgs: (() => void) | undefined;
    let unsubAdms: (() => void) | undefined;
    let unsubCourses: (() => void) | undefined;
    let unsubTeachers: (() => void) | undefined;
    let unsubAnn: (() => void) | undefined;
    let unsubGal: (() => void) | undefined;
    let unsubRev: (() => void) | undefined;
    let unsubStudents: (() => void) | undefined;

    try {
      unsubMsgs = subscribeToAllContactMessages((m) => {
        if (m) setMessages(m);
      });
      unsubAdms = subscribeToAllAdmissions((a) => {
        if (a) setAdmissions(a);
      });
      unsubCourses = subscribeToAllCourses((c) => {
        if (c) setCourses(c);
      });
      unsubTeachers = subscribeToAllTeachers((t) => {
        if (t) setTeachers(t);
      });
      unsubAnn = subscribeToAllAnnouncements((an) => {
        if (an) setAnnouncements(an);
      });
      unsubGal = subscribeToAllGalleryItems((g) => {
        if (g) setGallery(g);
      });
      unsubRev = subscribeToAllReviews((r) => {
        if (r) setReviews(r);
      });
      unsubStudents = subscribeToAllStudents((st) => {
        if (st) setStudents(st);
      });
    } catch (e) {
      console.warn('Real-time admin sync notice:', e);
    }

    return () => {
      if (unsubMsgs) unsubMsgs();
      if (unsubAdms) unsubAdms();
      if (unsubCourses) unsubCourses();
      if (unsubTeachers) unsubTeachers();
      if (unsubAnn) unsubAnn();
      if (unsubGal) unsubGal();
      if (unsubRev) unsubRev();
      if (unsubStudents) unsubStudents();
    };
  }, [user, isAdmin]);

  // Update document title and favicon dynamically based on settings
  useEffect(() => {
    if (settings.academyName) {
      document.title = `${settings.academyName} - ${settings.tagline || 'Online Quran Education'}`;
    }
    if (settings.logoUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.logoUrl;
    }
  }, [settings.academyName, settings.tagline, settings.logoUrl]);

  // Routing synchronization with window.location
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
  }, []);

  // Fetch Public Data
  const loadPublicData = useCallback(async () => {
    try {
      initializeFirestoreSeedIfEmpty().catch(() => {});
      const [sData, cData, tData, aData, gData, rData, fData, pMsgs] = await Promise.all([
        getSiteSettings(),
        getPublishedCourses(),
        getPublishedTeachers(),
        getPublishedAnnouncements(),
        getPublishedGalleryItems(),
        getApprovedReviews(),
        getPublishedFaqs(),
        getPublicClientMessages(),
      ]);

      if (sData) setSettings(sData);
      if (cData) setCourses(cData);
      if (tData) setTeachers(tData);
      if (aData) setAnnouncements(aData);
      if (gData) setGallery(gData);
      if (rData) setReviews(rData);
      if (fData) setFaqs(fData);
      if (pMsgs) setPublicClientMessages(pMsgs);
    } catch (err) {
      console.warn('Public data notice:', err);
    }
  }, []);
  // Fetch Admin Data (only called when user is authenticated admin)
  const loadAdminData = useCallback(async () => {
    if (!user || !isAdmin) return;
    try {
      await initializeFirestoreSeedIfEmpty();
      const [sData, cData, tData, aData, gData, rData, admData, msgData, chatData, stuData] =
        await Promise.all([
          getSiteSettings(),
          getAllCourses(),
          getAllTeachers(),
          getAllAnnouncements(),
          getAllGalleryItems(),
          getAllReviews(),
          getAllAdmissions(),
          getAllContactMessages(),
          getAllChatConversations(),
          getAllStudents(),
        ]);

      if (sData) setSettings(sData);
      if (cData) setCourses(cData);
      if (tData) setTeachers(tData);
      if (aData) setAnnouncements(aData);
      if (gData) setGallery(gData);
      if (rData) setReviews(rData);
      if (admData) setAdmissions(admData);
      if (msgData) setMessages(msgData);
      if (chatData) setChatConversations(chatData);
      if (stuData) setStudents(stuData);
    } catch (err) {
      console.warn('Admin data notice:', err);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (user && isAdmin && currentPath.startsWith('/admin')) {
      loadAdminData();
    } else {
      loadPublicData();
    }
  }, [user, isAdmin, currentPath, loadPublicData, loadAdminData]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const isAdminRoute = currentPath.startsWith('/admin') && currentPath !== '/admin/login';

  const searchParams = new URLSearchParams(window.location.search);
  const initialCourseTitle = searchParams.get('course') || undefined;

  // Admin Login route or unauthenticated admin access
  if (currentPath === '/admin/login' || (isAdminRoute && (!user || !isAdmin))) {
    return (
      <>
        <AdminLoginPage onNavigate={navigate} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  // Render Admin View for authenticated admins
  if (isAdminRoute && user && isAdmin) {
    const badgeCounts = {
      admissions: admissions.filter((a) => a.status === 'pending').length,
      messages: messages.filter((m) => m.status === 'unread').length,
      reviews: reviews.filter((r) => r.status === 'pending').length,
    };

    return (
      <>
        <AdminLayout currentPath={currentPath} onNavigate={navigate} badgeCounts={badgeCounts}>
          {currentPath === '/admin' && (
            <AdminDashboardPage
              admissions={admissions}
              messages={messages}
              courses={courses}
              announcements={announcements}
              reviews={reviews}
              chatConversations={chatConversations}
              students={students}
              onNavigate={navigate}
            />
          )}
          {currentPath === '/admin/courses' && (
            <AdminCoursesPage courses={courses} onRefresh={loadAdminData} showToast={showToast} />
          )}
          {currentPath === '/admin/teachers' && (
            <AdminTeachersPage teachers={teachers} onRefresh={loadAdminData} showToast={showToast} />
          )}
          {currentPath === '/admin/admissions' && (
            <AdminAdmissionsPage admissions={admissions} onRefresh={loadAdminData} showToast={showToast} />
          )}
          {currentPath === '/admin/students' && (
            <AdminStudentsPage courses={courses} onRefresh={loadAdminData} showToast={showToast} />
          )}
          {currentPath === '/admin/announcements' && (
            <AdminAnnouncementsPage announcements={announcements} onRefresh={loadAdminData} showToast={showToast} />
          )}
          {currentPath === '/admin/posters' && (
            <AdminPostersPage announcements={announcements} onRefresh={loadAdminData} showToast={showToast} />
          )}
          {currentPath === '/admin/gallery' && (
            <AdminGalleryPage gallery={gallery} onRefresh={loadAdminData} showToast={showToast} />
          )}
          {currentPath === '/admin/reviews' && (
            <AdminReviewsPage reviews={reviews} onRefresh={loadAdminData} showToast={showToast} />
          )}
          {currentPath === '/admin/messages' && (
            <AdminMessagesPage messages={messages} onRefresh={loadAdminData} showToast={showToast} />
          )}
          {currentPath === '/admin/chatbot' && (
            <AdminChatbotPage showToast={showToast} />
          )}
          {currentPath === '/admin/settings' && (
            <AdminSettingsPage settings={settings} onRefresh={loadAdminData} showToast={showToast} />
          )}
        </AdminLayout>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  // Public View
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F8F4] text-[#24352F]">
      <Header settings={settings} currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            settings={settings}
            courses={courses}
            teachers={teachers}
            announcements={announcements}
            gallery={gallery}
            reviews={reviews}
            faqs={faqs}
            clientMessages={publicClientMessages}
            onNavigate={navigate}
          />
        )}
        {currentPath === '/about' && (
          <AboutPage settings={settings} onNavigate={navigate} />
        )}
        {currentPath === '/courses' && (
          <CoursesPage courses={courses} onNavigate={navigate} />
        )}
        {currentPath === '/teachers' && (
          <TeachersPage teachers={teachers} onNavigate={navigate} />
        )}
        {currentPath === '/classes' && (
          <OnlineClassesPage settings={settings} onNavigate={navigate} />
        )}
        {currentPath === '/admission' && (
          <AdmissionPage
            courses={courses}
            initialCourseTitle={initialCourseTitle}
            onNavigate={navigate}
          />
        )}
        {currentPath === '/announcements' && (
          <AnnouncementsPage announcements={announcements} onNavigate={navigate} />
        )}
        {currentPath === '/gallery' && (
          <GalleryPage gallery={gallery} />
        )}
        {currentPath === '/reviews' && (
          <ReviewsPage reviews={reviews} clientMessages={publicClientMessages} />
        )}
        {currentPath === '/contact' && (
          <ContactPage settings={settings} />
        )}
        {currentPath === '/faq' && (
          <FaqPage faqs={faqs} onNavigate={navigate} />
        )}
        {currentPath === '/privacy' && (
          <PrivacyPage />
        )}
        {![
          '/',
          '/about',
          '/courses',
          '/teachers',
          '/classes',
          '/admission',
          '/announcements',
          '/gallery',
          '/reviews',
          '/contact',
          '/faq',
          '/privacy',
        ].includes(currentPath) && (
          <NotFoundPage onNavigate={navigate} />
        )}
      </main>

      <Footer settings={settings} onNavigate={navigate} />

      {/* Floating AI Counselor Chatbot */}
      <FloatingChatbot settings={settings} onNavigate={navigate} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
