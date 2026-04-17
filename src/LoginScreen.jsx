import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function LoginScreen() {
  async function handleGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erreur connexion:", error);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-preview-card">
        <p className="login-card-label">Progression du jour</p>
        <p className="login-card-big">0<span className="login-card-unit">%</span></p>
        <p className="login-card-sub">Connecte-toi pour commencer</p>
        <div className="bar-track">
          <div className="bar-fill" style={{ width: '0%' }} />
        </div>
        <div className="login-habits-blur">
          <div className="login-fake-row" />
          <div className="login-fake-row" />
          <div className="login-fake-row" />
        </div>
      </div>
      <div className="login-bottom">
        <h1 className="login-title">Tes habitudes,<br />chaque jour.</h1>
        <p className="login-sub">Connecte-toi pour accéder à ton espace.</p>
        <button className="btn-cta" onClick={handleGoogle}>
          Continuer avec Google
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;