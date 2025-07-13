'use client';

import {ReactNode} from 'react';
import {HotkeysProvider} from 'react-hotkeys-hook';
import {useKeyboardShortcuts} from '@/frontend/hooks/use-keyboard-shortcuts';

type KeyboardShortcutsProviderProps = {
  children: ReactNode;
  initialScopes?: string[];
};

export const KeyboardShortcutsProvider = (
  props: KeyboardShortcutsProviderProps,
) => {
  const {children, initialScopes = ['global']} = props;

  // Note: Ensures the hook runs **after** the HotkeysProvider is initialized
  const KeyboardShortcutsInit = () => {
    useKeyboardShortcuts();
    return null;
  };

  return (
    <HotkeysProvider initiallyActiveScopes={initialScopes}>
      <KeyboardShortcutsInit />
      {children}
    </HotkeysProvider>
  );
};
