import { createContext, useContext, useEffect } from 'react'

// Sayfa kromu (navbar) anahtarı. Tek tüketicisi var: oyun ekranı oynarken
// navbar'ı gizler, kendi bandını onun yerine koyar. Sağlayıcı App.jsx'teki
// Shell — state orada yaşar, burada yalnızca kanal ve yardımcı kanca var.
//
// Bilerek context: oyun fazı URL'de değil PollPlay state'inde yaşıyor, Shell
// de PollPlay'in üstünde. Prop geçirmenin yolu yok.
export const ChromeContext = createContext(null)

// Sağlayıcı dışında kullanılırsa render kırılmaz, kroma dokunulmaz — kart
// sistemindeki "geçersiz kullanım güvenli davranışa düşer" felsefesi.
const NOOP_CHROME = { setNavHidden: () => {} }

export function useChrome() {
  return useContext(ChromeContext) ?? NOOP_CHROME
}

// Bu kancayı çağıran bileşen ekrandayken navbar gizlenir, ayrılınca geri gelir.
export function useHiddenNav() {
  const { setNavHidden } = useChrome()
  useEffect(() => {
    setNavHidden(true)
    return () => setNavHidden(false)
  }, [setNavHidden])
}
