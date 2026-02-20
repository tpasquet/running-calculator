import { useT } from '../../i18n/useT'
import './Legal.scss'

type LegalPage = 'legal' | 'privacy' | 'terms' | 'cookies' | 'credits'

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

      {page === 'credits' && (
        <>
          <h1 className="legal__title">{t('credits.title')}</h1>
          <p>{t('credits.intro')}</p>

          <h2>{t('credits.vdotTitle')}</h2>
          <p>{t('credits.vdotBody')}</p>
          <ul className="legal__refs">
            <li>{t('credits.vdotRef')}</li>
            <li>{t('credits.vdotRef2')}</li>
          </ul>

          <h2>{t('credits.riegelTitle')}</h2>
          <p>{t('credits.riegelBody')}</p>
          <ul className="legal__refs">
            <li>{t('credits.riegelRef')}</li>
          </ul>

          <h2>{t('credits.karvonenTitle')}</h2>
          <p>{t('credits.karvonenBody')}</p>
          <ul className="legal__refs">
            <li>{t('credits.karvonenRef')}</li>
          </ul>

          <h2>{t('credits.masTitle')}</h2>
          <p>{t('credits.masBody')}</p>
          <ul className="legal__refs">
            <li>{t('credits.masRef')}</li>
          </ul>

          <h2>{t('credits.borgTitle')}</h2>
          <p>{t('credits.borgBody')}</p>
          <ul className="legal__refs">
            <li>{t('credits.borgRef')}</li>
          </ul>

          <h2>{t('credits.rpeTitle')}</h2>
          <p>{t('credits.rpeBody')}</p>
          <ul className="legal__refs">
            <li>{t('credits.rpeRef')}</li>
          </ul>

          <p className="legal__open-source">{t('credits.openSource')}</p>
        </>
      )}
    </article>
  )
}
