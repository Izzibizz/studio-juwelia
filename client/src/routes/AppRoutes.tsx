import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { About } from "../pages/About";
import { Contact } from "../pages/Contact";
import { Art } from "../pages/Art";
import { Tattoos } from "../pages/Tattoos";
import { Booking } from "../pages/Booking";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/a-propos" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/oevres" element={<Art />} />
      <Route path="/tatouages" element={<Tattoos />} />
      <Route path="/prendre-rendez-vous" element={<Booking />} />
    </Routes>
  );
};

export default AppRoutes;
