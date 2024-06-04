import { useSignal } from '@preact/signals';

export function useToggle() {
  const toggled = useSignal(false);
  function toggleState() {
    toggled.value = !toggled.value;
  }
  return [toggled, toggleState] as const;
}
