import { useT } from '../../i18n/useT'
import './Legal.scss'

type LegalPage = 'legal' | 'privacy' | 'terms' | 'cookies'

interface LegalProps {
  page: LegalPage
}

export function Legal({ page }: LegalProps) {
  const t = useT()

  return (
    <article className="legal">
      {page === 'legal' && (
        <>
          <h1 className="legal__title">{t('legal.noticeTitle')}</h1>
          <dl className="legal__dl">
            <dt>{t('legal.noticeSite')}</dt>
            <dd>https://running-calculator.app/</dd>
            <dt>{t('legal.noticePublisher')}</dt>
            <dd>{t('legal.noticePublisherValue')}</dd>
            <dt>{t('legal.noticeHost')}</dt>
            <dd>{t('legal.noticeHostValue')}</dd>
            <dt>{t('legal.noticeContact')}</dt>
            <dd>{t('legal.noticeContactValue')}</dd>
          </dl>
        </>
      )}

      {page === 'privacy' && (
        <>
          <h1 className="legal__title">{t('legal.privacyTitle')}</h1>
          <p>{t('legal.privacyIntro')}</p>
          <h2>{t('legal.privacyDataTitle')}</h2>
          <p>{t('legal.privacyDataBody')}</p>
          <h2>{t('legal.privacyCookiesTitle')}</h2>
          <p>{t('legal.privacyCookiesBody')}</p>
          <h2>{t('legal.privacyThirdTitle')}</h2>
          <p>{t('legal.privacyThirdBody')}</p>
          <h2>{t('legal.privacyRightsTitle')}</h2>
          <p>{t('legal.privacyRightsBody')}</p>
        </>
      )}

      {page === 'terms' && (
        <>
          <h1 className="legal__title">{t('legal.termsTitle')}</h1>
          <p>{t('legal.termsIntro')}</p>
          <h2>{t('legal.termsServiceTitle')}</h2>
          <p>{t('legal.termsServiceBody')}</p>
          <h2>{t('legal.termsAccuracyTitle')}</h2>
          <p>{t('legal.termsAccuracyBody')}</p>
          <h2>{t('legal.termsAvailabilityTitle')}</h2>
          <p>{t('legal.termsAvailabilityBody')}</p>
        </>
      )}

      {page === 'cookies' && (
        <>
          <h1 className="legal__title">{t('legal.cookiesTitle')}</h1>
          <p>{t('legal.cookiesIntro')}</p>
          <h2>{t('legal.cookiesWhatTitle')}</h2>
          <p>{t('legal.cookiesWhatBody')}</p>
          <h2>{t('legal.cookiesControlTitle')}</h2>
          <p>{t('legal.cookiesControlBody')}</p>
          <h2>{t('legal.cookiesAnalyticsTitle')}</h2>
          <p>{t('legal.cookiesAnalyticsBody')}</p>
          <h2>{t('legal.cookiesNoTrackTitle')}</h2>
          <p>{t('legal.cookiesNoTrackBody')}</p>
        </>
      )}
    </article>
  )
}
