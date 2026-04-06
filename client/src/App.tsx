import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LogoutButton } from "./components/LogoutButton";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <Header />
      <main className={`flex-grow ${"pt-[110px]"} min-h-[97vh] `}>
        <AppRoutes />
      </main>
      <Footer />
      <LogoutButton />
    </Router>
  );
}

export default App;
