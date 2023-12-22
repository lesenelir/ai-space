import { motion } from 'framer-motion'
import { forwardRef, ReactNode, useState } from 'react'

interface IProps {
  children: ReactNode
  title: string
}

const Tooltip = forwardRef<HTMLDivElement, IProps>((
  {
    children,
    title
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
            absolute right-0 border bottom-full mb-1 px-3 py-1 text-sm rounded drop-shadow-md
            text-gray-900 bg-gray-100 dark:border-gray-500 dark:bg-gray-500/10 dark:text-gray-50/80
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
