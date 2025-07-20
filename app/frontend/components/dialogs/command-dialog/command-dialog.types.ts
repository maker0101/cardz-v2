import {ZeroType} from 'zero/zero.types';

export type CommandItem = {
  id: string;
  icon?: React.ReactNode;
  label: string;
  shortcut?: string[];
  action: () => void;
  disabled?: boolean;
};

export type CommandGroup = {
  heading: string;
  items: CommandItem[];
};

export type CommandDialogProps = {
  z: ZeroType;
  onClose: () => void;
};
