import { atomWithStorage } from "jotai/utils";

export const authStateAtom = atomWithStorage("authState", {
  token: null as string | null,
  isAuthenticated: false,
});
