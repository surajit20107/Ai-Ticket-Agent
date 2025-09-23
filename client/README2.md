# AI-Ticket-Agent Frontend Documentation

Welcome to the frontend documentation for **AI-Ticket-Agent**! This guide covers everything you need to get started, configure, and contribute to the frontend portion located in the `client` directory.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Scripts & Commands](#scripts--commands)
- [Key Features](#key-features)
- [Contributing](#contributing)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [License](#license)

---

## Overview

The frontend of AI-Ticket-Agent provides an intuitive interface for users to interact with the AI-powered ticketing system. It communicates with the backend API to create, manage, and track tickets, leveraging modern UI/UX best practices.

---

## Tech Stack

- **Framework:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Communication:** Axios

---

## Setup & Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/surajit20107/Ai-Ticket-Agent.git
   cd Ai-Ticket-Agent/client
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `client` folder and add the required variables (see [Environment Configuration](#environment-configuration)).

4. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the App:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```plaintext
client/
├── public/                # Static files and assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages/routes
├── main.tsx               # Entry point for frontend
├── style.css              # Stylesheet for frontend
├── .env                   # Local environment variables
├── package.json
└── README.md
```

---

## Environment Configuration

Create a `.env` file for local development. Example:

```env
VITE_BACKEND_URL=http://localhost:3000/api
REACT_APP_AUTH_TOKEN=your-token
# Add other relevant keys as needed
```

---

## Scripts & Commands

- `npm run dev` / `yarn dev` — Start the development server
- `npm run build` / `yarn build` — Build for production
- `npm run lint` / `yarn lint` — Lint code for formatting and errors
- `npm test` / `yarn test` — Run unit tests

---

## Key Features

- **AI-powered ticket creation**
- **Real-time ticket tracking**
- **User authentication and roles**
- **Responsive design**
- **Notifications and alerts**

---

## Contributing

1. **Fork the repository**
2. **Create a new branch** for your feature or bugfix
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Make your changes**
4. **Run tests and lint**
5. **Commit & push your changes**
6. **Open a Pull Request**

Please follow the [Code of Conduct](../CODE_OF_CONDUCT.md) and the [Contributing Guidelines](../CONTRIBUTING.md).

---

## Troubleshooting & FAQ

- **App won't start?**  
  Ensure your environment variables are set and dependencies installed.

- **API errors?**  
  Check your `VITE_BACKEND_URL` and backend status.

- **Styling issues?**  
  Make sure your styling dependencies are installed and imported correctly.

---

## License

This project is licensed under the [MIT License](../LICENSE).

---

**Maintainer:** [surajit](https://github.com/surajit20107)

For questions or support, open an issue or reach out via GitHub.
