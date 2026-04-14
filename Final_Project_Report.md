# Final Project Report: Eventify
## A Scalable REST-Driven Event Marketplace

---

### 1. Cover Page

*   **Project Title:** Eventify: A Scalable REST-Driven Event Marketplace
*   **Course Name:** [Course Name, e.g., CSE 3100 Database Management Systems]
*   **Student Name(s) & ID(s):** [Your Name] ([Your ID])
*   **Instructor Name:** [Instructor Name]
*   **Submission Date:** April 13, 2026

---

### 2. Abstract
**Eventify** is a multi-tenant event marketplace application designed to bridge the gap between event organizers and attendees through a robust, real-time platform. The project addresses the fragmentation in traditional event discovery and the lack of secure, atomic booking systems. Built with a decoupled architecture—leveraging a **Laravel REST API** for the backend and **React** for the frontend—the system ensures high performance and scalability. Key technologies include **MySQL** for relational data management, **Cloudinary** for media handling, and **Google Gemini AI** for intelligent event assistance. The system successfully implements complex database transactions, role-based access control, and dynamic analytics, providing a seamless end-to-end experience for hosting and attending events.

---

### 3. Introduction
In an increasingly digital world, the organization and discovery of events (ranging from workshops to large-scale concerts) remain surprisingly fragmented. Manual booking processes and lack of real-time seat/ticket availability updates lead to user frustration and lost revenue for organizers.

**Eventify** aims to solve this societal issue by providing a centralized, transparent, and efficient marketplace. By digitizing the entire lifecycle of an event—from creation and ticket pricing to secure checkout and attendance tracking—the project empowers local communities and businesses to host events with professional-grade tools.

**Objectives:**
- Develop a normalized database schema to ensure data integrity and minimize redundancy.
- Implement an atomic booking engine that prevents over-allocation of tickets.
- Provide organizers with real-time data visualization of sales and attendance.
- Integrate AI to assist users in event discovery and query resolution.

---

### 4. Problem Statement
**The Problem:**
Real-world event organizers often struggle with managing multiple ticket types, tracking diverse payment methods, and reaching their target audience efficiently. On the other hand, attendees face difficulties finding local events and often encounter "scalping" or data inconsistency in booking platforms.

**Who is affected?**
- **Local Communities:** Limited access to organized event information.
- **Small Business Organizers:** High barrier to entry for digital ticketing systems.
- **Attendees:** Risk of fraudulent tickets and lack of centralized history.

**Current Limitations:**
Many existing systems are either too expensive for small organizers or lack the technical robustness to handle high-concurrency ticket releases, leading to race conditions where more tickets are sold than available.

---

### 5. System Overview
Eventify is a full-stack web application that utilizes a microservice-ready architecture. The system is split into:
- **Backend:** Laravel PHP Framework serving as a RESTful API.
- **Frontend:** React.js for a dynamic, single-page application (SPA) experience.
- **Database:** MySQL relational database.

**Key Features:**
1.  **Atomic Booking:** Ensures ticket quantities are accurately decremented during simultaneous purchases.
2.  **Organizer Dashboard:** Visual metrics for total events, attendees, and revenue.
3.  **AI Virtual Assistant:** A Gemini-powered chatbot for 24/7 user support.
4.  **Role-Based Access:** Distinct features for Organizers and Attendees.

---

### 6. Database Design
#### Entity Relationship Diagram (ERD)
The database consists of 8 core entities designed for maximum normalization:

1.  **Users:** Stores credentials, contact info, and role IDs.
2.  **Categories:** Defines event genres (Tech, Music, Arts).
3.  **Venues:** Physical or virtual locations with capacity constraints.
4.  **Events:** The central entity linking organizers, venues, and categories.
5.  **Tickets:** Specific pricing and quantity tiers for an event.
6.  **Bookings:** Maps users to their purchased tickets.
7.  **Payments:** Financial records for each booking.
8.  **Reviews:** Feedback mechanism for attendees.

**Key Relationships:**
- **One-to-Many (1:N):** An Organizer hosts many Events; an Event has many Tickets.
- **Many-to-Many (M:N):** Handled via the `Bookings` junction table (Users booking multiple Tickets).

---

### 7. Implementation
#### Tools and Technologies
- **Language:** PHP 8.2 (Backend), JavaScript/ES6+ (Frontend)
- **Database:** MySQL 8.0
- **Environment:** Docker containers for consistent deployment.

#### Sample SQL Queries

**1. Table Creation (Events):**
```sql
CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  description VARCHAR(100),
  start_date_time VARCHAR(50),
  venue_id INT,
  category_id INT,
  user_id INT,
  FOREIGN KEY (venue_id) REFERENCES venue(venue_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

**2. Complex Analytics (JOIN & GROUP BY):**
This query calculates total revenue and attendance for an organizer in a single call:
```sql
SELECT 
    COUNT(DISTINCT events.event_id) as total_events,
    COUNT(bookings.booking_id) as total_attendees,
    SUM(CASE WHEN bookings.booking_id IS NOT NULL 
        THEN COALESCE(payments.pay_amount, tickets.price, 0) 
        ELSE 0 END) as total_revenue
FROM events
JOIN tickets ON events.event_id = tickets.event_id
LEFT JOIN bookings ON tickets.ticket_id = bookings.ticket_id
LEFT JOIN payments ON bookings.booking_id = payments.booking_id
WHERE events.user_id = [Organizer_ID];
```

---

### 8. Application Development
The application is built on a **Decoupled Architecture**:
- **API First:** The Laravel backend serves as a standalone API, allowing for future mobile app integration.
- **State Management:** React Context and Hooks are used to manage user authentication and booking states globally.
- **Consistency:** Tailwind CSS is used for a premium, responsive UI that adjusts to desktop and mobile screens.
- **AI Integration:** The system communicates with Google Gemini via asynchronous API calls to provide real-time event descriptions and chat responses.

---

### 9. System Features (With Screenshots)

#### 9.1 User Landing Page
> [SCREENSHOT: Landing Page showing event cards and search bar]
**Caption:** Event Discovery Dashboard.
**Explanation:** Users can browse all live events, filter by category, and search for specific titles.

#### 9.2 Event Detail & Booking
> [SCREENSHOT: Event Details page with ticket selection]
**Caption:** Detailed View & Ticket Picker.
**Explanation:** Displays venue information, event timing, and allows users to select ticket tiers.

#### 9.3 Organizer Dashboard
> [SCREENSHOT: Dashboard showing Total Revenue and Attendance metrics]
**Caption:** Hosting Analytics.
**Explanation:** Real-time summary of event success for organizers using optimized SQL aggregation.

#### 9.4 AI Chatbot
> [SCREENSHOT: Chat widget with AI response]
**Caption:** Eventify AI Assistant.
**Explanation:** Powered by Gemini, helping users find relevant events through natural language.

---

### 10. Sustainable Development Impact
- **Society:** Promotes local culture and community building by making events more accessible.
- **Environment:** Reduces paper waste through E-Ticketing and digital QR check-ins.
- **Economy:** Enables small-scale entrepreneurs to monetize their skills and host events with minimal overhead.

---

### 11. UN SDGs Mapping
1.  **SDG 8: Decent Work and Economic Growth:** By providing a marketplace for host-led events, Eventify supports entrepreneurship and economic productivity.
2.  **SDG 9: Industry, Innovation, and Infrastructure:** Utilizing AI and cloud technology to innovate traditional event ticketing infrastructure.
3.  **SDG 11: Sustainable Cities and Communities:** Strengthening community engagement through centralized event discovery.

---

### 12. Challenges & Limitations
**Challenges:**
- **Concurrency:** Handling 100+ simultaneous bookings during high-demand releases required implementing `DB::transaction` with `lockForUpdate`.
- **Media Hosting:** Transitioning from local storage to Cloudinary for scalable image management.

**Limitations:**
- Current system lacks a native payment gateway (simulated for now).
- No waitlist feature for sold-out events.

---

### 13. Conclusion & Future Work
**Summary:**
Eventify successfully implements a high-integrity database and a scalable web architecture to solve event discovery fragmentation.

**Achievements:**
- Built a secure, role-based multi-tenant platform.
- Integrated AI to enhance user engagement.
- Developed efficient SQL logic for real-time analytics.

**Future Improvements:**
- **QR Code integration:** Direct scan check-ins.
- **Stripe Integration:** For actual financial transactions.
- **Mobile App:** Converting the React frontend into a PWA or React Native app.
