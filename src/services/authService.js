import users from '../data/users.json';

const STORAGE_KEY = 'bdg_auth_user';

export const authService = {
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(
          u => u.email === email && u.password === password
        );
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500); // Simulate network delay
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: () => {
    const userJson = localStorage.getItem(STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },
};
