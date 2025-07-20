import {ReactNode} from 'react';
import {HotkeysProvider} from 'react-hotkeys-hook';
import {useKeyboardShortcuts} from '@/frontend/hooks/use-keyboard-shortcuts';
import {DatabaseType} from 'zero/zero.types';

type KeyboardShortcutsProviderProps = {
  db: DatabaseType;
  children: ReactNode;
  initialScopes?: string[];
};

export const KeyboardShortcutsProvider = (
  props: KeyboardShortcutsProviderProps,
) => {
  const {children, initialScopes = ['global'], db} = props;

  // Note: Ensures the hook runs **after** the HotkeysProvider is initialized
  const KeyboardShortcutsInit = () => {
    useKeyboardShortcuts(db);
    return null;
  };

  return (
    <HotkeysProvider initiallyActiveScopes={initialScopes}>
      <KeyboardShortcutsInit />
      {children}
    </HotkeysProvider>
  );
};
