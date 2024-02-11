import Cookies from 'js-cookie'
import React, {
  type ReactNode,
  useRef,
  useState,
  useEffect,
  useCallback
} from 'react'

interface IProps {
  children: ReactNode
  initialWidth: number
  minWidth?: number
  maxWidth?: number
  className?: string
}

export default function ResizableDiv({
  minWidth = 280,
  maxWidth = 520,
  initialWidth,
  children,
  className,
}: IProps) {
  const [width, setWidth] = useState<number>(initialWidth)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)
  // const [width, setWidth] = useAtom(resizableWidthAtom)

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    startXRef.current = mouseDownEvent.clientX
    startWidthRef.current = ref.current?.offsetWidth || 0
    setIsResizing(true)
  }, [])

  useEffect(() => {
    // When the component is mounted, it will check if there is a stored width in the cookie
    // If there is, it will set the width to the stored width
    const storedWidth = Cookies.get('resizableWidth')
    if (storedWidth) {
      setWidth(Math.max(minWidth, Math.min(maxWidth, parseInt(storedWidth, 10))))
    }
  }, [minWidth, maxWidth])

  // component-update render
  useEffect(() => {
    const doResize = (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const currentX = mouseMoveEvent.clientX
        const newWidth = startWidthRef.current + currentX - startXRef.current

        const newValidWidth = Math.max(Math.min(newWidth, maxWidth), minWidth)
        Cookies.set('resizableWidth', newValidWidth.toString(), { expires: 365 })
        setWidth(newValidWidth)
      }
    }

    const stopResizing = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      window.addEventListener('mousemove', doResize)
      window.addEventListener('mouseup', stopResizing)
    }

    return () => {
      window.removeEventListener('mousemove', doResize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, maxWidth, minWidth, setWidth])

  // When the screen is less than 768px, the menu width is fixed at 280px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        Cookies.set('resizableWidth', '280', { expires: 365 })
        setWidth(280)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWidth])

  return (
    <div
      ref={ref}
      style={{width: `${width}px`}}
      className={`relative ${className}`}
    >
      {children}
      <span
        className={`
          absolute top-0 right-0 z-10 w-1 h-full 
          cursor-ew-resize active:border-r-4 active:border-r-blue-500
        `}
        onMouseDown={startResizing}
      />
    </div>
  )
}
