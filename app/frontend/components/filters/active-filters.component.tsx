import React from 'react';
import {Badge} from '@/frontend/ui/badge';
import {Button} from '@/frontend/ui/button';
import {XIcon, TagIcon} from 'lucide-react';
import {useCardFiltersStore} from '@/domains/cards/stores/useCardFiltersStore';
import {capitalize, cn} from '@/lib/utils';
import {getCardStatusIconPath} from '@/domains/cards/cards.utils';
import {CardStatus} from '@/domains/cards/cards.types';

export const ActiveFilters: React.FC = () => {
  const {status, labels, removeStatus, removeLabel, clearAllFilters} =
    useCardFiltersStore();

  const hasActiveFilters = status.length > 0 || labels.length > 0;

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2',
        !hasActiveFilters && 'invisible',
      )}
    >
      {!hasActiveFilters && <div className="h-5" />}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {status.map((s: CardStatus) => (
            <Badge
              key={`status-filter-${s}`}
              variant="secondary"
              className="my-0 flex items-center gap-0.5 rounded bg-neutral-700/50 px-1.5 py-0.5 text-xs text-neutral-300 hover:bg-neutral-700/70"
            >
              <img
                src={getCardStatusIconPath(s)}
                alt={s}
                width={12}
                height={12}
                className="mr-1"
              />
              <span>{capitalize(s)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-0.5 h-4 w-4 rounded-full p-0 hover:bg-transparent"
                onClick={() => removeStatus(s)}
              >
                <XIcon
                  size={10}
                  className="text-muted-foreground hover:text-foreground"
                />
              </Button>
            </Badge>
          ))}
          {labels.map(label => (
            <Badge
              key={`label-filter-${label}`}
              variant="secondary"
              className="my-0 flex items-center gap-0.5 rounded bg-neutral-700/50 px-1.5 py-0.5 text-xs text-neutral-300 hover:bg-neutral-700/70"
            >
              <TagIcon size={12} className="mr-1 text-muted-foreground" />
              <span>{label}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-0.5 h-4 w-4 rounded-full p-0 hover:bg-transparent"
                onClick={() => removeLabel(label)}
              >
                <XIcon
                  size={10}
                  className="text-muted-foreground hover:text-foreground"
                />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      {hasActiveFilters && (
        <Button
          variant="link"
          size="sm"
          onClick={clearAllFilters}
          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground hover:no-underline"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};
