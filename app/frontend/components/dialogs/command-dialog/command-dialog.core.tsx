import {
  PlusIcon,
  ArrowRightIcon,
  Sparkles,
  TagIcon,
  TrashIcon,
  PlayIcon,
  SettingsIcon,
} from 'lucide-react';
import {useNavigate} from '@tanstack/react-router';
import {useDialog} from '@/frontend/hooks/use-dialog';
import {
  useActiveCard,
  useCards,
  useSelectedCards,
} from '@/domains/cards/cards.hooks';
import {CommandGroup} from '@/frontend/components/dialogs/command-dialog/command-dialog.types';
import {removeCards} from '@/domains/cards/cards.db';
import {queueCards} from '@/domains/studies/studies.db';
import {useToolbar} from '@/frontend/hooks/use-toolbar';
import {useStudyMode} from '@/domains/studies/studies.hooks';
import {
  getCardStatus,
  getCardStatusIconPath,
} from '@/domains/cards/cards.utils';
import {DatabaseType} from 'zero/zero.types';

const LIMIT_OF_SEARCH_RESULTS = 20;

export const useGetCommandContent = (
  db: DatabaseType,
  searchTerm: string = '',
): CommandGroup[] => {
  const navigate = useNavigate();
  const {openDialog, closeDialog} = useDialog();
  const {selectedCardIds, setSelectedCardIds} = useSelectedCards();
  const {setIsOpen} = useToolbar();
  const {setMode} = useStudyMode(db);
  const {cards, isLoading} = useCards(db);

  // Card
  const setActiveCardId = useActiveCard(state => state.setActiveCardId);

  const createNewCard = (cardId?: string) => {
    openDialog('CardDialog', {
      props: {
        db,
        card: null,
      },
      ...(cardId && {
        onOpen: () => setActiveCardId(cardId),
        onClose: () => setActiveCardId(null),
      }),
    });
  };

  const createCardsWithAi = () => {
    openDialog('CardGenerationDialog', {
      props: {
        db,
        initialPrompt: '',
        onClose: closeDialog,
      },
    });
    setSelectedCardIds([]);
    setIsOpen(false);
  };

  const changeLabels = () => {
    openDialog('LabelsDialog', {
      props: {
        db,
        cardIds: selectedCardIds,
        onClose: closeDialog,
      },
    });
  };

  const removeLabel = () => {
    openDialog('RemoveLabelDialog', {
      props: {
        db,
        cardIds: selectedCardIds,
        onClose: closeDialog,
      },
    });
  };

  const handleDeleteCards = async () => {
    await removeCards(db, selectedCardIds);
    setSelectedCardIds([]);
    setIsOpen(false);
    closeDialog();
  };

  const studyNow = async () => {
    await queueCards(db, selectedCardIds);
    await setMode('onDemand');
    setIsOpen(false);
    setSelectedCardIds([]);
    closeDialog();
    navigate({to: '/study'});
  };

  // Navigation
  const goToLibrary = () => {
    navigate({to: '/cards'});
    closeDialog();
  };

  const goToStudy = () => {
    navigate({to: '/study'});
    closeDialog();
  };

  const goToProgress = () => {
    navigate({to: '/progress'});
    closeDialog();
  };

  const goToSettings = () => {
    navigate({to: '/settings'});
    closeDialog();
  };

  // Labels
  const goToSettingsLabels = () => {
    navigate({to: '/settings'});
    closeDialog();
  };

  // Search
  const openCard = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    openDialog('CardDialog', {
      props: {
        db,
        card,
      },
      onOpen: () => setActiveCardId(cardId),
      onClose: () => setActiveCardId(null),
    });

    setSelectedCardIds([cardId]);
    setIsOpen(true);
  };

  const getFilteredCards = () => {
    if (!searchTerm || isLoading) return [];

    return cards
      .filter(card =>
        card.question.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .slice(0, LIMIT_OF_SEARCH_RESULTS);
  };

  const baseCommands = [
    {
      heading: 'Card',
      items: [
        {
          id: 'create-new-card',
          icon: (
            <PlusIcon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Create new card...',
          shortcut: ['C'],
          action: createNewCard,
        },
        {
          id: 'create-cards-ai',
          icon: (
            <Sparkles className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Create new cards with AI...',
          shortcut: ['Shift', 'C'],
          action: createCardsWithAi,
        },
        {
          id: 'change-labels',
          icon: (
            <TagIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Change or add labels...',
          shortcut: ['L'],
          action: changeLabels,
          disabled: selectedCardIds.length === 0,
        },
        {
          id: 'remove-label',
          icon: (
            <TagIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Remove label...',
          shortcut: ['Shift', 'L'],
          action: removeLabel,
          disabled: selectedCardIds.length === 0,
        },
        {
          id: 'delete-cards',
          icon: (
            <TrashIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Delete cards...',
          shortcut: ['Del'],
          action: handleDeleteCards,
          disabled: selectedCardIds.length === 0,
        },
        {
          id: 'study-now',
          icon: (
            <PlayIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Study now...',
          shortcut: ['Enter'],
          action: studyNow,
          disabled: selectedCardIds.length === 0,
        },
      ],
    },
    {
      heading: 'Navigation',
      items: [
        {
          id: 'go-to-library',
          icon: (
            <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Go to Library',
          shortcut: ['⌘', 'L'],
          action: goToLibrary,
        },
        {
          id: 'go-to-study',
          icon: (
            <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Go to Study',
          shortcut: ['⌘', 'S'],
          action: goToStudy,
        },
        {
          id: 'go-to-progress',
          icon: (
            <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Go to Progress',
          shortcut: ['⌘', 'P'],
          action: goToProgress,
        },
        {
          id: 'go-to-settings',
          icon: (
            <SettingsIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Go to Settings',
          shortcut: ['⌘', 'S'],
          action: goToSettings,
        },
      ],
    },
    {
      heading: 'Label',
      items: [
        {
          id: 'create-new-label',
          icon: (
            <PlusIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Create new label...',
          action: goToSettingsLabels,
        },
        {
          id: 'edit-label',
          icon: (
            <TagIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Edit label...',
          action: goToSettingsLabels,
        },
        {
          id: 'delete-label',
          icon: (
            <TrashIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
          ),
          label: 'Delete label...',
          action: goToSettingsLabels,
        },
      ],
    },
  ];

  const searchCommand: CommandGroup = {
    heading: `Search for "${searchTerm}"`,
    items: getFilteredCards().map(card => {
      const status = getCardStatus(
        new Date(card.createdAt),
        card.studyState.lastStudiedAt,
        card.studyState.nextStudiedAt,
      );

      return {
        id: card.id,
        icon: (
          <img
            src={getCardStatusIconPath(status)}
            alt="Card status"
            width={16}
            height={16}
          />
        ),
        label: card.question,
        action: () => openCard(card.id),
      };
    }),
  };

  return [...baseCommands, searchCommand];
};
