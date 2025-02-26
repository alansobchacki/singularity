import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export const authStateAtom = atomWithStorage("authState", {
  id: "",
  isAuthenticated: false,
});

export const hydratedAuthStateAtom = atom((get) => get(authStateAtom));
