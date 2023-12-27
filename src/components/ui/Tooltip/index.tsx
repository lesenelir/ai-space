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
            absolute right-0 bottom-full mb-2 px-2 py-1 bg-black text-white text-xs rounded-md shadow-md z-50
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
