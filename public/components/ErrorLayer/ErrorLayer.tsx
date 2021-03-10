import { Container, ErrorMessage, Title } from './ErrorLayer.styles';
import { Button } from '../Button/Button';

export function ErrorLayer({ message }) {
  return (
    <Container>
      <Title>An error occurred!</Title>

      <p>Let's try reloading the app...</p>

      <Button onClick={() => location.reload()}>Reload!</Button>

      {message && (
        <>
          <p>Error detail:</p>
          <ErrorMessage>{message}</ErrorMessage>
        </>
      )}
    </Container>
  );
}
