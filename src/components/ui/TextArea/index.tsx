import clsx from 'clsx'
import { forwardRef, TextareaHTMLAttributes } from 'react'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>((
  {
    className,
    ...props
  },
  ref
) => {
  return (
    <>
      <textarea
        ref={ref}
        className={clsx(
          'flex min-h-[40px] w-full rounded-md border border-input px-3 py-2 text-sm',
          'ring-offset-background placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </>
  )
})

TextArea.displayName = 'TextArea'

export default TextArea
