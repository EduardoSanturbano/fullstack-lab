import { useEffect, useState } from 'react'
import { listEvents, register } from './api.js'

function slotsLabel(slots) {
  return slots === 1 ? '1 vaga disponível' : `${slots} vagas disponíveis`
}

export default function App() {
  const [userId, setUserId] = useState(1)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const [success, setSuccess] = useState('')
  const [registerError, setRegisterError] = useState('')

  async function loadEvents() {
    try {
      setEvents(await listEvents())
      setLoadError('')
    } catch {
      setLoadError('Não foi possível carregar os eventos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  async function handleRegister(eventId) {
    setPendingId(eventId)
    setSuccess('')
    setRegisterError('')
    try {
      await register(eventId, userId)
      setSuccess('Inscrição realizada!')
      await loadEvents()
    } catch (error) {
      setRegisterError(error.message)
    } finally {
      setPendingId(null)
    }
  }

  return <main className="page">
    <header>
      <p className="eyebrow">Trilha · Laboratório Full Stack</p>
      <h1>Eventos</h1>
      <p>Encontre uma atividade e garanta sua vaga.</p>
    </header>

    <label className="user-picker">Participante de demonstração
      <select value={userId} onChange={event => setUserId(Number(event.target.value))}>
        <option value="1">Pessoa 1</option>
        <option value="2">Pessoa 2</option>
      </select>
    </label>

    {success && <p role="status">{success}</p>}
    {registerError && <p role="alert">{registerError}</p>}
    {loadError && <p role="alert">{loadError}</p>}
    {loading && <p>Carregando eventos...</p>}
    {!loading && !loadError && events.length === 0 && <p>Nenhum evento disponível.</p>}

    <section aria-label="Lista de eventos" className="events">
      {events.map(event => <article className="card" key={event.id}>
        <p className="date">{event.date}</p>
        <h2>{event.title}</h2>
        <p>{slotsLabel(event.available_slots)}</p>
        <button
          type="button"
          disabled={pendingId !== null || event.available_slots === 0}
          onClick={() => handleRegister(event.id)}
        >
          {event.available_slots === 0 ? 'Sem vagas' : 'Inscrever-se'}
        </button>
      </article>)}
    </section>
  </main>
}
