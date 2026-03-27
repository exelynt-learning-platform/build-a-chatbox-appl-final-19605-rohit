# Chatbox Application — Angular 19 + NgRx + OpenAI

A production-ready chatbox application using Angular 19, NgRx state management, and OpenAI Chat Completions API.

## Tech Stack

- **Angular** `19.x` (standalone components)
- **NgRx** `19.x` — `@ngrx/store` + `@ngrx/effects`
- **OpenAI** `gpt-3.5-turbo` via `https://api.openai.com/v1/chat/completions`
- **Reactive Forms**, **HttpClient**, **Karma/Jasmine** tests

---

## Local Setup

### 1. Install dependencies
```bash
cd chatbox-app-ngrx
npm install
```

### 2. Configure your API key (required)

The environment files are **not committed** to version control for security.
Copy the example templates and add your key:

```bash
# Windows
copy src\environments\environment.example.ts src\environments\environment.ts
copy src\environments\environment.prod.example.ts src\environments\environment.prod.ts
```

Then open `src/environments/environment.ts` and replace the placeholder:

```ts
export const environment = {
  production: false,
  openAiApiKey: 'sk-proj-YOUR_REAL_KEY_HERE',   // <-- add your key
  openAiModel: 'gpt-3.5-turbo'
};
```

Get your key at → [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

> **Security note:** `environment.ts` and `environment.prod.ts` are listed in
> `.gitignore` and will never be committed to version control.

---

## Run

| Command | Description |
|---|---|
| `npm start` | Dev server at `http://localhost:4200` |
| `npm run build` | Production build in `dist/` |
| `npm test` | Run 27 Karma/Jasmine unit tests |

---

## Features

- Full NgRx state management (messages, loading, error)
- NgRx Effects handle all async OpenAI API calls
- Full conversation history sent per request (AI remembers context)
- User message appears instantly (optimistic update before API responds)
- Loading spinner with animated typing indicator
- Dismissable error banner with specific messages (401 / 429 / network)
- Responsive layout — full screen on mobile, card on desktop
- Enter to send, Shift+Enter for new line
- Auto-scroll to latest message
- 27 unit tests covering reducer, selectors, effects, and component

---

## Project Structure

```
src/
├── app/
│   ├── models/
│   │   └── chat-message.model.ts       # ChatMessage interface
│   ├── services/
│   │   └── openai.service.ts           # OpenAI HTTP client
│   ├── store/
│   │   ├── chat.actions.ts             # NgRx actions
│   │   ├── chat.reducer.ts             # Pure reducer
│   │   ├── chat.selectors.ts           # Memoized selectors
│   │   ├── chat.effects.ts             # Async effects
│   │   ├── chat.state.ts               # State interface
│   │   ├── chat.reducer.spec.ts        # Reducer tests
│   │   ├── chat.selectors.spec.ts      # Selector tests
│   │   └── chat.effects.spec.ts        # Effects tests
│   ├── app.component.ts/html/scss      # Main chat UI
│   ├── app.config.ts                   # App bootstrap config
│   └── app.routes.ts
├── environments/
│   ├── environment.example.ts          # Safe template (committed)
│   ├── environment.prod.example.ts     # Safe template (committed)
│   ├── environment.ts                  # Your key goes here (gitignored)
│   └── environment.prod.ts             # Your key goes here (gitignored)
```
