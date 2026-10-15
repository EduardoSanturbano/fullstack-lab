-- Retorne o nome de cada participante do evento :event_id, em ordem de nome.
-- Consulte users e registrations; o teste fornece o parâmetro :event_id.
-- Nomes dos participantes de um evento, em ordem alfabética.
SELECT users.name
FROM registrations
JOIN users ON users.id = registrations.user_id
WHERE registrations.event_id = :event_id
ORDER BY users.name;
