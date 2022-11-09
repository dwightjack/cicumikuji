import { Container, ErrorMessage, Title } from './ErrorLayer.styles';
import { Button } from '../Button/Button';
import { useI18n } from '../../providers/i18n';

export function ErrorLayer({ message }) {
  const { t } = useI18n();
  return (
    <Container>
      <Title>{t('messages.error')}</Title>

      <p>{t('messages.lets_reload')}</p>

      <Button onClick={() => location.reload()}>{t('messages.reload')}</Button>

      {message && (
        <>
          <p>{t('messages.error_detail')}</p>
          <ErrorMessage>{message}</ErrorMessage>
        </>
      )}
    </Container>
  );
}
