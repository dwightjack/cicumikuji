import { sample } from '../../shared/utils';
import { Root, Title, Quote } from './Omikuji.styles';

const omikuji = [
  { type: '凶', quotes: ['だいころす！', '触らないで！'] },
  { type: '小吉', quotes: ['触らないで！', 'お風呂したくない！'] },
  {
    type: '中吉',
    quotes: ['お風呂したくない！', '人間がいないと最高〜', 'おふとん最高〜'],
  },
  { type: '吉', quotes: ['虫うめぇ〜！', 'おふとん最高〜'] },
  { type: '大吉', quotes: ['虫うめぇ〜！', 'おふとん最高〜'] },
];

const genericQuotes = [
  '虫くれ！',
  'かゆい',
  'お腹へった',
  'ねむい〜',
  '虫まだ？',
];

export function Omikuji() {
  const { type, quotes } = sample(omikuji);
  const quote = sample([...quotes, ...quotes, ...genericQuotes]);

  return (
    <Root>
      <Title>{type}</Title>
      <Quote>{quote}</Quote>
    </Root>
  );
}
