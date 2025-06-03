importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD-quBr-ka6upQ-PnDejgrkceU2SDtZzyQ",
  authDomain: "autoboss-16.firebaseapp.com",
  projectId: "autoboss-16",
  storageBucket: "autoboss-16.firebasestorage.app",
  messagingSenderId: "988895905341",
  appId: "1:988895905341:web:ac798c0b678857516fcc54",
  measurementId: "G-NVBM34V613"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
    data: {
      url: payload.data?.link || '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});