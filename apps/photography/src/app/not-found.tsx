import Link from "next/link";

export default function NotFound() {
  return (
    <main id="isi" className="lost">
      <p className="mono">404</p>
      <h1>Fotonya nggak ketemu.</h1>
      <p>Mungkin alamatnya salah ketik, atau fotonya sudah saya hapus.</p>
      <Link href="/">Kembali ke jemuran</Link>
    </main>
  );
}
