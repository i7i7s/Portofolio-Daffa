import Link from "next/link";

export default function NotFound() {
  return (
    <main id="isi" className="lost">
      <p className="mono">Frame tidak ditemukan</p>
      <h1>Rol ini kosong.</h1>
      <p>Mungkin alamatnya berubah, atau fotonya belum dicetak.</p>
      <Link href="/">Kembali ke jemuran</Link>
    </main>
  );
}
