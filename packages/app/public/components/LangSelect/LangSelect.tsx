import { useI18n } from '../../providers/i18n';
import { LocaleDb } from '../../shared/locale';
import { Root, Select } from './LangSelect.styles';

export function LangSelect() {
  const { locale, locales, t, setLocale } = useI18n();

  function onChange(e: Event) {
    setLocale((e.target as HTMLInputElement).value as keyof LocaleDb);
  }

  return (
    <Root>
      <span>{t('messages.language')}</span>
      <Select name="lang" onChange={onChange}>
        {locales.map(({ id, label }) => (
          <option value={id} selected={id === locale}>
            {label}
          </option>
        ))}
      </Select>
    </Root>
  );
}
