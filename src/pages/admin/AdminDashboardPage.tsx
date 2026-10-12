import React from 'react';
import {
  FileCheck2,
  Inbox,
  BookOpen,
  Bell,
  Star,
  Bot,
  Users,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { Admission, ContactMessage, Course, Announcement, Review, ChatConversation, Student } from '../../types';

interface AdminDashboardPageProps {
  admissions: Admission[];
  messages: ContactMessage[];
  courses: Course[];
  announcements: Announcement[];
  reviews: Review[];
  chatConversations: ChatConversation[];
  students: Student[];
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  admissions,
  messages,
  courses,
  announcements,
  reviews,
  chatConversations,
  students,
  onNavigate,
}) => {
  // Real metrics calculated directly from Firestore collections
  const totalAdmissions = admissions.length;
  const pendingAdmissions = admissions.filter((a) => a.status === 'pending').length;
  const unreadMessages = messages.filter((m) => m.status === 'unread').length;
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const publishedAnnouncements = announcements.filter((a) => a.isPublished).length;
  const pendingReviews = reviews.filter((r) => r.status === 'pending').length;
  const totalChatInteractions = chatConversations.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;

  const statCards = [
    {
      label: 'Pending Admissions',
      value: pendingAdmissions,
      sub: `${totalAdmissions} Total Applications`,
      icon: <FileCheck2 className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      path: '/admin/admissions',
    },
    {
      label: 'Unread Enquiries',
      value: unreadMessages,
      sub: `${messages.length} Total Messages`,
      icon: <Inbox className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      path: '/admin/messages',
    },
    {
      label: 'Reviews for Approval',
      value: pendingReviews,
      sub: `${reviews.filter((r) => r.status === 'approved').length} Approved`,
      icon: <Star className="w-5 h-5 text-[#D4AF37]" />,
      bg: 'bg-amber-50/60',
      border: 'border-amber-200',
      path: '/admin/reviews',
    },
    {
      label: 'Active Students',
      value: activeStudents,
      sub: `${students.length} Total Roster`,
      icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      path: '/admin/students',
    },
    {
      label: 'Published Courses',
      value: publishedCourses,
      sub: `${courses.length} Available`,
      icon: <BookOpen className="w-5 h-5 text-[#075E46]" />,
      bg: 'bg-[#F3F8F4]',
      border: 'border-emerald-200',
      path: '/admin/courses',
    },
    {
      label: 'AI Chatbot Logs',
      value: totalChatInteractions,
      sub: 'Visitor Interactions',
      icon: <Bot className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      path: '/admin/chatbot',
    },
  ];

  const recentAdmissions = admissions.slice(0, 5);
  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome & Timezone Banner */}
      <div className="bg-gradient-to-r from-[#075E46] to-[#0B7A53] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
            Academy Management System
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-1">
            Noor Al-Quran Academy Control Center
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Real-time synchronization with Cloud Firestore • Timezone: Asia/Karachi (PKT)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/admissions')}
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#24352F] font-bold text-xs shadow-sm hover:bg-[#c29f31] transition-all"
          >
            Review Admissions ({pendingAdmissions})
          </button>
        </div>
      </div>

      {/* Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(card.path)}
            className={`bg-white rounded-2xl p-5 border ${card.border} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500">{card.label}</span>
                <div className="text-3xl font-extrabold text-[#24352F] mt-1">{card.value}</div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>{card.sub}</span>
              <span className="text-[#075E46] font-semibold flex items-center gap-1">
                Manage <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Recent Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Admissions */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#075E46] flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#075E46]" />
              <span>Recent Admissions</span>
            </h3>
            <button
              onClick={() => onNavigate('/admin/admissions')}
              className="text-xs font-bold text-[#075E46] hover:underline"
            >
              View All
            </button>
          </div>

          {recentAdmissions.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No admission applications received yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentAdmissions.map((adm) => (
                <div key={adm.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#24352F]">{adm.studentName}</h4>
                    <span className="text-[11px] text-gray-500">{adm.courseTitle} • {adm.phone}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      adm.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : adm.status === 'enrolled'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {adm.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#075E46] flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#075E46]" />
              <span>Recent Contact Inquiries</span>
            </h3>
            <button
              onClick={() => onNavigate('/admin/messages')}
              className="text-xs font-bold text-[#075E46] hover:underline"
            >
              View Inbox
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">Inbox is clear. No new inquiries.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#24352F]">{msg.name}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{msg.message}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      msg.status === 'unread'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
