True Crime Archive

True Crime Archive is a full-stack web application that allows users to explore, organize, and analyze true-crime cases. Users can browse public cases, build personal or shared collections, and manage visibility settings — all backed by secure role-based authentication.

Author: Kaycee Griffeth
Program: LaunchCode FlexPath — Full-Stack Java + Spring Boot + React + MySQL

⚙️ Tech Stack
Frontend
-React (Vite)
-React Router
-Bootstrap 5
-Jest + React Testing Library

Backend
-Java 17
-Spring Boot 3
-Spring Security (Role-based access)
-JPA / Hibernate
-JUnit + Jacoco

Database
-MySQL 8
--SQL schema + seed scripts included

✨ Key Features
🔍 Browse crime case database with search + sorting
📁 Create personal or public collections
🛡️ Secure login with roles: User + Admin
➕ Add, edit, delete items and groups
🌐 Public vs private visibility controls
📱 Responsive frontend UI
🔗 Integrated REST API with React
🚀 Local Setup

[[Backend]]
cd backend
mvn spring-boot:run

[[Frontend]]
cd frontend
npm install
npm run dev

Then open:
👉 http://localhost:3000

🧪 Running Tests
[[Frontend]]
npm test -- --coverage
[[Backend]]
mvn test

🧠 Project Highlights
-Demonstrates full CRUD workflow across items and collections
-Uses Spring Security for authentication + authorization
-Implements MySQL schema with foreign keys and seed data
-Strong React component structure + routing
-Realistic full-stack integration (Java API ↔ React UI)
