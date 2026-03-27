/**
 * Environment template — COPY this file to environment.ts and fill in your key.
 * NEVER commit environment.ts or environment.prod.ts to version control.
 *
 * Steps:
 *   1. cp src/environments/environment.example.ts src/environments/environment.ts
 *   2. Add your OpenAI key below (get one from https://platform.openai.com/api-keys)
 *   3. The file is already in .gitignore — it will NOT be committed
 */
export const environment = {
  production: false,
  openAiApiKey: 'YOUR_OPENAI_API_KEY_HERE',
  openAiModel: 'gpt-3.5-turbo'
};
