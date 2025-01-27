import { users } from './data/users';

export const authenticate = async (credentials) => {
  // Fake API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = users.find(
    u => u.username === credentials.username && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Geçersiz kullanıcı adı veya şifre');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}; 