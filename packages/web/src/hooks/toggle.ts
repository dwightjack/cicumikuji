import { useState } from 'preact/hooks';

export function useToggle() {
  const [toggled, setToggle] = useState(false);
  function toggleState() {
    setToggle((t) => !t);
  }
  return [toggled, toggleState] as const;
}
