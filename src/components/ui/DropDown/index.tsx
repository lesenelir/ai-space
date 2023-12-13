import { motion } from 'framer-motion'
import { forwardRef, HTMLProps } from 'react'

interface IDropDownProps extends HTMLProps<HTMLDivElement> {
  motionClassName?: string
  motionAnimation?: {
    initial: Record<string, unknown>
    animate: Record<string, unknown>
  }
}

const DropDown = forwardRef<HTMLDivElement, IDropDownProps>((
  {
    className,
    motionClassName,
    children,
    motionAnimation,
    ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      className={`absolute w-full ${className}`}
      {...props}
    >
      {/* motion.div cant have ref props, so we need to wrapper one layer */}
      <motion.div
        initial={motionAnimation?.initial}
        animate={motionAnimation?.animate}
        className={`bg-gray-300 text-gray-900 w-full p-3 rounded-md flex flex-col gap-2 mb-2 ${motionClassName}`}
      >
        {children}
      </motion.div>
    </div>
  )
})

DropDown.displayName = 'DropDown'

export default DropDown
