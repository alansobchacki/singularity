import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export const authStateAtom = atomWithStorage("authState", {
  token: null as string | null,
  isAuthenticated: false,
});

export const hydratedAuthStateAtom = atom((get) => get(authStateAtom));
