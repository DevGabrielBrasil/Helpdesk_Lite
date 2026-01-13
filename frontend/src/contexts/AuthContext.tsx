import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface AuthContextData {
  signed: boolean;
  user: any;
  signIn(credentials: object): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(() => {
    try {
      const storagedUser = localStorage.getItem('@Helpdesk:user');
      const storagedToken = localStorage.getItem('@Helpdesk:token');
      if (storagedUser && storagedToken) {
        return JSON.parse(storagedUser);
      }
    } catch (err) {
      // ignore JSON parse errors
    }
    return null;
  });

  async function signIn(credentials: any) {
    const response = await api.post('/auth/login', credentials);
    const { access_token, user: userData } = response.data;

    setUser(userData);
    localStorage.setItem('@Helpdesk:token', access_token);
    localStorage.setItem('@Helpdesk:user', JSON.stringify(userData));
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}