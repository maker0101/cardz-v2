import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {CheckIcon} from 'lucide-react';

import {cn} from '@/frontend/lib/utils';

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer pointer-events-none h-3.5 w-3.5 shrink-0 cursor-default rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-[color:hsl(234.26,55.56%,59.41%)] dark:data-[state=checked]:bg-[color:hsl(234.26,55.56%,59.41%)] dark:data-[state=checked]:text-white',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex h-[0.875rem] items-center justify-center text-current"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export {Checkbox};
