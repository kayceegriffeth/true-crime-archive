True Crime Archive is a full-stack web application that lets users explore and organize true-crime cases. It includes a Java Spring Boot backend, a React frontend, and a MySQL database populated automatically through a single data.sql file. This project demonstrates full-stack development, REST API design, database modeling, role-based UI behavior, and automated testing on both the frontend and backend.
_______________________________________________________________________________________
⚙️ Tech Stack
Frontend
- React (Vite)
- React Router
- Bootstrap 5

Backend
- Java 17
- Spring Boot 3
- Spring Data JPA (Hibernate)
- Spring Web

Database
- MySQL 8+
- Single data.sql file (creates tables & loads all sample data.

Testing
- Jest + React Testing Library
- JUnit
_______________________________________________________________________________________
✨ Key Features
- Browse a database of true-crime cases
- Explore sample collections (Cold Cases, Missing Persons, Serial Killers, etc.)
- Create and delete personal collections
- Fully responsive UI

🛠️ How to Run the App Locally

**Backend**
- cd backend
- mvn install
- mvn spring-boot:run

**Backend runs on:
👉 http://localhost:8080**

**Frontend**
- cd frontend
- npm install
- npm run dev

**Frontend runs on:
👉 http://localhost:3000**

🗄️ Database Setup
- Install MySQL
- Create an empty database:
        CREATE DATABASE truecrime;
- Run the backend — the database is created automatically from data.sql
_______________________________________________________________________________________
