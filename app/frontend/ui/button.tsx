import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';

const buttonVariants = cva(
  'cursor-default inline-flex items-center justify-center whitespace-nowrap rounded-[5px] text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2',
  {
    variants: {
      variant: {
        default:
          'bg-primary dark:bg-[color:hsl(234.26,55.56%,59.41%)] hover:dark:bg-[color:hsl(234.1,70.93%,66.27%)] dark:text-[color:hsl(0,0%,99.8%)] hover:bg-primary/90 dark:border-[color:hsl(234.1,70.93%,66.27%)] border-[0.5px]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-primary dark:bg-[color:hsl(222.86,10.45%,13.14%)] hover:dark:bg-[color:hsl(226.67deg,10.59%,16.67%)] dark:text-[color:hsl(220,5.66%,89.61%))] hover:bg-primary/90 dark:border-[color:hsl(222.86,7.37%,18.63%)] border-[0.5px]',
        ghost:
          'text-muted-foreground hover:bg-primary/10 hover:text-accent-foreground focus:bg-primary/10 focus:text-accent-foreground active:bg-primary/10 active:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-3.5 py-1.5',
        sm: 'px-2 py-1',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
