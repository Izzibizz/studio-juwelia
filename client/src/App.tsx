import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { AdminPanel } from "./components/AdminPanel";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LogoutPopup } from "./components/LogoutPopup";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./stores/authStore";

function App() {
  const {
    checkTokenExpiration,
    showLogoutPopup,
    logoutMessage,
    hideLogoutPopup,
  } = useAuthStore();

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
      <Header />
      <main className={`flex-grow ${"pt-[110px]"} min-h-[97vh] `}>
        <AppRoutes />
      </main>
      <Footer />
      <AdminPanel />
      <LogoutPopup
        isOpen={showLogoutPopup}
        onClose={hideLogoutPopup}
        message={logoutMessage}
      />
    </Router>
  );
}

export default App;
