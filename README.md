# LuxeStay - Hotel Booking Platform

LuxeStay is a luxury hotel booking web application built using Next.js (frontend) and Node.js/Express (backend) with a PostgreSQL database.

---

## Prerequisites

Before setting up the project, make sure you have the following installed:
*   **Node.js** (v18.x or higher recommended)
*   **npm** (Node Package Manager)
*   **PostgreSQL** (v14.x or higher recommended)

---

## Project Structure

```text
Project01/
├── backend/    # Express.js server, routes, controllers, database models, and seeding scripts
└── frontend/   # Next.js web application using modern TailwindCSS and TypeScript
```

---

## Installation & Setup Instructions

### 1. Database Setup

1. Start your local PostgreSQL server.
2. Log into PostgreSQL and create a new database named `hotelBooking`:
   ```sql
   CREATE DATABASE "hotelBooking";
   ```

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `backend` directory (if not already present) with the following environment variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_NAME=hotelBooking
   JWT_SECRET=your_jwt_secret_key
   ```
   *Replace `your_postgres_password` with your real PostgreSQL password, and `your_jwt_secret_key` with a secure key (e.g., for JWT signature verification).*

4. Start the backend development server (this will run database seeding and schema migration checks automatically):
   ```bash
   npm run dev
   ```
   *Note: On startup, the backend checks for required database tables (`owners`, `hotels`, `rooms`, `bookings`, `users`) and automatically creates them and seeds initial demo listings.*

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Verification & Usage

### Guest Booking Flow
1. Navigate to the **Hotels** page.
2. Select a hotel to view details and available rooms.
3. Click **Book Now** or **Reserve** on a room.
4. Fill out guest details, proceed to payment step, and click **Confirm & Pay**.
5. Once payment is confirmed, the reservation will be stored in the database. You can view it in the **My Bookings** page when logged in.

### Owner Dashboard Flow
1. Navigate to [http://localhost:3000/owners/login](http://localhost:3000/owners/login).
2. Register a partner owner account or log in with existing business details.
3. Use the dashboard tabs to:
   *   **Overview**: View listings count, bookings count, and total revenue.
   *   **Add Hotel**: List a new hotel property.
   *   **Add Rooms**: Add room configurations to existing properties.
   *   **My Bookings**: View live guest reservation lists, checkout dates, and details from the database.
