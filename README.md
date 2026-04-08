# Simple User Manager – REST API + UI

A lightweight web application that demonstrates a **REST API** built with Node.js and Express, paired with a clean frontend interface.  
Users can be **created**, **listed**, and **deleted** – all data is stored in‑memory (no database required).

---

## ✨ Features

### Backend (REST API)
- `GET /users` – retrieve all users
- `POST /users` – add a new user with validation:
  - Name and email are required
  - Email must be in valid format (`user@example.com`)
  - No duplicate emails allowed
- `DELETE /users/:id` – remove a user by ID
- In‑memory storage (array) – resets when server restarts

### Frontend (UI)
- Clean, responsive interface (HTML, CSS, JavaScript)
- Form to add new users with real‑time validation
- Automatic display of all users in a list
- Delete button next to each user
- Error messages for invalid input or duplicate emails

---

## 🛠️ Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – web framework
- **HTML5 / CSS3** – structure and styling
- **Vanilla JavaScript** – client‑side logic (Fetch API)

---

## 📁 Project Structure
