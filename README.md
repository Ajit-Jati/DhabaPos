# DhabaPOS

Mobile-first restaurant and dhaba POS PWA, designed around free-first workflows: local offline persistence, UPI QR/deep links, WhatsApp receipt links, and browser printing.

## Run

1. Copy `.env.example` to `.env` and add your Firebase web credentials. In Firebase Console, enable **Authentication → Sign-in method → Email/Password** and add your deployed domain to **Authorized domains**.
2. Run `npm install`, then `npm run dev`.
3. Run `npm run build` before deployment.

Authentication has no production bypass: until Firebase credentials are configured, the app displays a setup notice rather than creating unsecured local accounts. It uses persistent Firebase sessions, email verification, password reset, and logout. Deploy `firestore.rules` and `firestore.indexes.json` with `firebase deploy --only firestore`.

## Deploy

Vercel and Netlify both use `npm run build` with output directory `dist`. Add the `VITE_FIREBASE_*` environment values to the hosting dashboard.

## Payments and printers

UPI is intentionally manually confirmed: no paid gateway or false verification is used. WhatsApp opens a standard `wa.me` receipt URL. Bluetooth support is detected at runtime; unsupported devices use the browser print fallback.
