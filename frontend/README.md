1. What RESEATO really is (plain explanation)

RESEATO is basically an OpenTable-style website, but localized for Philippine restaurants, especially busy areas like SM Seaside Cebu.

Its main purpose is to replace manual reservations (walk-ins, phone calls, paper lists) with a single web-based reservation system.

The core problems it solves:

Long waiting lines

Double bookings

Confused staff

Customers not knowing if a table is available

Poor coordination during peak hours

So the website becomes a middleman between:

Customers (diners)

Restaurants (vendors)

Platform admin (you / system owner)

2. Who will use the website (very important for design)

Your website has 3 types of users, not just one.

1️⃣ Customers / Diners

They want:

To browse restaurants

Check availability

Reserve a table

Pay online

Get directions via Google Maps

Avoid waiting in line

👉 Customer-facing website (frontend-heavy)

2️⃣ Restaurant Owners / Managers (Vendors)

They want:

To see today’s reservations

Accept / reject bookings

Manage tables

See customer notes

Reduce chaos during peak hours

👉 Dashboard-style interface

3️⃣ Admin (You / Platform Owner)

They want:

To manage restaurants

Monitor reservations

Manage users

Track commission (₱30 per booking)

👉 Back-office admin panel

3. What the website must DO (functional breakdown)

Based on the paper, your website must include these core modules:

🔹 A. Customer Side (Public Website)

This is what most people see.

1. Browse Restaurants

List of restaurants

Filters:

Cuisine

Location

Rating

Open now

Search bar

📌 This is your homepage / discovery page

2. Restaurant Details Page

Each restaurant has:

Photos

Description

Address

Operating hours

Rating

“Reserve a Table” button

Google Maps integration

📌 Very similar to Booking.com or Airbnb listing pages

3. Reservation Form

Customer selects:

Date

Time

Number of guests

Special notes (birthday, dietary needs, etc.)

📌 This is where logic matters (available tables, time slots).

4. Reservation Status Page

After booking:

Show summary

Status:

Pending

Confirmed

Cancelled

Email notification

📌 Builds trust in the system.

5. My Reservations

Customer can:

View upcoming reservations

See past bookings

Cancel if allowed

🔹 B. Restaurant (Vendor) Dashboard

This is a private login area.

1. Today Overview Dashboard

Shows:

Total reservations today

Confirmed / Pending / Cancelled

Time-based list of bookings

📌 This replaces paper logbooks.

2. Reservation Management

Restaurant can:

Confirm or reject bookings

Read customer notes

Prepare seating in advance

📌 This is where waiting time is reduced.

3. Settings

Restaurant info

Table capacity

Operating hours

🔹 C. Admin Panel

For platform control.

Admin can:

Approve restaurants

Manage users

View all reservations

Track commission revenue

Enable / disable restaurants

📌 This is critical for monetization.

4. Business model (how this website earns)

Very simple and realistic:

💰 ₱30 commission per successful reservation

Customer pays normally (or pays restaurant)

Platform takes ₱30 per booking

Scales well if many restaurants join

📌 This is why:

Secure payment

Booking validation
are emphasized in the study.

5. Why this study exists (important for capstone & pitching)

The paper keeps saying one thing:

“Digital tools exist, but local restaurants don’t use them properly.”

So RESEATO:

Is localized

Focuses on dine-in, not delivery

Targets busy malls

Designed for non-techy restaurant staff

That’s why:

Simple UI

Clear dashboards

Automated workflows
are emphasized.

6. If YOU are going to build this website, here’s the real takeaway
Minimum Viable Version (MVP)

If you’re building this as a project:

You must have:

Customer reservation flow

Restaurant dashboard

Admin panel

Real-time availability logic

Google Maps integration

You can add later:

Pre-order food

Loyalty points

Advanced analytics

7. Tech-wise (based on your background)

Since I know you work with:

Angular

NestJS

Flask

SQL

A good stack would be:

Frontend: Angular / React

Backend: NestJS or Flask

Database: MySQL / PostgreSQL

Maps: Google Maps API

Payments: GCash / PayMaya (later)



reseato/
├── frontend/                          # React + TypeScript Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/                    # Images, fonts, static files
│   │   │   ├── fonts/
│   │   │   └── images/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── restaurant/
│   │   │   │   ├── RestaurantCard.tsx
│   │   │   │   ├── RestaurantGrid.tsx
│   │   │   │   ├── RestaurantFilters.tsx
│   │   │   │   └── RestaurantMap.tsx
│   │   │   └── reservation/
│   │   │       ├── ReservationForm.tsx
│   │   │       ├── TimeSlotPicker.tsx
│   │   │       ├── GuestSelector.tsx
│   │   │       └── ReservationCard.tsx
│   │   ├── pages/                     # Page components
│   │   │   ├── customer/
│   │   │   │   ├── HomePage.tsx       # Browse restaurants
│   │   │   │   ├── RestaurantDetailPage.tsx
│   │   │   │   ├── ReservationPage.tsx
│   │   │   │   ├── MyReservationsPage.tsx
│   │   │   │   └── ProfilePage.tsx
│   │   │   ├── vendor/
│   │   │   │   ├── DashboardPage.tsx  # Today's overview
│   │   │   │   ├── ReservationsPage.tsx
│   │   │   │   ├── TablesPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── RestaurantsPage.tsx
│   │   │   │   ├── UsersPage.tsx
│   │   │   │   └── RevenueePage.tsx
│   │   │   └── auth/
│   │   │       ├── LoginPage.tsx
│   │   │       ├── RegisterPage.tsx
│   │   │       └── ForgotPasswordPage.tsx
│   │   ├── layouts/                   # Layout wrappers
│   │   │   ├── CustomerLayout.tsx
│   │   │   ├── VendorLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useRestaurants.ts
│   │   │   ├── useReservations.ts
│   │   │   └── useDebounce.ts
│   │   ├── context/                   # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── services/                  # API calls
│   │   │   ├── api.ts                 # Axios instance
│   │   │   ├── authService.ts
│   │   │   ├── restaurantService.ts
│   │   │   ├── reservationService.ts
│   │   │   └── paymentService.ts
│   │   ├── types/                     # TypeScript types
│   │   │   ├── user.types.ts
│   │   │   ├── restaurant.types.ts
│   │   │   ├── reservation.types.ts
│   │   │   └── common.types.ts
│   │   ├── utils/                     # Utility functions
│   │   │   ├── dateUtils.ts
│   │   │   ├── validation.ts
│   │   │   └── formatters.ts
│   │   ├── styles/                    # Global styles
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   └── animations.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/                    # Configuration
│   │   │   ├── database.ts            # PostgreSQL connection
│   │   │   ├── env.ts                 # Environment variables
│   │   │   └── cors.ts
│   │   ├── controllers/               # Route handlers
│   │   │   ├── authController.ts
│   │   │   ├── restaurantController.ts
│   │   │   ├── reservationController.ts
│   │   │   ├── userController.ts
│   │   │   └── adminController.ts
│   │   ├── models/                    # Database models
│   │   │   ├── User.ts
│   │   │   ├── Restaurant.ts
│   │   │   ├── Reservation.ts
│   │   │   ├── Table.ts
│   │   │   └── Payment.ts
│   │   ├── routes/                    # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── restaurantRoutes.ts
│   │   │   ├── reservationRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   ├── middleware/                # Express middleware
│   │   │   ├── auth.ts                # JWT authentication
│   │   │   ├── errorHandler.ts
│   │   │   ├── validation.ts
│   │   │   └── roleCheck.ts
│   │   ├── services/                  # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── restaurantService.ts
│   │   │   ├── reservationService.ts
│   │   │   ├── emailService.ts
│   │   │   └── paymentService.ts
│   │   ├── utils/                     # Utility functions
│   │   │   ├── jwt.ts
│   │   │   ├── bcrypt.ts
│   │   │   ├── validators.ts
│   │   │   └── timeSlots.ts
│   │   ├── types/                     # TypeScript types
│   │   │   ├── express.d.ts
│   │   │   └── models.types.ts
│   │   ├── database/                  # Database scripts
│   │   │   ├── migrations/
│   │   │   │   ├── 001_create_users.sql
│   │   │   │   ├── 002_create_restaurants.sql
│   │   │   │   ├── 003_create_tables.sql
│   │   │   │   ├── 004_create_reservations.sql
│   │   │   │   └── 005_create_payments.sql
│   │   │   └── seeds/
│   │   │       └── initial_data.sql
│   │   ├── app.ts                     # Express app setup
│   │   └── server.ts                  # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── shared/                            # Shared types between frontend/backend
│   ├── types/
│   │   ├── api.types.ts
│   │   └── dto.types.ts
│   └── constants/
│       └── index.ts
│
└── README.md


