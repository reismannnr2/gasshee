import { AES, SHA256, Utf16 } from 'jscrypto';
export async function encryptWithPassword(text: string, password: string) {
  const key = SHA256.hash(password);
  const wordArray = Utf16.parse(text);
  const encrypted = AES.encrypt(wordArray, key);
  return encrypted.toString();
}

export async function decryptWithPassword(encrypted: string, password: string) {
  const key = SHA256.hash(password);
  const decrypted = AES.decrypt(encrypted, key);
  return decrypted.toString(Utf16);
}
