// "A ve B" · "A, B ve C" — liste ikiyi geçince düz join "A ve B ve C"
// üretiyordu. Anket kurulum ekranı (PollPlay) ve /modlar kapak kartları aynı
// "şimdilik şunlar oynanabilir" cümlesini kurduğu için tek yerde yaşar.
export function joinTr(list) {
  if (list.length < 2) return list.join('')
  return `${list.slice(0, -1).join(', ')} ve ${list[list.length - 1]}`
}
