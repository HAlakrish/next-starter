export interface SessionUser {
  id: string;
  email?: string | null;
  role: string;
}

export interface Session {
  user?: SessionUser;
}
