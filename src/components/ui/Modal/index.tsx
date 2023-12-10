import { motion } from 'framer-motion'
import { forwardRef, type HTMLProps, type MouseEvent } from 'react'

interface IProps extends HTMLProps<HTMLDivElement> {
  onClose: () => void
}

const Modal = forwardRef<HTMLDivElement, IProps>((
  {className, children, onClose, ...props},
  ref
) => {
  return (
    <div
      ref={ref}
      className={`fixed z-50 inset-0 bg-black bg-opacity-60 flex items-center justify-center overflow-y-auto ${className}`}
      {...props}
      onClick={onClose}
    >
      {/* Content */}
      <motion.div
        className={`w-1/3 h-1/3 p-3 bg-blue-400 max-lg:w-8/12`}
        initial={{
          opacity: 0,
          scale: 0.75,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            ease: "easeOut",
            duration: 0.15,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.75,
          transition: {
            ease: "easeIn",
            duration: 0.15,
          },
        }}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  )
})

Modal.displayName = 'Modal'

export default Modal
