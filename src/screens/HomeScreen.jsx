import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { Trash2, Pencil } from 'lucide-react'
import {
  SwipeableList,
  SwipeableListItem,
  TrailingActions,
  SwipeAction,
  Type as ListType,
} from 'react-swipeable-list'
import 'react-swipeable-list/dist/styles.css'

function HomeScreen({ user, habits, onToggle, onAdd, onRename, onDelete }) {
  const firstName = (user?.displayName || '').trim().split(' ')[0] || '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [pendingHabit, setPendingHabit] = useState(null);

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Bonjour' : greetingHour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const totalHabits = habits.length;
  const completedCount = habits.filter(h => h.completed).length;
  const percentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
  const animatedPct = useAnimatedNumber(percentage);
  const circumference = 2 * Math.PI * 54;
  const strokeDash = (animatedPct / 100) * circumference;

  function openRename(habit) {
    setPendingHabit(habit);
    setRenameValue(habit.name);
    setIsRenameOpen(true);
  }

  function openDelete(habit) {
    setPendingHabit(habit);
    setIsDeleteOpen(true);
  }

  function handleAdd() {
    if (!newHabitName.trim()) return;
    onAdd(newHabitName);
    setNewHabitName('');
    setIsModalOpen(false);
  }

  function handleRename() {
    if (!renameValue.trim() || !pendingHabit) return;
    onRename(pendingHabit.id, renameValue);
    setIsRenameOpen(false);
    setPendingHabit(null);
  }

  function handleDelete() {
    if (!pendingHabit) return;
    onDelete(pendingHabit.id);
    setIsDeleteOpen(false);
    setPendingHabit(null);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-top">
          <div>
            <p className="greeting-label"style={{ textTransform: 'capitalize'}}>{greeting}{firstName ? `, ${firstName}` : ''}</p>
            <p className="date-text" style={{ textTransform: 'capitalize' }}>{today}</p>
          </div>
          <div
            className="avatar"
            onClick={() => signOut(auth)}
            style={{ cursor: 'pointer' }}
            title="Se déconnecter"
          >
            S
          </div>
        </div>
      </header>

      <div className="progress-card">
        <div className="progress-left">
          <p className="progress-title">Progression du jour</p>
          <p className="progress-big">
            {animatedPct}<span className="progress-unit">%</span>
          </p>
          <p className="progress-sub">{completedCount} sur {totalHabits} habitudes</p>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${percentage}%` }} />
          </div>
        </div>
        <div className="progress-ring-wrap">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#222" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none" stroke="#f0f0f0" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference}`}
              transform="rotate(-90 60 60)"
              className="ring-progress"
            />
          </svg>
          <div className="ring-label">
            <span className="ring-pct">{animatedPct}%</span>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Mes habitudes</h2>
        {totalHabits > 0 && <span className="section-badge">{totalHabits}</span>}
      </div>
      {habits.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">✦</span>
          <p className="empty-text">Aucune habitude pour l'instant</p>
          <p className="empty-sub">Appuie sur + pour commencer</p>
        </div>
      )}
      <SwipeableList className="habits-list" type={ListType.IOS} fullSwipe={false} threshold={0.15}>

        {habits.map((habit, i) => (
          <SwipeableListItem
            key={habit.id}
            trailingActions={
              <TrailingActions>
                <SwipeAction onClick={() => openRename(habit)}>
                  <div className="swipe-action-wrap">
                    <div className="swipe-action-rename">
                      <Pencil size={18} />
                    </div>
                  </div>
                </SwipeAction>
                <SwipeAction onClick={() => openDelete(habit)}>
                  <div className="swipe-action-wrap">
                    <div className="swipe-action-delete">
                      <Trash2 size={18} />
                    </div>
                  </div>
                </SwipeAction>
              </TrailingActions>
            }
          >
            <div
              className={`habit-item ${habit.completed ? 'habit-done' : ''}`}
              style={{ animationDelay: `${i * 60}ms`, width: '100%' }}
            >
              <div className="habit-info">
                <span className="habit-name">{habit.name}</span>
              </div>
              <div className={`check-circle ${habit.completed ? 'check-done' : ''}`} onClick={() => onToggle(habit.id)} style={{ cursor: 'pointer' }}>
                {habit.completed && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          </SwipeableListItem>
        ))}
      </SwipeableList>

      {/* FAB */}
      <button className="fab" onClick={() => setIsModalOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* ADD MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 className="modal-title">Nouvelle habitude</h2>
            <p className="modal-sub">Donne un nom à ton habitude quotidienne</p>
            <input
              className="modal-input" type="text"
              placeholder="Ex : Méditer 10 minutes…"
              value={newHabitName}
              onChange={e => setNewHabitName(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Annuler</button>
              <button className="btn-create" onClick={handleAdd} disabled={!newHabitName.trim()}>
                Créer l'habitude
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {isRenameOpen && (
        <div className="modal-overlay" onClick={() => setIsRenameOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 className="modal-title">Renommer</h2>
            <p className="modal-sub">Nom actuel : {pendingHabit?.name}</p>
            <input
              className="modal-input" type="text"
              placeholder="Nouveau nom…"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleRename()}
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsRenameOpen(false)}>Annuler</button>
              <button className="btn-create" onClick={handleRename} disabled={!renameValue.trim()}>
                Renommer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 className="modal-title">Supprimer</h2>
            <p className="modal-sub" style={{ color: '#e05555' }}>"{pendingHabit?.name}"</p>
            <p style={{ fontSize: 13, color: '#555', marginBottom: 20 }}>
              Cette action est irréversible.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsDeleteOpen(false)}>Annuler</button>
              <button
                className="btn-create"
                onClick={handleDelete}
                style={{ background: '#1a0505', color: '#e05555', border: '1px solid #2a0a0a' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;