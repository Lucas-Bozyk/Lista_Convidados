import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, X, Heart, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Rsvp() {
  const { token } = useParams();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchGuest();
  }, [token]);

  const fetchGuest = async () => {
    try {
      const res = await fetch(`${API_URL}/api/guests/rsvp/${token}`);
      if (!res.ok) {
        throw new Error('Convite inválido ou não encontrado.');
      }
      const data = await res.json();
      setGuest(data);
      if (data.status !== 0) {
        setStatus(data.status);
        setMessage(data.message || '');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === null) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/guests/rsvp/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, message }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        throw new Error('Erro ao salvar resposta.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex justify-center items-center" style={{ minHeight: '100vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex justify-center items-center animate-fade-in-up" style={{ minHeight: '100vh' }}>
        <div className="card text-center text-danger" style={{ maxWidth: '400px' }}>
          <h2>Ops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container flex justify-center items-center animate-fade-in-up" style={{ minHeight: '100vh' }}>
        <div className="card text-center" style={{ maxWidth: '500px' }}>
          <Heart size={64} color="var(--color-secondary)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: 'var(--color-primary-dark)', fontSize: '2rem' }}>Obrigado!</h2>
          <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
            {status === 1
              ? 'Sua presença foi confirmada. Estamos muito felizes e ansiosos para te ver!'
              : 'Sentiremos sua falta, mas agradecemos por nos avisar.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex flex-col justify-center items-center animate-fade-in-up" style={{ minHeight: '100vh' }}>

      <div className="text-center mb-8">
        <h1 style={{ color: 'var(--color-primary-dark)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Chá Revelação 06/06 às 19:00
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)' }}>
          Olá, <strong>{guest.name}</strong>!
        </p>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-6" style={{ fontSize: '1.5rem' }}>Você irá comparecer?</h2>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => setStatus(1)}
              className="card text-center"
              style={{
                flex: 1,
                padding: '1.5rem',
                border: status === 1 ? '2px solid var(--color-success)' : '2px solid transparent',
                transform: status === 1 ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer'
              }}
            >
              <Check size={48} color="var(--color-success)" style={{ margin: '0 auto 0.5rem' }} />
              <h3 style={{ margin: 0, color: 'var(--color-success)' }}>Sim, eu vou!</h3>
            </button>

            <button
              type="button"
              onClick={() => setStatus(2)}
              className="card text-center"
              style={{
                flex: 1,
                padding: '1.5rem',
                border: status === 2 ? '2px solid var(--color-danger)' : '2px solid transparent',
                transform: status === 2 ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer'
              }}
            >
              <X size={48} color="var(--color-danger)" style={{ margin: '0 auto 0.5rem' }} />
              <h3 style={{ margin: 0, color: 'var(--color-danger)' }}>Não poderei ir</h3>
            </button>
          </div>

          <div className="mb-8">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Deixe uma mensagem para os pais (opcional)
            </label>
            <textarea
              rows="4"
              placeholder="Sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
            disabled={status === null || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar Resposta'}
          </button>
        </form>
      </div>

    </div>
  );
}
