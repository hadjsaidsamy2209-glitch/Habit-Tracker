import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export function useHabitHistory(user, habit) {
  const [last7, setLast7] = useState([]);

  useEffect(() => {
    if (!user || !habit) return;

    const fetchHistory = async () => {
      const snap = await getDocs(collection(db, 'users', user.uid, 'history'));
      const history = {};
      snap.docs.forEach(d => history[d.id] = d.data());

      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toDateString();
      });

      const result = days.map(date => {
        if (date === new Date().toDateString()) return habit.completed;
        return history[date]?.habits?.[habit.id]?.completed ?? false;
      });
      console.log(result);
      setLast7(result);
    };

    fetchHistory();
  }, [user, habit]);

  return last7;
}