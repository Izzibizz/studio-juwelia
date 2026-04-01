
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <Header />
      <main className={`flex-grow ${"pt-38 laptop:pt-24"} min-h-[97vh] `}>
        <AppRoutes />
      </main>
      <Footer />
    </Router>
  );
}

export default App;
