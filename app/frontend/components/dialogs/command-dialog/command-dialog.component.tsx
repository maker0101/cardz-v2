import {Fragment, useState} from 'react';
import {
  CommandDialog as CommandDialogUI,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/frontend/ui/command';
import {CommandDialogProps} from '@/frontend/components/dialogs/command-dialog/command-dialog.types';
import {useGetCommandContent} from '@/frontend/components/dialogs/command-dialog/command-dialog.core';
import {DialogTitle, DialogDescription} from '@/frontend/ui/dialog';
import {useSelectedCards} from '@/domains/cards/cards.hooks';

export const CommandDialog: React.FC<CommandDialogProps> = ({db, onClose}) => {
  const [inputValue, setInputValue] = useState('');
  const content = useGetCommandContent(db, inputValue);
  const {selectedCardIds} = useSelectedCards();

  return (
    <CommandDialogUI open onOpenChange={onClose} showCloseButton={false}>
      <DialogTitle />
      <DialogDescription />
      {selectedCardIds.length > 0 && (
        <div className="p-3 pb-1">
          <span className="text-[color:hsl(220,5.66%,89.61%))] inline-flex items-center rounded-[5px] border-[0.5px] border-[color:hsl(222.86,7.37%,18.63%)] bg-[hsl(222.86,10.45%,13.14%)] px-2 py-1 text-xs">
            {`${selectedCardIds.length} card${
              selectedCardIds.length > 1 ? 's' : ''
            }`}
          </span>
        </div>
      )}
      <CommandInput
        placeholder="Type a command or search..."
        value={inputValue}
        onValueChange={setInputValue}
        className="ml-1"
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {content.map(group => {
          if (group.items.filter(item => !item.disabled).length === 0) {
            return null;
          }
          return (
            <Fragment key={group.heading}>
              <CommandGroup heading={group.heading}>
                {group.items
                  .filter(item => !item.disabled)
                  .map(item => (
                    <CommandItem
                      key={item.id}
                      value={item.label}
                      onSelect={() => {
                        item.action();
                        setInputValue('');
                      }}
                      disabled={item.disabled}
                    >
                      <div className="mr-2 flex w-6 items-center justify-center">
                        {item.icon}
                      </div>
                      <span className="truncate">{item.label}</span>
                      {!!item.shortcut?.length && (
                        <div className="ml-auto flex items-center">
                          {item.shortcut.map((char, index) => (
                            <CommandShortcut key={index}>
                              {char}
                            </CommandShortcut>
                          ))}
                        </div>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </Fragment>
          );
        })}
      </CommandList>
    </CommandDialogUI>
  );
};
