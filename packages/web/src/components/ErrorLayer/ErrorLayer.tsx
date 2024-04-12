import { useI18n } from '../../providers/i18n';
import { Button } from '../Button/Button';
import { Container, ErrorMessage, Title } from './ErrorLayer.styles';

interface ErrorLayerProps {
  message: string;
}

export function ErrorLayer({ message }: ErrorLayerProps) {
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
