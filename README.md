# ✨ Melooha – Frontend

**An AI-Powered Personalized Vedic Astrology Platform**

Melooha is a personalized astrology platform that combines traditional Vedic astrology with modern AI technology. It allows users to explore their birth charts, understand planetary placements, and receive personalized astrological insights through AI-powered conversations.

This repository contains the frontend application built using React, TypeScript, and Vite.

## 🚀 Features

- **User Authentication** – Registration and login functionality.
- **Birth Details Onboarding** – Capture birth date, time, and location.
- **Personalized Birth Chart** – Explore ascendant, planetary positions, zodiac signs, houses, and retrograde status.
- **Ask Melooha** – Interact with an AI-powered astrology assistant.
- **Streaming AI Responses** – Receive responses progressively for a smoother chat experience.
- **Conversation History** – Revisit previous questions and AI-generated insights.
- **Question Credits** – View available credits and manage question usage.
- **Responsive UI** – A clean interface with a cosmic-inspired visual theme.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| TypeScript | Type safety |
| Vite | Development and build tool |
| React Router | Client-side routing |
| CSS | Styling and responsive layouts |
| Lucide React | Icons |
| Fetch API | Backend communication |

## 📁 Project Structure

```text
Melooha-Frontend/
│
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── BirthChartPage.tsx
│   │   ├── AskMeloohaPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── QuestionCreditsPage.tsx
│   │
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Melooha-Frontend.git
cd Melooha-Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Replace the URL with your deployed backend URL when deploying to production.

### 4. Start the development server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

## 🏗️ Production Build

To generate the production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The optimized production files will be generated in the `dist/` directory.

## 🌐 Backend Integration

The frontend communicates with a FastAPI backend that handles:

- User authentication and account management.
- Birth chart generation and astrological calculations.
- AI-powered question answering.
- Streaming responses and conversation history.
- Question credit management.

**Backend Repository:** Add your Melooha backend GitHub repository link here.

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the FastAPI backend |

Do not commit `.env` files or expose private API keys in frontend code.

## 🚀 Deployment

The frontend is configured for deployment on **Vercel**.

1. Import the GitHub repository into Vercel.
2. Set the framework preset to Vite.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Configure `VITE_API_BASE_URL` with your deployed backend URL.
6. Deploy the application.

## 📌 Project Status

Melooha is an actively developed project focused on combining Vedic astrology with AI-powered personalized experiences.

---
