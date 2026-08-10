// "Her Sıradan Bir Tanesini Seç" modunun sayfası — şimdilik yalnızca iskelet.
// Rota ve başlık ayakta: /modlar kapağı artık buraya gidiyor. Mekanik (satır
// ızgarası, tek seçim, eleme) sonraki adımda bu boşluğa girecek; o yüzden
// burada uydurma bir yerleşim bırakılmadı.
export default function RowPick() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="title-copper font-display text-3xl font-extrabold text-cream">
          Her Sıradan Bir Tanesini Seç
        </h1>
        <span className="inline-flex items-center gap-2 rounded-full bg-ash/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ash ring-1 ring-ash/35">
          ⚡ Yakında: satırlar dolacak
        </span>
      </div>
      <p className="text-sm text-faded">
        Her satırdan yalnızca bir tane alabilirsin. Gerisi elenir.
      </p>
    </div>
  )
}
