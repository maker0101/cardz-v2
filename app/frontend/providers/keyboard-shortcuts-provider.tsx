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

  // Render a separate component so the hook runs **after** the HotkeysProvider
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
