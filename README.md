# NearMobileRepair 📱🔧

NearMobileRepair is a modern, serverless web application that provides seamless doorstep mobile repair services for customers in Ahmedabad. 

Built with React, Vite, Tailwind CSS, and Firebase, this platform offers a fast, reliable, and user-friendly experience for booking repairs, tracking statuses, and managing operations.

## ✨ Features

- **Instant Price Estimates:** Customers can get immediate repair quotes based on their phone brand, model, and issue.
- **Secure Authentication:** Passwordless login and registration powered by Google and Firebase Email Auth.
- **Real-Time Database:** All bookings and user profiles are securely stored and synced in real-time using Firebase Firestore.
- **Live Status Tracking:** Customers can track the exact status of their repair using their Booking ID or by logging in.
- **Admin Dashboard:** A secure, dedicated dashboard for administrators to view, manage, and update the status of all incoming bookings.
- **SEO & PWA Optimized:** Built to load instantly and rank highly on search engines to drive organic local traffic.

## 🚀 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons), Motion (Animations)
- **Backend & Database:** Firebase Authentication, Cloud Firestore
- **Routing:** React Router DOM
- **Deployment Ready:** Configured with `vercel.json` for instant Vercel deployment.

## 🔒 Security Note
This repository does not contain any private databases or sensitive customer information. All user data is securely managed via Google Cloud (Firebase). 
*(Note: Firebase client configuration keys are included for build purposes, which is a safe practice per Google's official documentation, provided proper Firestore Security Rules are applied).*
