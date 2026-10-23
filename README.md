# Nuestro Calendario

Calendario compartido de pareja (PWA). Los dos abren la misma URL con el mismo
"código de pareja" y ven/editan los mismos eventos en vivo.

- **Local**: funciona de inmediato en un solo teléfono (sin configurar nada).
- **Sincronización entre dos teléfonos**: pega la config de tu proyecto de
  Firebase en `firebase-config.js` (los valores son públicos por diseño).

Reglas de Firestore sugeridas (acceso por código, sin login):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /parejas/{codigo}/{document=**} {
      allow read, write: if true;
    }
  }
}
```

El código de pareja es aleatorio y actúa como llave privada del calendario.
