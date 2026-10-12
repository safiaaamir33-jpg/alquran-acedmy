# Security Specification: Noor Al-Quran Academy

## 1. Data Invariants
1. **Admins:** Public visitors can NEVER read or write `/admins/{uid}`. Only authenticated users with an existing verified admin document can manage or read admin records. No user can self-promote to admin. Bootstrapped admin email is `safiaaamir18@gmail.com`.
2. **Site Settings:** Public can read `/siteSettings/{id}`. Only authenticated admins can write `/siteSettings/{id}`.
3. **Courses, Teachers, Announcements, Gallery, FAQs:** Public can read only published items (`isPublished == true`). Unauthenticated and non-admin users cannot write or delete.
4. **Admissions:** Any visitor can submit (`create`) an admission application with initial status `'pending'`, but can NEVER list or read other admissions. Only authenticated admins can read, update, or delete admissions.
5. **Students & Student Fees:** Public visitors cannot read or write `/students/{id}` or `/studentFees/{id}`. Only authenticated admins can perform CRUD operations.
6. **Reviews:** Public can read only approved reviews (`status == 'approved'`). Any visitor can submit a review with status forced to `'pending'`. Only admins can approve, update, or delete reviews.
7. **Contact Messages:** Public visitors can submit (`create`) a contact inquiry with status forced to `'unread'`. Public cannot list, read, update, or delete `/contactMessages/{id}`.
8. **Chatbot Settings:** Public can read chatbot settings. Only admins can update settings.
9. **Chat Conversations:** Visitors can create chat logs with matching sessionId, but cannot read or update other conversations. Admins can read, update status, and manage logs.

## 2. The Dirty Dozen Payloads (Designed to Attack System Security)
1. **Self-Promotion Attack:** Unauthenticated user writes `{ role: "admin", email: "hacker@evil.com" }` to `/admins/hacker-uid`. MUST BE DENIED.
2. **PII Snooping in Admissions:** Unauthenticated visitor executes `collection("admissions").getDocs()`. MUST BE DENIED.
3. **Ghost Field Poisoning in Admissions:** Visitor submits admission with `{ studentName: "Ali", status: "enrolled", isAdmin: true, bypass: true }`. MUST BE DENIED.
4. **Student Financial Records Scraping:** Unauthenticated or non-admin user queries `/students` or `/studentFees`. MUST BE DENIED.
5. **Unpublished Course Leakage:** Unauthenticated visitor attempts to read `/courses/draft-course` where `isPublished == false`. MUST BE DENIED.
6. **Self-Approved Review Injection:** Visitor submits review with `{ status: "approved", rating: 5, comment: "Fake review" }`. MUST BE DENIED (must only be created as 'pending').
7. **Contact Inbox Theft:** Malicious visitor queries `/contactMessages`. MUST BE DENIED.
8. **Branding Hijack:** Unauthenticated user attempts `updateDoc(doc(db, "siteSettings", "main"), { academyName: "Scam Academy" })`. MUST BE DENIED.
9. **ID Poisoning Attack:** User requests document with 2000-character malicious path ID or non-alphanumeric chars. MUST BE DENIED.
10. **Chatbot Config Tamper:** Visitor tries to update `/chatbotSettings/main` with `{ isEnabled: false }`. MUST BE DENIED.
11. **Student Status Modification:** Non-admin attempts to change student fee status or notes. MUST BE DENIED.
12. **Review Status Tamper:** Regular user updates review status to 'approved' bypassing moderation. MUST BE DENIED.

## 3. Test Runner Specification
See `firestore.rules.test.ts` for automated verification ensuring all 12 attack vectors receive `PERMISSION_DENIED`.
