import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/client'
import Button from '../components/ui/button/Button'
import Card from '../components/ui/Card'
import LegalModal from '../components/ui/LegalModal'

/* ── Hukuki metin kimlikleri ────────────────────────────────────── */
const MODAL_TERMS = 'terms'
const MODAL_PRIVACY = 'privacy'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  /* ── Onay kutucukları ───────────────────────────────────────── */
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)

  /* ── Modal durumu ───────────────────────────────────────────── */
  const [openModal, setOpenModal] = useState(null) // null | 'terms' | 'privacy'
  const closeModal = useCallback(() => setOpenModal(null), [])

  const canSubmit = acceptedTerms && acceptedPrivacy

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    // Backend validasyon kurallarının aynısı (User entity)
    if (username.trim().length < 3 || username.trim().length > 50)
      return setError('Kullanıcı adı 3-50 karakter arası olmalı')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Geçerli bir e-posta gir')
    if (password.length < 8) return setError('Şifre en az 8 karakter olmalı')

    setSubmitting(true)
    try {
      await register({ username: username.trim(), email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <>
      <Card surface="raised" behavior="static" padding="spacious" className="mx-auto max-w-sm">
        <form onSubmit={handleSubmit}>
          <h1 className="mb-6 font-display text-2xl font-extrabold text-cream">Kayıt Ol</h1>

          <label className="mb-1 block text-sm font-semibold text-cream/90">Kullanıcı adı</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="3-50 karakter"
            className="input-dark mb-4"
          />

          <label className="mb-1 block text-sm font-semibold text-cream/90">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@mail.com"
            className="input-dark mb-4"
          />

          <label className="mb-1 block text-sm font-semibold text-cream/90">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="En az 8 karakter"
            className="input-dark mb-4"
          />

          {/* ── Onay kutucukları ───────────────────────────────── */}
          <div className="mb-4 mt-2">
            {/* Kullanım koşulları */}
            <div className="register-consent-row">
              <input
                id="consent-terms"
                type="checkbox"
                className="register-consent-checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <label htmlFor="consent-terms" className="register-consent-label">
                <span
                  role="button"
                  tabIndex={0}
                  className="register-consent-trigger"
                  onClick={() => setOpenModal(MODAL_TERMS)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenModal(MODAL_TERMS)}
                >KULLANIM KOŞULLARI VE ÜYELİK SÖZLEŞMESİ</span>{' '}'ni okudum ve kabul ediyorum.
              </label>
            </div>

            {/* KVKK / Gizlilik politikası */}
            <div className="register-consent-row">
              <input
                id="consent-privacy"
                type="checkbox"
                className="register-consent-checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
              />
              <label htmlFor="consent-privacy" className="register-consent-label">
                <span
                  role="button"
                  tabIndex={0}
                  className="register-consent-trigger"
                  onClick={() => setOpenModal(MODAL_PRIVACY)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenModal(MODAL_PRIVACY)}
                >KİŞİSEL VERİLERİN KORUNMASI VE GİZLİLİK POLİTİKASI (KVKK AYDINLATMA METNİ)</span>{' '}'ni okudum ve onaylıyorum.
              </label>
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-cinder-soft">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={submitting}
            disabled={!canSubmit}
          >
            Kayıt Ol
          </Button>

          <p className="mt-4 text-center text-sm text-faded">
            Zaten hesabın var mı?{' '}
            <Button variant="link" as={Link} to="/login">
              Giriş yap
            </Button>
          </p>
        </form>
      </Card>

      {/* ── Kullanım Koşulları Modalı ────────────────────────────── */}
      <LegalModal
        open={openModal === MODAL_TERMS}
        onClose={closeModal}
        title="KULLANIM KOŞULLARI VE ÜYELİK SÖZLEŞMESİ"
      >
        <h3>1. Taraflar ve Kapsam</h3>
        <p>Bu sözleşme, rankhell.com (bundan böyle &quot;Rankhell&quot; veya &quot;Site&quot; olarak anılacaktır) ile platformda hesap oluşturarak siteye kayıt olan kişi (&quot;Üye&quot;) arasında, sitenin kullanım koşullarını ve üyelik şartlarını belirlemek amacıyla düzenlenmiştir. Rankhell üzerinde puan verme, sıralama oluşturma ve yorum yapma özellikleri yalnızca kayıtlı üyelere sunulmaktadır. Üye, kayıt formunu doldurup üyelik işlemini tamamladığı andan itibaren bu sözleşmedeki tüm şartları okuduğunu, anladığını ve kabul ettiğini onaylamış sayılır.</p>

        <h3>2. Üyelik ve Kullanım Şartları</h3>
        <p>2.1. Rankhell, üyelerin ürünleri sıraladığı, 5 üzerinden puan verdiği ve yorum yaptığı etkileşimli bir platformdur. Üyeler, platformdaki özelliklerden faydalanırken dürüstlük kurallarına ve yürürlükteki yasal mevzuata uygun davranmakla yükümlüdür.</p>
        <p>2.2. Üyelik oluşturma aşamasında yaş sınırı bulunmamaktadır. Ancak 18 yaşından küçük üyelerin yasal sorumluluğu gerektiren her türlü işleminde (hesap açma, yorum yapma, veri paylaşımı, puanlama) yasal veli/vasilerinin açık onayını aldıkları kabul edilir. Rankhell, hesap üzerinden gerçekleştirilen işlemlerde doğabilecek hukuki sorunlarda 18 yaş altı üyelerin yasal veli/vasilerini muhatap alır.</p>

        <h3>3. İçerik ve Yorum Sorumluluğu (Kesin Kurallar)</h3>
        <p>3.1. <strong>Kişisel Sorumluluk:</strong> Üyelerin Rankhell üzerinde paylaştığı her türlü yorum, puanlama ve içerikten tamamen ve münhasıran işlemi gerçekleştiren ilgili Üye sorumludur. Rankhell, üyelerin ürettiği içeriklerin doğruluğunu, yasalara uygunluğunu veya tarafsızlığını garanti etmez.</p>
        <p>3.2. <strong>Yasaklı İçerikler:</strong> Üyeler tarafından kişi, kurum, marka veya ürünlere yönelik hakaret, küfür, karalama, asılsız suçlama, iftira, tehdit, ayrımcılık, nefret söylemi ve yasa dışı içerik paylaşılması kesinlikle yasaktır.</p>
        <p>3.3. <strong>Yapay Zeka Destekli Moderasyon:</strong> Rankhell, üyeler tarafından platforma eklenen yorumları ve içerikleri yapay zeka destekli ön kontrol sistemleri ile denetleme hakkını saklı tutar.</p>
        <p>3.4. <strong>İhlal ve Yaptırım Sistemi:</strong> İşbu sözleşmeye veya yasal mevzuata aykırı olduğu tespit edilen, hakaret ve asılsız suçlama içeren yorumlar Rankhell yönetimi tarafından önceden haber verilmeksizin derhal silinir. Bu ihlali gerçekleştiren üyeye uyarı verilebilir veya ihlalin ağırlığına/tekrarına bağlı olarak üyenin hesabı platformdan kalıcı olarak silinip erişimi kapatılabilir.</p>
        <p>3.5. <strong>Bildir/Şikayet Et Mekanizması:</strong> Üyeler, kural ihlali barındırdığını düşündükleri yorumları sitedeki &quot;Şikayet Et&quot; butonu üzerinden Rankhell yönetimine bildirebilirler.</p>

        <h3>4. Hukuki Süreçler ve Log Kayıtları</h3>
        <p>4.1. Rankhell, yasal yükümlülükleri (5651 sayılı Kanun vb.) gereği, platformda hesabı bulunan ve işlem (yorum, puanlama vb.) gerçekleştiren üyelerin IP adreslerini, bağlantı tarihlerini ve saatlerini (log kayıtları) güvenli bir şekilde saklamaktadır.</p>
        <p>4.2. Resmi adli ve idari makamlardan (Savcılık, Mahkemeler, Siber Suçlarla Mücadele vb.) usulüne uygun bir talep gelmesi halinde; hakaret, asılsız suçlama veya yasa dışı işlem yapan üyenin hesap bilgileri ve IP log kayıtları ilgili resmi mercilerle eksiksiz olarak paylaşılacaktır.</p>

        <h3>5. Fikri Mülkiyet ve Lisans Hakları</h3>
        <p>5.1. <strong>Platformun Hakları:</strong> Rankhell platformunun arayüzü, tasarımı, yazılım kodları, veritabanı ve markasına ait tüm fikri mülkiyet hakları Rankhell&apos;e aittir. Üyeler, platformun tasarımını veya kaynak kodlarını kopyalayamaz, çoğaltamaz veya izinsiz kullanamaz.</p>
        <p>5.2. <strong>Üye İçeriklerinin Lisansı:</strong> Üyeler, platforma ekledikleri yorum, metin ve değerlendirmelerin telif haklarına sahip olmakla birlikte; bu içeriklerin Rankhell üzerinde süresiz ve bedelsiz olarak yayınlanması, istatistiksel çalışmalarda kullanılması veya platformun tanıtımında değerlendirilmesi için Rankhell&apos;e münhasır olmayan bir kullanım hakkı (lisans) verdiklerini kabul ederler.</p>

        <h3>6. Hizmet Kesintisi ve Garanti Reddi</h3>
        <p>6.1. Rankhell, platformun kesintisiz, hatasız veya donanımsal/yazılımsal arızalardan tamamen bağımsız çalışacağını garanti etmez.</p>
        <p>6.2. Planlı bakım çalışmaları, sunucu arızaları, siber saldırılar veya mücbir sebeplerden kaynaklanan erişim kesintilerinden ya da bu süreçlerde yaşanabilecek olası veri (yorum, puan, hesap verisi vb.) kayıplarından Rankhell hukuken veya maddi olarak sorumlu tutulamaz.</p>

        <h3>7. Sözleşme Değişiklik Hakkı</h3>
        <p>7.1. Rankhell yönetimi, yasal mevzuat değişiklikleri, platforma eklenecek yeni teknik özellikler veya hizmet politikaları doğrultusunda bu sözleşme maddelerini dilediği zaman tek taraflı olarak değiştirme, güncelleme veya yeni maddeler ekleme hakkına sahiptir.</p>
        <p>7.2. Güncellenen sözleşme hükümleri, sitede yayınlandığı andan itibaren geçerlilik kazanır. Üyelerin platformu kullanmaya ve hesaplarına giriş yapmaya devam etmesi, güncellenmiş sözleşme şartlarını kabul ettikleri anlamına gelir.</p>

        <h3>8. İletişim</h3>
        <p>Üyeler her türlü soru, destek, itiraz ve şikayet talepleri için <strong>support@rankhell.com</strong> e-posta adresi üzerinden Rankhell ile iletişime geçebilirler.</p>
      </LegalModal>

      {/* ── KVKK / Gizlilik Politikası Modalı ───────────────────── */}
      <LegalModal
        open={openModal === MODAL_PRIVACY}
        onClose={closeModal}
        title="KİŞİSEL VERİLERİN KORUNMASI VE GİZLİLİK POLİTİKASI (KVKK AYDINLATMA METNİ)"
      >
        <h3>1. Veri Sorumlusu</h3>
        <p>Rankhell yönetimi (&quot;Rankhell&quot;) olarak, üyelerimizin kişisel verilerinin güvenliğine büyük önem veriyoruz. Bu metin, platformumuzda hesap oluştururken ve üyelik özelliklerini kullanırken toplanan verilerinizin nasıl işlendiği ve korunduğu hakkında sizi bilgilendirmek amacıyla 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında hazırlanmıştır.</p>

        <h3>2. Hangi Kişisel Verilerinizi Topluyoruz?</h3>
        <p>Rankhell&apos;e üye olmanız ve platformun üyelere sunduğu özellikleri kullanmanız süreçlerinde aşağıdaki verileriniz işlenmektedir:</p>
        <ul>
          <li><strong>Kimlik ve İletişim Verileri:</strong> Üye kayıt formunda belirtilen kullanıcı adı ve e-posta adresi.</li>
          <li><strong>İşlem Güvenliği ve Kullanım Verileri:</strong> Üyeliğinize bağlı IP adresiniz, üye girişi-çıkışı (log) kayıtlarınız, tarayıcı bilgileriniz, platform üzerindeki puanlama ve yorum geçmişiniz.</li>
        </ul>

        <h3>3. Kişisel Verilerin İşlenme Amaçları</h3>
        <p>Toplanan kişisel verileriniz yalnızca aşağıdaki amaçlarla işlenmektedir:</p>
        <ul>
          <li>Üyelik kayıt işlemlerinin gerçekleştirilmesi ve üye hesabınızın güvenle yönetilmesi,</li>
          <li>Üyelere özel yorum, puanlama ve sıralama altyapısının sorunsuz çalışmasının sağlanması,</li>
          <li>Yapay zeka algoritmaları kullanılarak platform içi moderasyonun (küfür, hakaret, spam tespiti) gerçekleştirilmesi,</li>
          <li>5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun&apos;dan doğan yasal yükümlülüklerimizin yerine getirilmesi,</li>
          <li>Olası hukuki uyuşmazlıklarda ilgili resmi mercilere sunulmak üzere delil olarak kullanılması,</li>
          <li>Platform kullanımından elde edilen verilerin tamamen anonimleştirilerek istatistiksel bilgi setlerine dönüştürülmesi ve ticari amaçlarla (analiz, raporlama, satış) değerlendirilmesi.</li>
        </ul>

        <h3>4. Çerezler (Cookies) ve Üçüncü Taraf Araçları</h3>
        <p>Üyelerimizin deneyimini analiz etmek, platform performansını artırmak ve ilerleyen süreçlerde sistem geliştirme ile pazarlama faaliyetleri yürütebilmek amacıyla üçüncü taraf izleme ve analiz çerezleri (Google Analytics vb.) kullanılmaktadır. Platforma üye olarak kaydolup giriş yaptığınızda, bu çerezlerin üyelik deneyiminizi iyileştirmek amacıyla kullanımını kabul etmiş olursunuz.</p>

        <h3>5. Kişisel Verilerin Aktarılması ve Ticari Kullanımı</h3>
        <p>Kişisel verileriniz, kural olarak şahsi kimliğinizi belli edecek şekilde üçüncü şahıslarla paylaşılmamaktadır. Ancak:</p>
        <ul>
          <li>Hukuki bir zorunluluk doğması halinde ve resmi makamların (Mahkeme, Savcılık vb.) yasal talebi üzerine yetkili kamu kurum ve kuruluşlarına,</li>
          <li>Platformun altyapı, barındırma (hosting) ve analitik analiz ihtiyaçları için çalıştığımız veri işleyen konumundaki hizmet sağlayıcılara aktarılabilir.</li>
          <li>İlerleyen dönemlerde gerçekleştirilebilecek ticari faaliyetler, pazar araştırmaları, sponsorluk ve reklam anlaşmaları kapsamında; platformdaki eğilimleri, oylama sonuçlarını ve kullanım alışkanlıklarını gösteren veriler, üyelerin kimlikleri tamamen belirsizleştirilmiş (anonimleştirilmiş) ve sadece istatistiksel yığın (aggregate) veri formatında üçüncü taraflara satılabilecek, paylaşılabilecek veya devredilebilecektir. Bu süreçte üyelerimizin şahsi kimlik bilgileri (kullanıcı adı, e-posta vb.) kesinlikle gizli kalacak ve aktarılan istatistiksel veriler üzerinden hiçbir şekilde gerçek kişi tespiti veya eşleştirmesi yapılamayacaktır.</li>
        </ul>

        <h3>6. KVKK Kapsamındaki Haklarınız</h3>
        <p>KVKK&apos;nın 11. maddesi uyarınca üyelerimiz; kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini talep etme ve yasal şartlar oluştuğunda verilerin silinmesini/yok edilmesini talep etme haklarına sahiptir. Taleplerinizi üye olduğunuz e-posta adresi üzerinden <strong>support@rankhell.com</strong> adresine iletebilirsiniz.</p>
      </LegalModal>
    </>
  )
}
