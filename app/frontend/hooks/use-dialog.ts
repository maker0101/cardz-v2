import {create} from 'zustand';
import {DialogState} from '@/frontend/components/dialog/dialog.types';

export const useDialog = create<DialogState>(set => ({
  dialog: null,
  openDialog: (name, options) => {
    options.onOpen?.();
    set(() => ({
      dialog: {
        name,
        props: options.props,
        onClose: options.onClose,
        onOpen: options.onOpen,
      },
    }));
  },
  closeDialog: () =>
    set(state => {
      state.dialog?.onClose?.();
      return {dialog: null};
    }),
}));
