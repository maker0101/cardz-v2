'use client';

import {ReactNode} from 'react';
import {HotkeysProvider} from 'react-hotkeys-hook';
import {useKeyboardShortcuts} from '@/frontend/hooks/use-keyboard-shortcuts';
import {ZeroType} from 'zero/zero.types';

type KeyboardShortcutsProviderProps = {
  children: ReactNode;
  initialScopes?: string[];
  z: ZeroType;
};

export const KeyboardShortcutsProvider = (
  props: KeyboardShortcutsProviderProps,
) => {
  const {children, initialScopes = ['global'], z} = props;

  // Note: Ensures the hook runs **after** the HotkeysProvider is initialized
  const KeyboardShortcutsInit = () => {
    useKeyboardShortcuts(z);
    return null;
  };

  return (
    <HotkeysProvider initiallyActiveScopes={initialScopes}>
      <KeyboardShortcutsInit />
      {children}
    </HotkeysProvider>
  );
};
