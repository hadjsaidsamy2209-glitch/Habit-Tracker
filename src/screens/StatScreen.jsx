import { useState } from 'react';
import { useHabitHistory } from '../hooks/useHabitHistory';

function StatsScreen({ habits, perfectStreak, user }) {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const last7 = useHabitHistory(user, selectedHabit);

  return (
    <div className="app-shell">
      <div className="app-header">
        <p className="date-text">Statistiques</p>
        <p className="greeting-label">Tes progrès</p>
      </div>

      <div className="progress-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <p className="progress-title">Jours parfaits</p>
        <p className="progress-big">
          {habits.length > 0 && habits.every(h => h.completed) ? perfectStreak + 1 : perfectStreak}<span className="progress-title"> jours</span>
        </p>
        <p className="progress-sub">
          {`${habits.filter(h => h.completed).length}/${habits.length} habitudes aujourd'hui`}
        </p>
      </div>

      <div className="section-header">
        <h2 className="section-title">Mes habitudes</h2>
        {habits.length > 0 && <span className="section-badge">{habits.length}</span>}
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {habits.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">✦</span>
            <p className="empty-text">Aucune habitude</p>
            <p className="empty-sub">Ajoute des habitudes pour voir tes stats</p>
          </div>
        )}
        {habits.map((habit, i) => (
          <div key={habit.id} className="stats-card" onClick={() => setSelectedHabit(habit)}
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="stats-card-top">
              <span className="stats-card-name">{habit.name}</span>
              <div>
                <p className="stats-streak-num">{habit.streak || 0}</p>
                <p className="stats-streak-lbl">jours streak</p>
              </div>
            </div>
            <div className="stats-card-bottom">
              <span className="stats-record">
                record {habit.bestStreak || habit.streak || 0}j
              </span>
              <div className="stats-bar-track">
                <div className="stats-bar-fill" style={{
                  width: `${habit.bestStreak > 0 ? Math.min((habit.streak / habit.bestStreak) * 100, 100) : 0}%`
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedHabit && (
        <div className="modal-overlay" onClick={() => setSelectedHabit(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 className="modal-title">{selectedHabit.name}</h2>
            <p className="modal-sub">Ajoutée le {new Date(selectedHabit.createdAt).toLocaleDateString('fr-FR')}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <p className="stats-streak-num">{selectedHabit.streak || 0}</p>
                <p className="stats-streak-lbl">Streak actuelle</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p className="stats-streak-num">{selectedHabit.bestStreak || 0}</p>
                <p className="stats-streak-lbl">Record</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className={`check-circle ${selectedHabit.completed ? 'check-done' : ''}`} style={{ margin: '0 auto' }}>
                  {selectedHabit.completed && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <p className="stats-streak-lbl">Aujourd'hui</p>
              </div>
            </div>
            <p className="stats-streak-lbl" style={{ marginBottom: 10 }}>7 derniers jours</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
              {last7.map((done, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const initial = d.toLocaleDateString('fr-FR', { weekday: 'short' })[0].toUpperCase();
                return (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: done ? '#fff' : '#1e1e1e',
                      border: '0.5px solid #2a2a2a',
                      margin: '0 auto 4px'
                    }} />
                    <span style={{ fontSize: 11, color: '#555' }}>{initial}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsScreen;