import { redirect } from "next/navigation";

export default function LandingPage() {
  // implement a landing page in the future if needed/wanted
  // for now, just redirect users to the /login page

  redirect("/login");
}
