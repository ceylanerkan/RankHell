import { useEffect, useState } from 'react'

// Fenomen fotoğrafı — tek sorumluluk: görsel ya da yedeği.
//
// photoUrl'ler public/personas/ altındaki dosyaları gösterir; dosyalar henüz
// bırakılmadığı için istek 404 döner, onError yakalar ve monograma düşeriz.
// jpg'ler klasöre kondukça bu bileşen değişmeden fotoğraflar belirir.
//
// Monogram, Navbar'daki kullanıcı avatarının deseninden türer ama TERS
// çevrilmiştir: orada 36px'lik daire dolu bakırdır, burada kapak kare kadar
// büyük — dolu bakır ızgaranın üçte birini boyar ve paletin "yaklaşık %2
// Copper" dengesini bozardı. Bu yüzden zemin en koyu tonda kalır, bakır
// yalnızca harfte konuşur. Yeni renk üretilmez.

export default function PersonaPhoto({ persona }) {
  const [failed, setFailed] = useState(false)

  // Kart yeniden sıralanınca aynı DOM düğümü başka bir kişiye düşebilir:
  // bayrak sıfırlanmazsa yeni kişinin sağlam fotoğrafı da gizlenirdi.
  useEffect(() => {
    setFailed(false)
  }, [persona.photoUrl])

  const showPhoto = Boolean(persona.photoUrl) && !failed

  return (
    // Kare kapak: ızgarada tüm kartlar eşit yükseklikte kalır.
    <div className="aspect-square w-full overflow-hidden rounded bg-night-deep">
      {showPhoto ? (
        <img
          src={persona.photoUrl}
          alt={persona.displayName}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center font-display text-5xl font-extrabold text-copper-soft"
        >
          {persona.displayName.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}
