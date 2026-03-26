# Chatbox Application (Angular 19 + NgRx)

This project is an Angular 19 chatbox application using NgRx Store/Effects with OpenAI Chat Completions API integration.

## Tech Stack

- Angular `19.x`
- NgRx `19.x` (`@ngrx/store`, `@ngrx/effects`)
- Reactive Forms
- HttpClient

## Setup

1. Install dependencies:
   - `npm install`
2. Configure your OpenAI key in:
   - `src/environments/environment.ts`
   - `src/environments/environment.prod.ts`

```ts
export const environment = {
  production: false,
  openAiApiKey: 'YOUR_OPENAI_API_KEY',
  openAiModel: 'gpt-3.5-turbo'
};
```

## Run

- Development: `npm start`
- Build: `npm run build`
- Test: `npm test`

## Features Implemented

- Chat message history in NgRx state
- Loading state while API request is in-flight
- Error state and UI error banner
- OpenAI API integration with authentication header
- Responsive chat layout for desktop/mobile
