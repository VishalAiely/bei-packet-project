import { decode } from 'utf8';
import { JWT } from 'google-auth-library';

export async function auth() {
  if (process.env.CLIENT_EMAIL === undefined || process.env.PRIVATE_KEY === undefined) {
    throw new Error('Environment Variables not pleasant');
  }
  const client = new JWT({
    email: String(decode(process.env.CLIENT_EMAIL)),
    key: String(decode(process.env.PRIVATE_KEY)),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  await client.authorize();
  return client;
}
