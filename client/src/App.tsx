import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { AdminPanel } from "./components/AdminPanel";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { NotificationToast } from "./components/NotificationToast";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./stores/authStore";
import ScrollToTop from "./components/ScrollToTopp";

function App() {
  const { checkTokenExpiration } = useAuthStore();

  useEffect(() => {
    // Check token expiration on app load
    checkTokenExpiration();

    // Set up periodic token checking every 5 minutes
    const interval = setInterval(
      () => {
        checkTokenExpiration();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main
        className={`flex-grow ${"pt-[130px]"} min-h-[97vh] max-w-screen overflow-hidden`}
      >
        <AppRoutes />
      </main>
      <Footer />
      <AdminPanel />
      <NotificationToast />
    </Router>
  );
}

export default App;
