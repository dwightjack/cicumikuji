import { useAppState } from '../../providers/appState';
import { useI18n } from '../../providers/i18n';
import { Button } from '../Button/Button';
import { Container, ErrorMessage, Title } from './ErrorLayer.styles';

export function ErrorLayer() {
  const { t } = useI18n();
  const { appError } = useAppState();

  if (!appError.value) {
    return null;
  }
  return (
    <Container>
      <Title>{t('messages.error')}</Title>

      <p>{t('messages.lets_reload')}</p>

      <Button onClick={() => location.reload()}>{t('messages.reload')}</Button>

      <p>{t('messages.error_detail')}</p>
      <ErrorMessage>{appError.value}</ErrorMessage>
    </Container>
  );
}
