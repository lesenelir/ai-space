import { forwardRef, HTMLProps } from 'react'

interface IProps extends HTMLProps<HTMLInputElement> {}

const Slider = forwardRef<HTMLInputElement, IProps>((
  {
    className,
    min,
    max,
    step,
    value,
    onChange,
    ...props
  },
  ref
) => {

  return (
    <>
      <input
        type='range'
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={`h-2 rounded-lg cursor-pointer appearance-auto accent-gray-400 ${className}`}
        {...props}
      />
    </>
  )
})

Slider.displayName = 'Slider'

export default Slider
