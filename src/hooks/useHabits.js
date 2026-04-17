import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
export function useHabits(user) {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, 'users', user.uid, 'habits'));
        setHabits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        await loadPerfectStreak();
      } catch (e) {
        console.error('Erreur chargement:', e);
      }
    };
    load();
  }, [user]);

  const [perfectStreak, setPerfectStreak] = useState(0);

  async function loadPerfectStreak() {
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'history'));
      const history = snap.docs.map(d => d.data());

      history.sort((a, b) => new Date(b.date) - new Date(a.date));


      let streak = 0;
      for (const day of history) {
        if (day.status === 'perfect') streak++;
        else break;
      }

      setPerfectStreak(streak);
    } catch (e) {
      console.error('Erreur perfect streak:', e);
    }
  }
  async function addHabit(name) {
    if (!name.trim()) return;
    try {
      const newHabit = { name, completed: false, streak: 0, createdAt: new Date().toISOString() };
      const ref = await addDoc(collection(db, 'users', user.uid, 'habits'), newHabit);
      setHabits(prev => [...prev, { id: ref.id, ...newHabit }]);
    } catch (e) {
      console.error('Erreur ajout:', e);
    }
  }

  async function toggleHabit(habitId) {
    try {
      const updated = habits.map(h => {
        if (h.id !== habitId) return h;
        const newCompleted = !h.completed;
        const newStreak = newCompleted ? (h.streak || 0) + 1 : Math.max((h.streak || 0) - 1, 0);
        const newBestStreak = newCompleted
          ? Math.max(newStreak, h.bestStreak || 0)
          : h.streak === h.bestStreak
            ? newStreak
            : (h.bestStreak || 0);
        return { ...h, completed: newCompleted, streak: newStreak, bestStreak: newBestStreak };
      });
      setHabits(updated);

      const habit = updated.find(h => h.id === habitId);
      await updateDoc(doc(db, 'users', user.uid, 'habits', habitId), {
        completed: habit.completed,
        streak: habit.streak,
        bestStreak: habit.bestStreak,
      });
    } catch (e) {
      console.error('Erreur toggle:', e);
    }
  }

  async function renameHabit(habitId, newName) {
    if (!newName.trim()) return;
    try {
      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, name: newName } : h));
      await updateDoc(doc(db, 'users', user.uid, 'habits', habitId), { name: newName });
    } catch (e) {
      console.error('Erreur rename:', e);
    }
  }

  async function deleteHabit(habitId) {
    try {
      setHabits(prev => prev.filter(h => h.id !== habitId));
      await deleteDoc(doc(db, 'users', user.uid, 'habits', habitId));
    } catch (e) {
      console.error('Erreur delete:', e);
    }
  }

async function resetHabits(diffDays = 1) {
  try {
    const today = new Date().toDateString();
    const snap = await getDocs(collection(db, 'users', user.uid, 'habits'));
    const allHabits = snap.docs.map(d => d.data());

    const total = allHabits.length;
    const completed = allHabits.filter(h => h.completed).length;
    const status = completed === 0 ? 'missed' : completed === total ? 'perfect' : 'partial';

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const habitsHistory = {};
    snap.docs.forEach(d => {
      habitsHistory[d.id] = { completed: d.data().completed };
    });

    await setDoc(
      doc(db, 'users', user.uid, 'history', yesterdayStr),
      { total, completed, status, date: yesterdayStr, habits: habitsHistory },
      { merge: true }
    );

    const updates = snap.docs.map(d => {
      const habit = d.data();
      const wasCompleted = habit.completed;
      return updateDoc(doc(db, 'users', user.uid, 'habits', d.id), {
        completed: false,
        streak: wasCompleted && diffDays === 1 ? habit.streak : 0,
      });
    });
    await Promise.all(updates);

    await setDoc(doc(db, 'users', user.uid), { lastReset: today }, { merge: true });
    setHabits(prev => prev.map(h => ({
      ...h,
      completed: false,
      streak: h.completed && diffDays === 1 ? h.streak : 0,
    })));
    await loadPerfectStreak();
  } catch (e) {
    console.error('Erreur reset:', e);
  }
}

  return { habits, addHabit, toggleHabit, renameHabit, deleteHabit, resetHabits, perfectStreak };
}
