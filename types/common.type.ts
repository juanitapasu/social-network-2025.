// types/common.types.ts

export interface User {
  email: string;
  username: string;
  name: string;
  lastName: string;
  age: number;
  imageUrl?: string;
}

export interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: User, password: string) => Promise<boolean>;
  logout: () => void;
}
