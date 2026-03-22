# Suggestions Vault — React

Web counterpart to `suggestions-vault-gui/main.py`: vault cards, scan → approve → deploy flow, plus an **agent playbook** and **sample agent trace** (bounded tools → human gate → durable record).

## Run (demo, no backend)

```bash
cd suggestions-vault-gui/react-vault
npm install
npm run dev
```

Open [http://127.0.0.1:5188](http://127.0.0.1:5188).

## Live API (3jAIS)

1. Start the control panel backend: `cd 3jais && npm install && npm run dev` (backend on port **3847**).
2. Create `.env.local` here with:

   ```
   VITE_LIVE_API=1
   ```

3. `npm run dev` in this folder — Vite proxies `/api` to 3847.

Scan uses `WORKSPACE_ROOT` from the backend; vault/policy/preview/deploy match 3jAIS behavior.
