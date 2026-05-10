# Traveloop - Smart Travel Command Center

Traveloop is a comprehensive travel planning application designed to streamline the "Plan → Organize → Budget → Visualize → Share" workflow.

## 🚀 Features

- **Personalized Itineraries**: Day-wise schedules with activity planning.
- **Budget Tracking**: Visual cost breakdown and health indicators.
- **Packing Management**: Categorized checklists with smart suggestions.
- **Public Sharing**: Share trips with friends via secure tokens.
- **Premium UI**: Glassmorphism design with smooth animations.

## 🛠 Tech Stack

- **Backend**: Spring Boot 3, MySQL, Spring Security (JWT), JPA/Hibernate.
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Zustand, Recharts.

## 🛠 Setup Instructions

### Backend Setup
1. Navigate to `Backend/demo`.
2. Ensure MySQL is running on `localhost:3306`.
3. Database `travelloop` will be created automatically.
4. Run:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to `Frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173).

## 📂 Project Structure

- `Backend/`: Spring Boot application code.
- `Frontend/`: React application code with Tailwind CSS.
