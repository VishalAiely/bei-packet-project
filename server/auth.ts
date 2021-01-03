import { readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import { JWT } from 'google-auth-library';

const promisedFile = promisify(readFile);

type config = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
};

export async function auth() {
  const credentials = JSON.parse(
    await promisedFile(resolve('.', 'packet-generator.json'), 'utf-8')
  ) as config;
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  await client.authorize();
  return client;
}
