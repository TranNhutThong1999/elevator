# 🏢 Elevator Management System

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22-brightgreen" alt="Node.js v22" />
  <img src="https://img.shields.io/badge/Frontend-React%2019-blue" alt="React 19" />
  <img src="https://img.shields.io/badge/Backend-NestJS-red" alt="NestJS" />
  <img src="https://img.shields.io/badge/License-UNLICENSED-lightgrey" alt="License" />
</p>

---

> **Hệ thống quản lý thang máy thông minh với giao diện web real-time và backend API.**
> 
> Ứng dụng sẽ tự động chọn thang máy phù hợp nhất trong 3 thang để phục vụ người dùng khi họ chọn đi lên (⬆️) hoặc đi xuống (⬇️).

---

## 📑 Table of Contents
- [📋 Mô tả dự án](#-mô-tả-dự-án)
- [🔗 Links](#-links)
- [🛠️ Yêu cầu hệ thống](#️-yêu-cầu-hệ-thống)
- [📦 Cài đặt](#-cài-đặt)
- [⚙️ Cấu hình](#️-cấu-hình)
- [🚀 Chạy ứng dụng](#-chạy-ứng-dụng)
- [🔧 Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [🌐 API Endpoints](#-api-endpoints)
- [📝 Ghi chú](#-ghi-chú)
- [📄 License](#-license)
- [👨‍💻 Tác giả](#-tác-giả)

---

## 📋 Mô tả dự án

Dự án này bao gồm:
- **Frontend**: Ứng dụng React với TypeScript, sử dụng Socket.IO để kết nối real-time
- **Backend**: API NestJS với TypeScript, hỗ trợ WebSocket
- **Tính năng**: Mô phỏng hệ thống thang máy với thuật toán tối ưu hóa

---

## 🔗 Links

- [**Repository**](https://github.com/TranNhutThong1999/elevator.git)
- [**Demo**](https://elevator23.netlify.app/)

---

## 🛠️ Yêu cầu hệ thống

- <img src="https://img.shields.io/badge/Node.js-v22-brightgreen" height="16"/> **Node.js**: v22 (khuyến nghị)
- <img src="https://img.shields.io/badge/npm%20%7C%20yarn-supported-blue" height="16"/> **npm** hoặc **yarn**

---

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/TranNhutThong1999/elevator.git
cd elevator
```

### 2. Cài đặt Backend

```bash
cd backend
npm install # hoặc yarn install
```

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install # hoặc yarn install
```

---

## ⚙️ Cấu hình

### Backend Configuration
Tạo file `.env` trong thư mục `backend`:

```env
BUSY_ELEVATOR_PENALTY=10
UNSUITABLE_ELEVATOR_PENALTY=100
MIN_FLOOR=1
MAX_FLOOR=10
```

### Frontend Configuration
Tạo file `.env` trong thư mục `frontend`:

```env
VITE_SOCKET_URL=http://localhost:3000
```

---

## 🚀 Chạy ứng dụng

### Chạy Backend

```bash
cd backend

# Development mode
npm run start:dev # hoặc yarn start:dev

# Production mode
npm run start:prod # hoặc yarn start:prod
```

Backend sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

### Chạy Frontend

```bash
cd frontend

# Development mode
npm run dev # hoặc yarn dev

# Build và preview
npm run build && npm run preview # hoặc yarn build && yarn preview
```

Frontend sẽ chạy tại: [http://localhost:5173](http://localhost:5173)

---


## 🌐 API Endpoints

- WebSocket connection cho real-time communication
- REST API cho quản lý thang máy

---

## 📝 Ghi chú

- Kiểm tra các biến môi trường trong file `.env`
- Frontend và Backend cần chạy đồng thời để hoạt động đầy đủ
- Backend sử dụng in-memory storage, **không cần database**

---

## 📄 License

Dự án này được phát hành dưới license **UNLICENSED**.

---

## 👨‍💻 Tác giả

**Trần Nhựt Thông** - [GitHub](https://github.com/TranNhutThong1999)
