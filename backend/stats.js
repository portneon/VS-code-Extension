import e from "cors";

export const sessions = [];
export const currentSession = { value: null };

function startSession() {
  if (currentSession.value) {
    throw new Error("Session already started!");
  }
  currentSession.value = {
    startTime: new Date(),
  };
  return currentSession.value;
}

function stopSession() {
  if (!currentSession.value) {
    throw new Error("No session in progress!");
  }
  currentSession.value.endTime = new Date();
  currentSession.value.durationMs =
    currentSession.value.endTime - currentSession.value.startTime;

  sessions.push(currentSession.value);

  const session = currentSession.value;
  currentSession.value = null;

  return session;
}

function getStats() {
  const totalMs = sessions.reduce((acc, s) => acc + s.durationMs, 0);

  return {
    totalSession: sessions.length,
    totalTimeMs: totalMs,
  };
}

function getAllSessions() {
  return sessions;
}

function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return `${hours} hr ${minutes} min ${seconds} sec`;
}

export { startSession, stopSession, getStats, getAllSessions, formatDuration };
