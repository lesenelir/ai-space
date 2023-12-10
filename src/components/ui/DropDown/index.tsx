import { motion } from 'framer-motion'
import { forwardRef, HTMLProps } from 'react'

interface IDropDownProps
  extends HTMLProps<HTMLDivElement> {}

const DropDown = forwardRef<HTMLDivElement, IDropDownProps>((
  {className, children, ...props},
  ref
) => {
  return (
    <div
      ref={ref}
      className={`absolute left-0 bottom-12 w-full ${className}`}
      {...props}
    >
      {/* motion.div cant have ref props, so we need to wrapper one layer */}
      <motion.div
        initial={{ opacity: 0, y: '20%' }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gray-300 text-gray-900 w-full p-3 rounded-md flex flex-col gap-2 mb-2`}
      >
        {children}
      </motion.div>
    </div>
  )
})

DropDown.displayName = 'DropDown'

export default DropDown
