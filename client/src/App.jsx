import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Rsvp from './pages/Rsvp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/confirmacao/:token" element={<Rsvp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
