import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckAuth from "./components/AuthCheck.tsx";
import Tickets from "./pages/Tickets.tsx";
import Ticket from "./pages/Ticket.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Admin from "./pages/Admin.tsx";
import CreateTicket from "./pages/CreateTicket.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/Login"
          element={
            <CheckAuth isProtected={false}>
              <Login />
            </CheckAuth>
          }
        />

        <Route
          path="/register"
          element={
            <CheckAuth isProtected={false}>
              <Register />
            </CheckAuth>
          }
        />

        <Route
          path="/"
          element={
            <CheckAuth isProtected={true}>
              <Tickets />
            </CheckAuth>
          }
        />

        <Route
          path="/create"
          element={
            <CheckAuth isProtected={true}>
              <CreateTicket />
            </CheckAuth>
          }
        />

        <Route
          path="/ticket/:id"
          element={
            <CheckAuth isProtected={true}>
              <Ticket />
            </CheckAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <CheckAuth isProtected={true}>
              <Admin />
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
