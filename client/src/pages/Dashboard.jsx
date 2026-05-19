import { useState, useEffect } from 'react';
import { Copy, Plus, CheckCircle, Clock, XCircle, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Dashboard() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGuest, setNewGuest] = useState({ name: '', contact: '' });
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
        setNewGuest({ name: '', contact: '' });
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

  const confirmedCount = guests.filter(g => g.status === 1).length;
  const declinedCount = guests.filter(g => g.status === 2).length;
  const pendingCount = guests.filter(g => g.status === 0).length;

  return (
    <div className="container animate-fade-in-up">
      <div className="text-center mb-8">
        <h1 style={{ color: 'var(--color-primary-dark)', fontSize: '2.5rem' }}>🍼 Painel do Chá Revelação</h1>
        <p style={{ color: 'var(--color-text-light)' }}>Gerencie seus convidados e acompanhe as confirmações de presença.</p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <Users size={32} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem' }} />
          <h3>{guests.length}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Total</p>
        </div>
        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <CheckCircle size={32} color="var(--color-success)" style={{ margin: '0 auto 0.5rem' }} />
          <h3>{confirmedCount}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Confirmados</p>
        </div>
        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <XCircle size={32} color="var(--color-danger)" style={{ margin: '0 auto 0.5rem' }} />
          <h3>{declinedCount}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Recusados</p>
        </div>
        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <Clock size={32} color="#b08a1c" style={{ margin: '0 auto 0.5rem' }} />
          <h3>{pendingCount}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Pendentes</p>
        </div>
      </div>

      {/* Add Guest Form */}
      <div className="card mb-8">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={24} color="var(--color-primary)" /> Adicionar Convidado
        </h2>
        <form onSubmit={handleAddGuest} className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <input
              type="text"
              placeholder="Nome do convidado"
              value={newGuest.name}
              onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              required
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <input
              type="tel"
              placeholder="WhatsApp (ex: 11999998888)"
              value={newGuest.contact}
              maxLength={11}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                setNewGuest({ ...newGuest, contact: onlyNums });
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            Adicionar
          </button>
        </form>
      </div>

      {/* Guest List */}
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Lista de Convidados</h2>

        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : guests.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--color-text-light)' }}>Nenhum convidado adicionado ainda.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eaeaea' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Nome</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Mensagem</th>
                  <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>
                      {guest.name}
                      {guest.contact && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', fontWeight: 'normal' }}>{guest.contact}</div>}
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>{getStatusBadge(guest.status)}</td>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem', maxWidth: '200px' }}>
                      {guest.message ? `"${guest.message}"` : '-'}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
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
