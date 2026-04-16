# Nexus | Secure Task & Identity Management System

A high-performance MERN stack application designed with a focus on Role-Based Access Control (RBAC) and modern UI/UX principles. This system allows for distributed task management while providing a secure "Global Override" terminal for system administrators.

---

## 🚀 Professional Features

* **Administrative Command Center**: A secure dashboard for global oversight of all system data.
* **Identity Ledger**: Full CRUD capabilities for managing user identities and access levels.
* **Master Task Override**: Admin-level control to audit and purge tasks across the entire database.
* **RBAC Security**: Protected routes using JWT and custom middleware to separate **Admin** and **User** privileges.
* **Modern UI**: Built with a **Glassmorphic** aesthetic using Tailwind CSS and Framer Motion.

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Framer Motion
* Lucide Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Tokens)
* Bcrypt.js

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd nexus
```

---

### 2. Backend Configuration

Navigate to the server folder:

```bash
cd server
```

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
ADMIN_SECRET_KEY=<your_admin_secret_key>
```

Install dependencies and start backend:

```bash
npm install
npm start
```

---

### 3. Frontend Configuration

Navigate to client folder:

```bash
cd client
```

Create a `.env` file and add:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Install dependencies and run frontend:

```bash
npm install
npm run dev
```

---

## 📂 Environment Variables Example

### Server `.env.example`

```env
PORT=5000
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_secret_string_here
ADMIN_SECRET_KEY=your_admin_secret_here
```

### Client `.env.example`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Git Commands for Deployment

```bash
# Stage all changes
git add .

# Commit with professional message
git commit -m "feat: implement RBAC security, admin identity ledger, and glassmorphic UI"

# Push to main branch
git push origin main
```

---

## 📌 Final Pro Tips

* Keep your `.env` files in `.gitignore`
* Add screenshots/GIFs of your UI for better recruiter impression
* Use consistent commit messages
* Deploy frontend and backend separately for production

---

## 📄 License

This project is built for educational and portfolio purposes.
