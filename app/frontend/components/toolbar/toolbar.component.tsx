import {useNavigate} from '@tanstack/react-router';
import {PlayIcon, XIcon, CommandIcon} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/frontend/ui/button';
import {useSelectedCards} from '@/domains/cards/cards.hooks';
import {queueCards} from '@/domains/studies/studies.db';
import {useStudyMode} from '@/domains/studies/studies.hooks';
import {useToolbar} from '@/frontend/hooks/use-toolbar';
import {useDialog} from '@/frontend/hooks/use-dialog';
import {ZeroType} from 'zero/zero.types';

interface ToolbarProps {
  z: ZeroType;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const Toolbar = (props: ToolbarProps) => {
  const {z, isOpen} = props;
  const navigate = useNavigate();
  const {selectedCardIds, setSelectedCardIds} = useSelectedCards();
  const {setMode} = useStudyMode(z);
  const {openDialog} = useDialog();

  const {setIsOpen} = useToolbar();

  const clearSelection = () => {
    setIsOpen(false);
    setSelectedCardIds([]);
  };

  const studyNow = async () => {
    await queueCards(z, selectedCardIds);
    await setMode('onDemand');
    setIsOpen(false);
    setSelectedCardIds([]);
    navigate({to: '/study'});
  };

  const openCommandDialog = () => {
    openDialog('CommandDialog', {
      props: {
        onClose: () => {
          setIsOpen(false);
          setSelectedCardIds([]);
        },
      },
    });
  };

  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 transform rounded-lg bg-[hsl(224.29,6.59%,9.78%)] shadow-lg',
        'transition-all duration-300 ease-in-out',
        isOpen
          ? 'bottom-4 translate-y-0 opacity-100'
          : 'pointer-events-none bottom-0 translate-y-full opacity-0',
      )}
    >
      <div className="flex items-center gap-2 p-2">
        <div className="dark:text-[color:hsl(220,5.66%,89.61%))] flex items-center gap-1 rounded-sm border-[0.5px] border-dashed pl-2 dark:border-[color:hsl(222.86,7.37%,18.63%)]">
          <span className="text-xs">{`${selectedCardIds.length} selected`}</span>
          <Button
            variant="ghost"
            size="default"
            className="group mt-0 px-1 hover:bg-transparent"
            onClick={clearSelection}
          >
            <XIcon className="h-4 w-4 text-[#969799] group-hover:text-[color:hsl(0,0%,99.8%)]" />
          </Button>
        </div>

        <Button
          variant="secondary"
          size="default"
          className="mt-0"
          onClick={studyNow}
        >
          <PlayIcon className="h-3.5 w-3.5 text-[color:hsl(0,0%,99.8%)]" />
          <span>Study now</span>
        </Button>

        <Button
          variant="secondary"
          size="default"
          className="mt-0"
          onClick={openCommandDialog}
        >
          <CommandIcon className="h-3.5 w-3.5 text-[color:hsl(0,0%,99.8%)]" />
          <span>Command</span>
        </Button>
      </div>
    </div>
  );
};
