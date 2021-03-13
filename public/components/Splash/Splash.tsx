import { Container, ButtonGroup, Title } from './Splash.styles';
import { Button } from '../Button/Button';
import { ShakePermission } from '../../hooks/shake';
export interface SplashProps {
  onGrant: () => void;
  onStart: () => void;
  onDeny: () => void;
  permission: ShakePermission;
}

export function Splash({ onGrant, onDeny, permission, onStart }: SplashProps) {
  return (
    <Container>
      <Title>ちくみくじです！</Title>
      {permission === null && (
        <>
          <p>Press the button below to enable the shake gesture.</p>
          <ButtonGroup>
            <Button type="button" onClick={onGrant}>
              Grant permissions
            </Button>
            <Button type="button" onClick={onDeny}>
              Deny
            </Button>
          </ButtonGroup>
        </>
      )}
      {permission === 'granted' && (
        <p>Shake the device or press the "Start" button!</p>
      )}
      <Button type="button" onClick={onStart}>
        Start!
      </Button>
    </Container>
  );
}
