import { useShake } from '../../hooks/shake';
import { Container, ButtonGroup, Title } from './Splash.styles';
import { Button } from '../Button/Button';

export interface SplashProps {
  onStart: () => void;
}

export function Splash({ onStart }: SplashProps) {
  const [shakePermission, checkShakePermission, deny] = useShake(onStart);

  return (
    <Container>
      <Title>ちくみくじです！</Title>
      {shakePermission === null && (
        <>
          <p>Press the button below to enable the shake gesture.</p>
          <ButtonGroup>
            <Button type="button" onClick={checkShakePermission}>
              Grant permissions
            </Button>
            <Button type="button" onClick={deny}>
              Deny
            </Button>
          </ButtonGroup>
        </>
      )}
      {shakePermission === 'granted' && (
        <p>Shake the device or press the "Start" button!</p>
      )}
      <Button type="button" onClick={onStart}>
        Start!
      </Button>
    </Container>
  );
}
