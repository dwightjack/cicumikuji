import { useI18n } from '../../providers/i18n';
import { sample } from '../../shared/utils';
import { Root, Title, Quote, Mark } from './Omikuji.styles';

const genericQuotes = [0, 1, 2, 3, 4];

const omikuji = [
  { type: 'low', quotes: [5, 6] },
  {
    type: 'little',
    quotes: [6, 7],
  },
  {
    type: 'normal',
    quotes: [7, 8, 10],
  },
  { type: 'good', quotes: [9, 10] },
  { type: 'best', quotes: [9, 10] },
];

export function Omikuji() {
  const { t, locale } = useI18n();

  const { type, quotes } = sample(omikuji);
  const quote = sample([...quotes, ...quotes, ...genericQuotes]);

  return (
    <Root>
      <Title>
        {locale !== 'ja' && (
          <Mark lang="ja">{t(`fortune.${type}` as any, '', 'ja')}</Mark>
        )}
        <span>{t(`fortune.${type}` as any)}</span>
      </Title>
      <Quote>{t(`quotes.${quote}` as any)}</Quote>
    </Root>
  );
}
