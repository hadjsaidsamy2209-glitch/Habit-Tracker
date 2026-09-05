# Habit Tracker

Une application de suivi d'habitudes (PWA) avec un design minimaliste et premium, inspirée d'Airbnb et Uber Eats.

🔗 **Démo :** [habit-tracker-4fd49.web.app](https://habit-tracker-4fd49.web.app)

## ✨ Fonctionnalités

- Suivi quotidien des habitudes avec calcul de séries (streaks) et meilleur score (best streak)
- Historique des jours actifs (`activeDays`) et hook `useHabitHistory`
- Vue calendrier avec code couleur selon l'état des jours
- Authentification via Google Sign-In
- Notifications push via Firebase Cloud Messaging (FCM)
- Interface avec navbar flottante arrondie, gestes de balayage (swipe) pour éditer/supprimer, et modales en bottom sheet
- Mode sombre (fond `#0a0a0a`, surfaces `#141414`), typographie Plus Jakarta Sans, composants au style iOS

## 🛠️ Stack technique

- **Frontend :** React
- **Backend / Data :** Firebase (Firestore, Cloud Functions)
- **Authentification :** Google Sign-In
- **Notifications :** Firebase Cloud Messaging
- **Hébergement :** Firebase Hosting
- **Sécurité :** chiffrement des données sensibles via CryptoJS (AES)

## 🔒 Sécurité

Les données sensibles sont chiffrées côté client avec AES (CryptoJS). La clé est actuellement en dur dans le code, ce qui protège contre une fuite de la base de données mais pas contre une inspection via les DevTools. Une amélioration prévue consiste à déplacer la clé vers une variable d'environnement Vite et à renforcer les règles de sécurité Firestore.


## 📦 Déploiement

```bash
npm run build
firebase deploy
```

## 📄 Licence

Projet personnel — tous droits réservés.
