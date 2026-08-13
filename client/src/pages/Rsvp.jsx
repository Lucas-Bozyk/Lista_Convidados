import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, X, Heart, Loader2, MapPin, Copy, Info } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';
const MAPS_URL = 'https://maps.app.goo.gl/6a6B8FD8BA67sxqa9';
const getDiaperSuggestion = (diaperSize) => `Fralda ${diaperSize || 'P'} Huggies`;

export default function Rsvp() {
  const { token } = useParams();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const copyPixKey = () => {
    if (!guest?.pixKey) return;
    navigator.clipboard.writeText(guest.pixKey);
    alert('Chave PIX copiada.');
  };

  const EventInfo = ({ showInvitation = true }) => (
    <div className="rsvp-intro text-center">
      <h1 className="event-logo-heading">
        <img
          className="event-logo"
          src="/logo title.png"
          alt="Cha de bebe da Elena - dia 20/09/2026 as 11h"
        />
      </h1>
      <div className="event-location">
        <div className="event-location-text">
          <MapPin size={18} aria-hidden="true" />
          <span>
            Estancia Santa Barbara
            <small>Rua Canabura - Lacio, Marilia - SP</small>
          </span>
        </div>
        <a className="btn event-location-button" href={MAPS_URL} target="_blank" rel="noreferrer">
          Abrir no Maps
        </a>
      </div>
      {showInvitation && (
        <p className="rsvp-invitation">
          Com muita alegria, queremos convidar voce para celebrar a chegada da Elena
          e fazer parte deste momento tao especial para a nossa familia.
          Sua presenca tornara esse dia ainda mais inesquecivel!
        </p>
      )}
      <p className="diaper-suggestion">
        Sugestao de presente: {getDiaperSuggestion(guest.diaperSize)}
      </p>
      <p className="beverage-notice">
        <Info size={16} aria-hidden="true" />
        <span>Optamos por nao servir bebidas alcoolicas, mas cada convidado pode trazer a bebida que preferir.</span>
      </p>
    </div>
  );

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
        setIsSuccess(true);
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
        const data = await res.json();
        setGuest(data);
        setStatus(data.status);
        setMessage(data.message || '');
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
      <div className="container rsvp-page flex flex-col items-center animate-fade-in-up">
        {status === 1 && <EventInfo showInvitation={false} />}

        <div className="card rsvp-card text-center">
          <Heart size={64} color="var(--color-secondary)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: 'var(--color-primary-dark)', fontSize: '2rem' }}>Obrigado!</h2>
          <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
            {status === 1
              ? 'Sua presença foi confirmada. Estamos muito felizes e ansiosos para te ver!'
              : 'Obrigada por nos avisar! Sentiremos muito a sua falta nesse dia tão especial, mas agradecemos de coração pelo carinho e por nos avisar. Mesmo de longe, você estará presente em nossos pensamentos e fará parte desse momento tão lindo da chegada da Elena.'}
          </p>
          {status === 2 && guest?.pixKey && (
            <div className="pix-suggestion">
              <p>Sugestao de carinho via PIX</p>
              <button type="button" className="btn btn-outline pix-copy-button" onClick={copyPixKey}>
                <Copy size={16} /> Copiar chave PIX
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container rsvp-page flex flex-col items-center animate-fade-in-up">

      <div className="rsvp-intro text-center">
        <h1 className="event-logo-heading">
          <img
            className="event-logo"
            src="/logo title.png"
            alt="Chá de bebê da Elena — dia 20/09/2026 às 11h"
          />
        </h1>
        <div className="event-location">
          <div className="event-location-text">
            <MapPin size={18} aria-hidden="true" />
            <span>
              Estância Santa Bárbara
              <small>Rua Canabura - Lácio, Marília - SP</small>
            </span>
          </div>
          <a className="btn event-location-button" href={MAPS_URL} target="_blank" rel="noreferrer">
            Abrir no Maps
          </a>
        </div>
        <p className="rsvp-invitation">
          Com muita alegria, queremos convidar você para celebrar a chegada da Elena
          e fazer parte deste momento tão especial para a nossa família.
          Sua presença tornará esse dia ainda mais inesquecível!
        </p>
      </div>

      <p className="diaper-suggestion">
        Sugestao de presente: {getDiaperSuggestion(guest.diaperSize)}
      </p>
      <p className="beverage-notice">
        <Info size={16} aria-hidden="true" />
        <span>Optamos por nao servir bebidas alcoolicas, mas cada convidado pode trazer a bebida que preferir.</span>
      </p>

      <div className="card rsvp-card">
        <h2 className="rsvp-card-title text-center">Confirmar presença</h2>

        <form onSubmit={handleSubmit}>
          <div className="rsvp-choices flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setStatus(1)}
              className="card rsvp-choice text-center"
              style={{
                border: status === 1 ? '2px solid var(--color-event-pink-dark)' : '2px solid transparent',
                transform: status === 1 ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer'
              }}
            >
              <Check size={32} color="var(--color-event-pink-dark)" style={{ margin: '0 auto 0.3rem' }} />
              <h3 style={{ margin: 0, color: 'var(--color-event-pink-dark)' }}>Sim, eu vou!</h3>
            </button>

            <button
              type="button"
              onClick={() => setStatus(2)}
              className="card rsvp-choice text-center"
              style={{
                border: status === 2 ? '2px solid var(--color-lavender)' : '2px solid transparent',
                transform: status === 2 ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer'
              }}
            >
              <X size={32} color="var(--color-lavender)" style={{ margin: '0 auto 0.3rem' }} />
              <h3 style={{ margin: 0, color: 'var(--color-lavender)' }}>Não poderei ir</h3>
            </button>
          </div>

          <div className="rsvp-message-field">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Deixe uma mensagem para os pais (opcional)
            </label>
            <textarea
              rows="2"
              placeholder="Sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-rsvp rsvp-submit w-100"
            disabled={status === null || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar Resposta'}
          </button>
        </form>
      </div>

    </div>
  );
}
