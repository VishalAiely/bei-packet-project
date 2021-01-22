import { decode } from 'utf8';
import { JWT } from 'google-auth-library';

export async function auth() {
  if (process.env.CLIENT_EMAIL === undefined || process.env.PRIVATE_KEY === undefined) {
    throw new Error('Environment Variables not pleasant');
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { privateKey } = JSON.parse(process.env.PRIVATE_KEY);
  const client = new JWT({
    email: String(decode(process.env.CLIENT_EMAIL)),
    key: String(decode(privateKey)),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  await client.authorize();
  return client;
}
