import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Rsvp from './pages/Rsvp';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/confirmacao/:token" element={<Rsvp />} />
          </Routes>
        </main>
        <footer className="development-note">
          Desenvolvido por:{' '}
          <a
            href="https://lucas-bozyk-capoani.vercel.app"
            target="_blank"
            rel="noreferrer"
          >
            Lucas Bozyk
          </a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
