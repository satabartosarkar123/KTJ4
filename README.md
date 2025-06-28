# link : 
https://nuntio-7cos65qvx-satabartosarkar123s-projects.vercel.app/

# 📰 Nutino — The Intelligent News Dashboard

**Nutino** (from *"nutinō"*, Latin: *"to nod, signal, announce"*) is a sleek and modern AI-powered news dashboard that brings real-time news, insightful summaries, and intelligent categorization together in one seamless experience. Built from the ground up using **ReactJS**, **Express**, and **Google Gemini Pro**, this application offers both frontend and backend integration for fetching, displaying, summarizing, and managing news stories — all within a clean and intuitive interface.

---

## 🔍 Features

- 📂 **Category Tabs**: Switch between Business, Technology, Sports, Health, and more.
- 📰 **Live News Feed**: Real-time fetching of global headlines via NewsAPI.
- ✂️ **AI Summarization**: One-click summarizer using **Google Gemini Pro API** — get 3-bullet-point summaries of articles.
- 💾 **Save Articles**: Registered users can bookmark articles into their personal dashboard (via MongoDB).
- 🛡️ **Authentication**: User registration and login functionality with secure route protection.
- 🔁 **Session Caching**: In-memory/sessionStorage optimization to avoid redundant API calls.
- 🌐 **Responsive UI**: Fully responsive layout designed using CSS Flexbox/Grid and Tailwind (optional).
- 🚀 **Modular Backend**: Clean separation of concerns using controllers, models, routes, and environment configs.

---

## 🛠️ Tech Stack

### 💻 Frontend
- **ReactJS**
- **Axios** – for REST API communication
- **React Router** – page routing and navigation
- **Tailwind CSS / Styled Components** – for responsive styling

### 🌐 Backend
- **Node.js + Express.js**
- **MongoDB + Mongoose** – for database and schema modeling
- **dotenv** – for environment configuration
- **bcryptjs / JWT** – for authentication and token-based sessions

### 🤖 AI & APIs
- **Google Gemini Pro API** – LLM-based summarization (via REST)
- **NewsAPI** – fetching latest news based on categories and keywords

