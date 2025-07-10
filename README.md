# 🏢 Elevator Management System

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22-brightgreen" alt="Node.js v22" />
  <img src="https://img.shields.io/badge/Frontend-React%2019-blue" alt="React 19" />
  <img src="https://img.shields.io/badge/Backend-NestJS-red" alt="NestJS" />
  <img src="https://img.shields.io/badge/License-UNLICENSED-lightgrey" alt="License" />
</p>

---

> **Smart elevator management system with real-time web interface and backend API.**
> 
> The application will automatically select the most suitable elevator among 3 elevators to serve users when they choose to go up (⬆️) or down (⬇️).

---

## 📑 Table of Contents
- [📋 Project Description](#-project-description)
- [🔗 Links](#-links)
- [🛠️ System Requirements](#-system-requirements)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#-configuration)
- [🚀 Running the Application](#-running-the-application)
- [🔧 Technologies Used](#-technologies-used)
- [🌐 API Endpoints](#-api-endpoints)
- [📝 Notes](#-notes)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## 📋 Project Description

This project includes:
- **Frontend**: React application with TypeScript, using Socket.IO for real-time connection
- **Backend**: NestJS API with TypeScript, supporting WebSocket
- **Features**: Simulates an elevator system with optimization algorithm

---

## 🔗 Links

- [**Repository**](https://github.com/TranNhutThong1999/elevator.git)
- [**Demo**](https://elevator23.netlify.app/)

> **Note:** The backend is hosted on render.com and will go to sleep after 15 minutes of inactivity. When reopening the demo, please wait a few minutes for the server to start and the API to become available.

---

## 🛠️ System Requirements

- <img src="https://img.shields.io/badge/Node.js-v22-brightgreen" height="16"/> **Node.js**: v22 (recommended)
- <img src="https://img.shields.io/badge/npm%20%7C%20yarn-supported-blue" height="16"/> **npm** or **yarn**

---

## 📦 Installation

### 1. Clone repository

```bash
git clone https://github.com/TranNhutThong1999/elevator.git
cd elevator
```

### 2. Install Backend

```bash
cd backend
npm install # or yarn install
```

### 3. Install Frontend

```bash
cd ../frontend
npm install # or yarn install
```

---

## ⚙️ Configuration

### Backend Configuration
Create a `.env` file in the `backend` directory:

```env
BUSY_ELEVATOR_PENALTY=10
UNSUITABLE_ELEVATOR_PENALTY=100
MIN_FLOOR=1
MAX_FLOOR=10
```

### Frontend Configuration
Create a `.env` file in the `frontend` directory:

```env
VITE_SOCKET_URL=http://localhost:3000
```

---

## 🚀 Running the Application

### Run Backend

```bash
cd backend

# Development mode
npm run start:dev # or yarn start:dev

# Production mode
npm run start:prod # or yarn start:prod
```

Backend will run at: [http://localhost:3000](http://localhost:3000)

### Run Frontend

```bash
cd frontend

# Development mode
npm run dev # or yarn dev

# Build and preview
npm run build && npm run preview # or yarn build && yarn preview
```

Frontend will run at: [http://localhost:5173](http://localhost:5173)

---

## 🌐 API Endpoints

- WebSocket connection for real-time communication
- REST API for elevator management

---

## 📝 Notes

- Check environment variables in the `.env` file
- Frontend and Backend need to run simultaneously for full functionality
- Backend uses in-memory storage, **no database required**

---

## 📄 License

This project is released under the **UNLICENSED** license.

---

## 👨‍💻 Author

**Tran Nhut Thong** - [GitHub](https://github.com/TranNhutThong1999)
