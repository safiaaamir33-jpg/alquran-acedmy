# Noor Al-Quran Academy — Setup & Production Deployment Guide

Welcome to the **Noor Al-Quran Academy** web platform. This guide explains how the system is architected, how Firebase and Gemini are connected, and how administrators manage all aspects of the academy without touching source code.

---

## 1. Quick Start & Local Execution
The application is a full-stack Node.js + Express + React TypeScript application built with Vite and Tailwind CSS.

- **Start Development Server**:
  ```bash
  npm run dev
  ```
  Runs at `http://localhost:3000` with the Express API and Vite middlewares mounted together.
- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

---

## 2. Firebase Architecture & Services Connection
Firebase configuration is automatically read from `firebase-applet-config.json`. The following services are initialized:
- **Cloud Firestore**: Database ID `ai-studio-nooralquranacade-137e641b-c66a-4e51-aaa4-51c60ddce319`.
- **Firebase Authentication**: Email/Password and Google sign-in for administrators.
- **Firebase Storage**: Default bucket `mesmerizing-reactor-j53bd.firebasestorage.app` for uploaded logos, banners, posters, and gallery images.

---

## 3. Creating the First Administrator Account
To secure the academy's management portal at `/admin`:

1. Open the [Firebase Console](https://console.firebase.google.com/project/mesmerizing-reactor-j53bd/authentication/users).
2. Go to **Authentication** > **Users** and click **Add user**.
3. Create an administrator with their email (e.g., `safiaaamir18@gmail.com` or `admin@nooralquran.pk`) and a secure password.
4. Copy the newly created user's **User UID** (e.g. `abc123xyz456`).
5. Go to **Firestore Database** > **Start collection**:
   - Collection ID: `admins`
   - Document ID: Paste the user's **UID**
   - Fields:
     - `email`: `"safiaaamir18@gmail.com"` (string)
     - `role`: `"superadmin"` (string)
     - `createdAt`: `"2026-10-11T00:00:00Z"` (string)
6. Note: As configured in `firestore.rules`, `safiaaamir18@gmail.com` is also automatically recognized as a bootstrap administrator!
7. Navigate to `/admin/login` in your browser and sign in using your credentials.

---

## 4. Server-Side Gemini AI Chatbot Configuration
The AI chatbot runs through a secure server-side Express endpoint at `POST /api/chatbot`.
- **Secret API Key**: AI Studio injects `GEMINI_API_KEY` into `process.env.GEMINI_API_KEY`. The browser NEVER sees the key.
- **Model**: `gemini-3.1-pro-preview` with `thinkingLevel: ThinkingLevel.HIGH` enabled for deep Quranic, Tajweed, and educational reasoning, with graceful fallback to `gemini-3.8-flash`.
- **Grounding**: The chatbot automatically queries published courses, academy contact information, and FAQs to supply accurate, non-hallucinated guidance to prospective students and parents.
- **Admin Chatbot Panel**: Admins can edit the bot's greeting, tone, system instructions, and suggested questions directly from `/admin/chatbot`.

---

## 5. Firebase Security Rules & Storage
The repository includes:
- `firestore.rules`: Hardened attribute-based access control (ABAC). Unauthenticated users can only read published courses, teachers, announcements, gallery photos, and approved reviews. Only admins can read private admissions, students, student fees, and contact messages.
- `storage.rules`: Allows public read for images and documents; requires admin authorization for media uploads and deletions.
- Deploy rules with `rpc_action` or `firebase deploy --only firestore:rules,storage`.

---

## 6. Admin Media & Content Management
All content is dynamic and editable in the `/admin` portal:
- **Logo & Hero**: Set or upload images in `/admin/settings`.
- **Courses**: Add, edit, publish/unpublish, and set fees in PKR in `/admin/courses`.
- **Teachers**: Manage teacher qualifications, photos, and bios in `/admin/teachers`.
- **Admissions**: View new applications in `/admin/admissions`, update statuses (`pending`, `contacted`, `enrolled`), and export or note student details.
- **Students & Fees**: Track enrolled student records and monthly fee payments (`paid`, `pending`, `partial`) in `/admin/students`.
- **Announcements & Posters**: Upload admission banners in `/admin/announcements` and `/admin/posters`.
- **Gallery**: Manage photo collections with lightbox preview in `/admin/gallery`.
- **Reviews**: Approve or reject parent and student reviews in `/admin/reviews`.
- **Inbox**: Read and resolve contact enquiries in `/admin/messages`.

---

## 7. Troubleshooting
- **Missing or Insufficient Permissions**: Ensure your user UID is in `/admins/{uid}` or that your login email matches `safiaaamir18@gmail.com`.
- **Storage Upload Fails**: Ensure the file is an image (`image/*`) and under 5 MB. Alternatively, paste any direct image URL.
- **Urdu RTL Layout**: Click the language toggle `اردو / English` in the navbar to test right-to-left layout and Urdu typography.
