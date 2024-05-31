import { useI18n } from '../../providers/i18n';
import type { LocaleDb } from '../../shared/types';
import { Root, Select } from './LangSelect.styles';

export function LangSelect() {
  const { locale, locales, t } = useI18n();

  function onChange(e: Event) {
    locale.value = (e.target as HTMLInputElement).value as keyof LocaleDb;
  }

  return (
    <Root>
      <span>{t('messages.language')}</span>
      <Select name="lang" onChange={onChange}>
        {locales.map(({ id, label }) => (
          <option value={id} selected={id === locale.value} key={id}>
            {label}
          </option>
        ))}
      </Select>
    </Root>
  );
}
