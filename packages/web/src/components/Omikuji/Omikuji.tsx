import { useMemo } from 'preact/hooks';
import { useI18n } from '../../providers/i18n';
import { sample } from '../../shared/utils';
import { Mark, Quote, Root, Title } from './Omikuji.styles';

const genericQuotes = [0, 1, 2, 3, 4] as const;

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
] as const;

export function Omikuji() {
  const { t, locale } = useI18n();
  const [type, quote] = useMemo(() => {
    const { type, quotes } = sample(omikuji);
    const quote = sample([...quotes, ...quotes, ...genericQuotes]);
    return [type, quote];
  }, []);

  return (
    <Root>
      <Title>
        {locale.value !== 'ja' && (
          <Mark lang="ja">{t(`fortune.${type}`, '', 'ja')}</Mark>
        )}
        <span>{t(`fortune.${type}`)}</span>
      </Title>
      <Quote>{t(`quotes.${quote}` as any)}</Quote>
    </Root>
  );
}
