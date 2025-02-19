import { atom } from "jotai";

export const authStateAtom = atom({
  token: null as string | null,
  isAuthenticated: false,
});
