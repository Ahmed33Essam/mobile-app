import { createContext, useContext, useState, type ReactNode } from 'react';

export type AuthUser = Record<string, unknown>;

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  setSession: (user: AuthUser, token: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const setSession = (nextUser: AuthUser, nextToken: string | null) => {
    setUser(nextUser);
    setToken(nextToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export function getUserFromResponse(payload: unknown): AuthUser | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  const response = payload as Record<string, unknown>;
  const data =
    response.data && typeof response.data === 'object' && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : null;

  for (const candidate of [response.user, response.profile, data?.user, data?.profile, data, response]) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
      continue;
    }

    const user = candidate as AuthUser;
    if (
      ['name', 'fullName', 'username', 'email', 'gender', 'phone', 'phoneNumber', 'image', 'profileImage']
        .some((key) => key in user)
    ) {
      return user;
    }
  }

  return null;
}

export function getTokenFromResponse(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  const response = payload as Record<string, unknown>;
  const data =
    response.data && typeof response.data === 'object' && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : null;
  const token =
    response.token ??
    response.accessToken ??
    response.access_token ??
    data?.token ??
    data?.accessToken ??
    data?.access_token;

  return typeof token === 'string' && token.length > 0 ? token : null;
}
