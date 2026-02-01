// src/Root.jsx
import React, { useEffect } from 'react';
import App from './App';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function Root() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker enregistré avec succès:', registration);

          if ('Notification' in window && 'PushManager' in window) {
            const checkPermission = () => {
              if (Notification.permission === 'default') {
                const notificationPrompt = window.confirm('Voulez-vous activer les notifications pour recevoir des alertes sur les nouvelles offres ?');
                if (notificationPrompt) {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      console.log('Permission de notification accordée');
                      getToken(messaging, {
                        vapidKey: import.meta.env.VITE_VAPID_KEY,
                        serviceWorkerRegistration: registration,
                      }).then((currentToken) => {
                        if (currentToken) {
                          console.log('Token FCM:', currentToken);
                          fetch('/subscribe', {
                            method: 'POST',
                            body: JSON.stringify({ token: currentToken }),
                            headers: { 'Content-Type': 'application/json' },
                          }).catch(err => console.log('Erreur envoi token:', err));
                        }
                      }).catch(err => console.log('Erreur:', err));
                    }
                  });
                } else {
                  console.log('Notification refusée');
                }
              } else if (Notification.permission === 'granted') {
                getToken(messaging, {
                  vapidKey: import.meta.env.VITE_VAPID_KEY,
                  serviceWorkerRegistration: registration,
                }).then((currentToken) => {
                  if (currentToken) console.log('Token FCM (permission déjà accordée):', currentToken);
                }).catch(err => console.log('Erreur:', err));
              }
            };

            const timer = setTimeout(checkPermission, 60000);
            return () => clearTimeout(timer);
          }
        })
        .catch(err => console.error('Erreur lors de l\'enregistrement du Service Worker:', err));
    }
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/icons/icon-192x192.png',
        data: { url: payload.data?.link || '/' },
      };

      const notification = new Notification(notificationTitle, notificationOptions);
      notification.onclick = (event) => {
        event.preventDefault();
        window.open(notificationOptions.data.url, '_blank');
      };
    });
  }, []);

  return (
    <>
      <link rel="preload" href="/icons/icon-192x192.png" as="image" />
      <App />
    </>
  );
}

export default Root;