# 🏡 DIGITAL-ESTATE.BG - Virtual Staging AI Wrapper (React Native for Web)

A unified web and mobile wrapper around the **Virtual Staging AI** platform, built using **React Native for Web**. This project is designed to scale seamlessly from web to mobile, leveraging powerful tools like **Expo Router**, **Supabase**, **Tamagui UI**, **Zustand**, and **Stripe** for a fast, modern developer experience.

🌍 Live Demo
👉 Visit the current production version: www.digital-estate.bg

---

## 🚀 Project Goals

- **Web-first development** with React Native for Web
- **Future-ready mobile app** using the same codebase
- **Serverless architecture** powered by Supabase Edge Functions
- **Clean, maintainable styling** using Tamagui for hybrid UI
- **Simplified state management** with Zustand
- **Stripe-powered billing** with secure webhook handling

---

## 🧱 Tech Stack

| Layer      | Tech                                                                | Purpose                                                                |
| ---------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Frontend   | [React Native for Web](https://necolas.github.io/react-native-web/) | Cross-platform development using a single codebase                     |
| Navigation | [Expo Router](https://expo.github.io/router/)                       | File-based routing for universal navigation                            |
| Styling    | [Tamagui](https://tamagui.dev/)                                     | Responsive and performant styling across web and mobile                |
| State      | [Zustand](https://github.com/pmndrs/zustand)                        | Lightweight global state management                                    |
| Backend    | [Supabase](https://supabase.com/)                                   | Authentication, file storage, serverless functions, and cron jobs      |
| Payments   | [Stripe](https://stripe.com/)                                       | Subscription billing with webhook handling via Supabase edge functions |

---

## 📂 Project Structure

```
/
├── app/                     # Expo Router pages
├── components/              # Reusable UI components
├── lib/                     # Utility functions (API clients, helpers)
├── stores/                  # Zustand stores
├── supabase/
│   └── functions/           # Edge functions (auth, webhook, etc.)
├── tamagui.config.ts        # Tamagui theme and tokens
└── README.md
```

---

## 🧠 Key Features

### 🌐 React Native for Web

Start with a web app and expand effortlessly into mobile platforms using a unified codebase.

### 🧭 Expo Router

Simple, scalable navigation powered by file-based routing.

### 🎨 Tamagui UI

Style once, run everywhere. Highly optimized hybrid UI system for web and native apps.

### ⚡ Supabase Functions

Server-side logic and API endpoints are managed with edge functions inside `supabase/functions`. Includes:

- Auth handling
- Image uploads and processing
- Stripe webhooks for subscription events
- Cron jobs (e.g., cleanup, reminders)

### 💳 Stripe Integration

Full subscription lifecycle (checkout, billing, cancellations, webhooks) is powered by Stripe, with events processed securely using Supabase edge functions.

### 🧠 Zustand

A minimal, scalable state management library with no boilerplate or context nesting.

---
