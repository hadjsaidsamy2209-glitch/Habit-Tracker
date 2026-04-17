import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useHabits } from './hooks/useHabits';
import LoginScreen from './LoginScreen';
import HomeScreen from './screens/HomeScreen';
import StatsScreen from './screens/StatScreen';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const { habits, addHabit, toggleHabit, renameHabit, deleteHabit, resetHabits, perfectStreak } = useHabits(user);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const checkReset = async () => {
      try {
        const today = new Date().toDateString();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const lastReset = userDoc.data()?.lastReset;

        if (lastReset !== today) {
          const lastResetDate = new Date(lastReset);
          const diffDays = Math.floor((new Date() - lastResetDate) / (1000 * 60 * 60 * 24));
          await resetHabits(diffDays);
        }
      } catch (e) {
        console.error('Erreur check reset:', e);
      }
    };

    checkReset();
  }, [user]);

  if (authLoading) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#333' }} />
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <div style={{ position: 'relative' }}>

      {/* Écrans */}
      {activeTab === 0 && (
        <HomeScreen
          user={user}
          habits={habits}
          onToggle={toggleHabit}
          onAdd={addHabit}
          onRename={renameHabit}
          onDelete={deleteHabit}
        />
      )}
      {activeTab === 1 && (
        <StatsScreen habits={habits} perfectStreak={perfectStreak} user={user} />
      )}


      {/* Navbar */}
      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 0 ? 'nav-active' : ''}`} onClick={() => setActiveTab(0)}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3 11L11 3L19 11V19H15V14H7V19H3V11Z"
              stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </button>
        <button className={`nav-item ${activeTab === 1 ? 'nav-active' : ''}`} onClick={() => setActiveTab(1)}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polyline points="3,16 7,10 12,13 19,5"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className={`nav-item ${activeTab === 2 ? 'nav-active' : ''}`} onClick={() => setActiveTab(2)}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="3" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 5V3M14 5V3M3 10H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

    </div>
  );
}

export default App;
