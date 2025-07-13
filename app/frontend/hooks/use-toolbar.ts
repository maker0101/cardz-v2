import {create} from 'zustand';

interface ToolbarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const useToolbarStore = create<ToolbarState>(set => ({
  isOpen: false,
  setIsOpen: isOpen => set({isOpen}),
}));

export const useToolbar = () => {
  const {isOpen, setIsOpen} = useToolbarStore();

  return {
    isOpen,
    setIsOpen,
    isLoading: false,
  };
};
