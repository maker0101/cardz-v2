'use client';

import {useHotkeys} from 'react-hotkeys-hook';
import {useNavigate} from '@tanstack/react-router';
import {DialogState} from '@/frontend/components/dialog/dialog.types';
import {useDialog} from '@/frontend/hooks/use-dialog';
import {useEffect, useMemo} from 'react';
import {useHotkeysContext} from 'react-hotkeys-hook';

export const HOTKEY_SCOPES = {
  GLOBAL: 'global',
  LIBRARY: 'library',
} as const;

type HotkeyScope = (typeof HOTKEY_SCOPES)[keyof typeof HOTKEY_SCOPES];

export type KeyboardShortcutDef = {
  name: string;
  description: string;
  keys: string;
  scope: HotkeyScope;
  action: () => void;
  disabled?: boolean;
};

export const useHotkeyScope = (
  scopeOrScopes: HotkeyScope | HotkeyScope[] | undefined,
) => {
  const {enableScope, disableScope} = useHotkeysContext();

  const scopes = useMemo(() => {
    if (!scopeOrScopes) return [];

    const potentialScopes = Array.isArray(scopeOrScopes)
      ? scopeOrScopes
      : [scopeOrScopes];

    const filteredScopes = potentialScopes.filter(s => {
      if (s === HOTKEY_SCOPES.GLOBAL) {
        console.warn(
          'useHotkeyScope should not be used to manage the GLOBAL scope. Ignoring.',
        );
        return false;
      }
      return true;
    });

    return [...new Set(filteredScopes)];
  }, [scopeOrScopes]);

  useEffect(() => {
    if (scopes.length === 0) {
      return;
    }

    scopes.forEach(s => enableScope(s));

    return () => {
      scopes.forEach(s => disableScope(s));
    };
  }, [scopes, enableScope, disableScope]);
};

export const useKeyboardShortcut = (shortcutDef: KeyboardShortcutDef) => {
  const {keys, description, scope, action, disabled} = shortcutDef;

  useHotkeys(
    keys,
    event => {
      event.preventDefault();
      action();
    },
    {
      enabled: !disabled,
      scopes:
        scope === HOTKEY_SCOPES.GLOBAL
          ? [HOTKEY_SCOPES.GLOBAL]
          : Array.isArray(scope)
            ? scope
            : [scope],
      description: description,
    },
    [action, keys, disabled, description, scope],
  );
};

export const createShortcuts = (
  navigate: ReturnType<typeof useNavigate>,
  dialogApi: DialogState,
) => ({
  COMMAND_MENU: {
    name: 'Command Menu',
    description: 'Open the command menu',
    keys: 'mod+k',
    scope: HOTKEY_SCOPES.GLOBAL,
    action: () => {
      if (dialogApi.dialog?.name === 'CommandDialog') {
        dialogApi.closeDialog();
      } else {
        dialogApi.openDialog('CommandDialog', {
          props: {
            onClose: dialogApi.closeDialog,
          },
        });
      }
    },
  },
  CREATE_NEW_CARD: {
    name: 'Create New Card',
    description: 'Create a new card',
    keys: 'c',
    scope: HOTKEY_SCOPES.GLOBAL,
    action: () => {
      dialogApi.openDialog('CardDialog', {
        props: {
          card: null,
        },
      });
    },
  },
  LIBRARY_PAGE: {
    name: 'Library Page',
    description: 'Navigate to the library page',
    keys: 'mod+l',
    scope: HOTKEY_SCOPES.GLOBAL,
    action: () => {
      navigate({to: '/cards'});
    },
  },
  STUDY_PAGE: {
    name: 'Study Page',
    description: 'Navigate to the study page',
    keys: 'mod+s',
    scope: HOTKEY_SCOPES.GLOBAL,
    action: () => {
      navigate({to: '/study'});
    },
  },
  PROGRESS_PAGE: {
    name: 'Progress Page',
    description: 'Navigate to the progress page',
    keys: 'mod+p',
    scope: HOTKEY_SCOPES.GLOBAL,
    action: () => {
      navigate({to: '/progress'});
    },
  },
  SETTINGS_PAGE: {
    name: 'Settings Page',
    description: 'Navigate to the settings page',
    keys: 'mod+,',
    scope: HOTKEY_SCOPES.GLOBAL,
    action: () => {
      navigate({to: '/settings'});
    },
  },
});

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const dialogApi = useDialog();

  const shortcuts = createShortcuts(navigate, dialogApi);

  useKeyboardShortcut(shortcuts.COMMAND_MENU);
  useKeyboardShortcut(shortcuts.CREATE_NEW_CARD);
  useKeyboardShortcut(shortcuts.LIBRARY_PAGE);
  useKeyboardShortcut(shortcuts.STUDY_PAGE);
  useKeyboardShortcut(shortcuts.PROGRESS_PAGE);
  useKeyboardShortcut(shortcuts.SETTINGS_PAGE);

  return shortcuts;
};
