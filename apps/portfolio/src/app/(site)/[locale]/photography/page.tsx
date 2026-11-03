import { redirect } from "next/navigation";

// The gallery moved to its own landing page; keep old links working.
export default function Photography() {
  redirect("/foto/");
}
