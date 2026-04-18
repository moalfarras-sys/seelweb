import { permanentRedirect } from "next/navigation";

export default function ReinigungBueroRedirectPage() {
  permanentRedirect("/leistungen/bueroreinigung");
}
