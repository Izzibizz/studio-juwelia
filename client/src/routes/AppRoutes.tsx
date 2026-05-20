import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { About } from "../pages/About";
import { Contact } from "../pages/Contact";
import { Art } from "../pages/Art";
import { Tattoos } from "../pages/Tattoos";
import { Booking } from "../pages/Booking";
import { NotFound } from "../pages/NotFound.tsx";
import { Login } from "../components/Login";
import { ForgotPassword } from "../components/ForgotPassword";
import { ResetPassword } from "../components/ResetPassword";
import { useAuthStore } from "../stores/authStore";
import { FAQ } from "../pages/FAQ.tsx";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/a-propos" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/oeuvres" element={<Art />} />
      <Route path="/tatouages" element={<Tattoos />} />
      <Route path="/prendre-rendez-vous" element={<Booking />} />
      <Route path="/FAQ" element={<FAQ />} />
      <Route
        path="/connexion"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
      <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
