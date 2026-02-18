import { useT } from '../../i18n/useT'
import './CookieBanner.scss'

interface CookieBannerProps {
  onAccept: () => void
  onDecline: () => void
  onLearnMore: () => void
}

export function CookieBanner({ onAccept, onDecline, onLearnMore }: CookieBannerProps) {
  const t = useT()

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent" aria-modal="false">
      <p className="cookie-banner__message">{t('cookieBanner.message')}</p>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__btn cookie-banner__btn--secondary" onClick={onLearnMore}>
          {t('cookieBanner.learnMore')}
        </button>
        <button type="button" className="cookie-banner__btn cookie-banner__btn--decline" onClick={onDecline}>
          {t('cookieBanner.decline')}
        </button>
        <button type="button" className="cookie-banner__btn cookie-banner__btn--accept" onClick={onAccept}>
          {t('cookieBanner.accept')}
        </button>
      </div>
    </div>
  )
}
