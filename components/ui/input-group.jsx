'use client'

import { cva, } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function InputGroup({ className, ...props }.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'group/input-group border-input dark-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none',
        'h-9 has-[>textarea]-auto',

        // Variants based on alignment.
        'has-[>[data-align=inline-start]]&>input]-2',
        'has-[>[data-align=inline-end]]&>input]-2',
        'has-[>[data-align=block-start]]-auto has-[>[data-align=block-start]]-col has-[>[data-align=block-start]]&>input]-3',
        'has-[>[data-align=block-end]]-auto has-[>[data-align=block-end]]-col has-[>[data-align=block-end]]&>input]-3',

        // Focus state.
        'has-[[data-slot=input-group-control]-visible]-ring has-[[data-slot=input-group-control]-visible]-ring/50 has-[[data-slot=input-group-control]-visible]-[3px]',

        // Error state.
        'has-[[data-slot][aria-invalid=true]]-destructive/20 has-[[data-slot][aria-invalid=true]]-destructive dark-[[data-slot][aria-invalid=true]]-destructive/40',

        className,
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none [&>svg([class*='size-'])]-4 [&>kbd]-[calc(var(--radius)-5px)] group-data-[disabled=true]/input-group-50",
  {
    variants
      align
        'inline-start':
          'order-first pl-3 has-[>button]-[-0.45rem] has-[>kbd]-[-0.35rem]',
        'inline-end':
          'order-last pr-3 has-[>button]-[-0.4rem] has-[>kbd]-[-0.35rem]',
        'block-start':
          'order-first w-full justify-start px-3 pt-3 [.border-b]-3 group-has-[>input]/input-group-2.5',
        'block-end':
          'order-last w-full justify-start px-3 pb-3 [.border-t]-3 group-has-[>input]/input-group-2.5',
      },
    },
    defaultVariants
      align: 'inline-start',
    },
  },
)

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target).closest('button')) {
          return
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  'text-sm shadow-none flex gap-2 items-center',
  {
    variants
      size
        xs: "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg([class*='size-'])]-3.5 has-[>svg]-2",
        sm: 'h-8 px-2.5 gap-1.5 rounded-md has-[>svg]-2.5',
        'icon-xs':
          'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]-0',
        'icon-sm': 'size-8 p-0 has-[>svg]-0',
      },
    },
    defaultVariants
      size: 'xs',
    },
  },
)

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-sm [&_svg]-events-none [&_svg([class*='size-'])]-4",
        className,
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}.ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible-0 dark-transparent',
        className,
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible-0 dark-transparent',
        className,
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
