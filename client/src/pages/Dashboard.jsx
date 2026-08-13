import { useState, useEffect } from 'react';
import { Copy, Plus, CheckCircle, Clock, XCircle, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Dashboard() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGuest, setNewGuest] = useState({ name: '', weight: 1, diaperSize: 'P', showPixSuggestion: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/guests`);
      const data = await res.json();
      setGuests(data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuest.name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuest),
      });

      if (res.ok) {
        setNewGuest({ name: '', weight: 1, diaperSize: 'P', showPixSuggestion: false });
        fetchGuests();
      }
    } catch (error) {
      console.error('Error adding guest:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (token) => {
    const url = `${window.location.origin}/confirmacao/${token}`;
    navigator.clipboard.writeText(url);
    alert('Link copiado: ' + url);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0: return <span className="badge badge-pending flex items-center gap-2"><Clock size={14} /> Pendente</span>;
      case 1: return <span className="badge badge-confirmed flex items-center gap-2"><CheckCircle size={14} /> Confirmado</span>;
      case 2: return <span className="badge badge-declined flex items-center gap-2"><XCircle size={14} /> Recusado</span>;
      default: return null;
    }
  };

  const getGuestWeight = (guest) => Math.max(Number(guest.weight) || 1, 1);
  const getDiaperSuggestion = (diaperSize) => `Fralda ${diaperSize || 'P'} Huggies`;
  const totalCount = guests.reduce((sum, guest) => sum + getGuestWeight(guest), 0);
  const confirmedCount = guests
    .filter(g => g.status === 1)
    .reduce((sum, guest) => sum + getGuestWeight(guest), 0);
  const declinedCount = guests
    .filter(g => g.status === 2)
    .reduce((sum, guest) => sum + getGuestWeight(guest), 0);
  const pendingCount = guests
    .filter(g => g.status === 0)
    .reduce((sum, guest) => sum + getGuestWeight(guest), 0);

  return (
    <div className="container dashboard-page animate-fade-in-up">
      <div className="dashboard-header text-center mb-8">
        <h1 className="event-logo-heading">
          <img
            className="event-logo"
            src="/logo title.png"
            alt="Chá de bebê da Elena — dia 20/09/2026 às 11h"
          />
        </h1>
        <p style={{ color: 'var(--color-text-light)' }}>Gerencie seus convidados e acompanhe as confirmações de presença.</p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats gap-4 mb-8">
        <div className="card stat-card text-center">
          <Users size={32} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem' }} />
          <h3>{totalCount}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Pessoas</p>
        </div>
        <div className="card stat-card text-center">
          <CheckCircle size={32} color="var(--color-success)" style={{ margin: '0 auto 0.5rem' }} />
          <h3>{confirmedCount}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Confirmados</p>
        </div>
        <div className="card stat-card text-center">
          <XCircle size={32} color="var(--color-danger)" style={{ margin: '0 auto 0.5rem' }} />
          <h3>{declinedCount}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Recusados</p>
        </div>
        <div className="card stat-card text-center">
          <Clock size={32} color="#b08a1c" style={{ margin: '0 auto 0.5rem' }} />
          <h3>{pendingCount}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Pendentes</p>
        </div>
      </div>

      {/* Add Guest Form */}
      <div className="card guest-form-card mb-8">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={24} color="var(--color-primary)" /> Adicionar Convidado
        </h2>
        <form onSubmit={handleAddGuest} className="guest-form flex gap-4">
          <div className="guest-form-field">
            <input
              type="text"
              placeholder="Nome do convidado"
              value={newGuest.name}
              onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              required
            />
          </div>
          <div className="guest-form-field">
            <input
              type="number"
              placeholder="Peso do convite"
              value={newGuest.weight}
              min="1"
              max="99"
              onChange={(e) => {
                const weight = Math.min(Math.max(Number(e.target.value) || 1, 1), 99);
                setNewGuest({ ...newGuest, weight });
              }}
              required
            />
          </div>
          <div className="guest-form-field">
            <select
              value={newGuest.diaperSize}
              onChange={(e) => setNewGuest({ ...newGuest, diaperSize: e.target.value })}
              required
            >
              <option value="P">P</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
            </select>
          </div>
          <label className="guest-checkbox-field">
            <input
              type="checkbox"
              checked={newGuest.showPixSuggestion}
              onChange={(e) => setNewGuest({ ...newGuest, showPixSuggestion: e.target.checked })}
            />
            Sugestao
          </label>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            Adicionar
          </button>
        </form>
      </div>

      {/* Guest List */}
      <div className="card guest-list-card">
        <h2 style={{ marginBottom: '1.5rem' }}>Lista de Convidados</h2>

        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : guests.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--color-text-light)' }}>Nenhum convidado adicionado ainda.</p>
        ) : (
          <div className="guest-table-wrapper">
            <table className="guest-table">
              <thead>
                <tr style={{ borderBottom: '2px solid #eaeaea' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Nome</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Pessoas</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Sugestao</th>
                  <th style={{ padding: '1rem 0.5rem' }}>PIX</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Mensagem</th>
                  <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td className="guest-name-cell" data-label="Nome" style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>
                      <div>
                        {guest.name}
                      </div>
                    </td>
                    <td data-label="Pessoas" style={{ padding: '1rem 0.5rem' }}>{getGuestWeight(guest)}</td>
                    <td data-label="Sugestao" style={{ padding: '1rem 0.5rem' }}>{getDiaperSuggestion(guest.diaperSize)}</td>
                    <td data-label="PIX" style={{ padding: '1rem 0.5rem' }}>{guest.showPixSuggestion ? 'Sim' : 'Nao'}</td>
                    <td data-label="Status" style={{ padding: '1rem 0.5rem' }}>{getStatusBadge(guest.status)}</td>
                    <td data-label="Mensagem" style={{ padding: '1rem 0.5rem', fontSize: '0.9rem', maxWidth: '200px' }}>
                      {guest.message ? `"${guest.message}"` : '-'}
                    </td>
                    <td className="guest-action-cell" data-label="Ação" style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => copyToClipboard(guest.token)}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      >
                        <Copy size={16} /> Link
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
