import { motion } from 'framer-motion'
import { forwardRef, ReactNode, useState } from 'react'

interface IProps {
  children: ReactNode
  title: string
  className?: string
}

const Tooltip = forwardRef<HTMLDivElement, IProps>((
  {
    children,
    title,
    className
  },
  ref
) => {
  const [show, setShow] = useState<boolean>(false)

  return (
    <>
      {show && (
        <motion.div
          ref={ref}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              ease: 'easeOut',
              duration: 0.3,
            },
          }}
          className={`
            absolute bottom-full mb-2 px-2 py-1  text-xs rounded-md shadow-sm z-50
            bg-gray-200/90 border dark:border-gray-500
            dark:bg-chatpage-message-robot-content-dark dark:text-white 
            ${className}
          `}
        >
          {title}
        </motion.div>
      )}

      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
    </>
  )
})

Tooltip.displayName = 'Tooltip'

export default Tooltip
