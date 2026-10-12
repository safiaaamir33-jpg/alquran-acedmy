export type Language = 'en' | 'ur';

export interface SiteSettings {
  id?: string;
  academyName: string;
  academyNameUrdu?: string;
  tagline: string;
  taglineUrdu?: string;
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  topNoticeText?: string;
  showTopNotice?: boolean;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country?: string;
  timings?: string;
  feeStructureNote?: string;
  bankDetails?: string;
  freeTrialDays?: string;
  showClientMessagesOnWeb?: boolean;
  aboutMission: string;
  aboutVision: string;
  aboutApproach: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  whatsappChannelUrl?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  titleUrdu?: string;
  category: string;
  description: string;
  descriptionUrdu?: string;
  duration?: string;
  classMode?: string;
  timing?: string;
  feePkr?: string;
  imageUrl?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  id: string;
  name: string;
  nameUrdu?: string;
  qualification: string;
  qualificationUrdu?: string;
  subjects?: string;
  experience?: string;
  gender?: string;
  bio?: string;
  bioUrdu?: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Admission {
  id: string;
  studentName: string;
  guardianName?: string;
  phone: string;
  email?: string;
  age?: string;
  courseId?: string;
  courseTitle: string;
  classMode?: string;
  preferredTiming?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'enrolled' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  guardianName?: string;
  phone: string;
  email?: string;
  courseId?: string;
  courseTitle: string;
  enrollmentDate: string;
  status: 'active' | 'paused' | 'graduated' | 'inactive';
  feeStatus: 'paid' | 'pending' | 'partial';
  monthlyFeePkr?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentFee {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  year: number;
  amountPkr: number;
  status: 'paid' | 'pending' | 'partial';
  paidDate?: string;
  receiptNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleUrdu?: string;
  content: string;
  contentUrdu?: string;
  category?: string;
  imageUrl?: string;
  actionLink?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  category?: string;
  imageUrl: string;
  caption?: string;
  isPublished: boolean;
  order?: number;
  createdAt?: string;
}

export interface Review {
  id: string;
  name: string;
  relation?: string;
  courseTitle?: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

export interface FAQ {
  id: string;
  question: string;
  questionUrdu?: string;
  answer: string;
  answerUrdu?: string;
  category?: string;
  order?: number;
  isPublished: boolean;
  createdAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  showOnWebsite?: boolean;
  replyText?: string;
  status: 'unread' | 'read' | 'resolved';
  createdAt: string;
  updatedAt?: string;
}

export interface ChatbotSettings {
  id?: string;
  isEnabled: boolean;
  botName: string;
  welcomeMessage: string;
  welcomeMessageUrdu: string;
  systemPrompt: string;
  tone: string;
  suggestedQuestions: string[];
  showAdmissionShortcut: boolean;
  showContactShortcut: boolean;
  updatedAt?: string;
}

export interface ChatConversation {
  id: string;
  sessionId: string;
  userMessage: string;
  botReply: string;
  timestamp: string;
  status: 'unreviewed' | 'reviewed' | 'flagged';
  userLanguage?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'superadmin';
  createdAt?: string;
}
