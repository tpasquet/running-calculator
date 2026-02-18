import { useT } from '../../i18n/useT'
import './Footer.scss'

interface FooterProps {
  onNavigate: (page: 'legal' | 'privacy' | 'terms' | 'cookies') => void
}

export function Footer({ onNavigate }: FooterProps) {
  const t = useT()
  const year = new Date().getFullYear().toString()

  return (
    <footer className="app-footer">
      <nav className="app-footer__links" aria-label="Legal">
        <button type="button" className="app-footer__link" onClick={() => onNavigate('legal')}>
          {t('footer.legal')}
        </button>
        <button type="button" className="app-footer__link" onClick={() => onNavigate('privacy')}>
          {t('footer.privacy')}
        </button>
        <button type="button" className="app-footer__link" onClick={() => onNavigate('terms')}>
          {t('footer.terms')}
        </button>
        <button type="button" className="app-footer__link" onClick={() => onNavigate('cookies')}>
          {t('footer.cookies')}
        </button>
      </nav>
      <p className="app-footer__copyright">{t('footer.copyright', { year })}</p>
    </footer>
  )
}
