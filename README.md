True Crime Archive is a full-stack web application that lets users explore, organize, and analyze true-crime cases. It includes a Java Spring Boot backend, a React frontend, and a MySQL database with pre-loaded sample data.
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
- MySQL Connector/J
- Spring Web

Database
- MySQL 8+
- Automatic schema generation (Hibernate)
- data.sql for sample data

Testing
- Jest + React Testing Library
- JUnit
_______________________________________________________________________________________
✨ Key Features
- Browse a database of true-crime cases
- Explore sample collections (Cold Cases, Missing Persons, Serial Killers, etc.)
- Create, edit, and delete personal collections
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
- Update your MySQL username/password inside:
        backend/src/main/resources/application.properties
Run the backend — the database is created and populated automatically from data.sql
_______________________________________________________________________________________
