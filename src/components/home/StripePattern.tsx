import { useMemo } from 'react'

export default function StripePattern() {
  const stripes = useMemo(() => (
    [
      {height: 'h-[23px]', marginTop: 'mt-[0px]'},
      {height: 'h-[22px]', marginTop: 'mt-[1px]'},
      {height: 'h-[21px]', marginTop: 'mt-[2px]'},
      {height: 'h-[20px]', marginTop: 'mt-[3px]'},
      {height: 'h-[19px]', marginTop: 'mt-[4px]'},
      {height: 'h-[18px]', marginTop: 'mt-[5px]'},
      {height: 'h-[17px]', marginTop: 'mt-[6px]'},
      {height: 'h-[16px]', marginTop: 'mt-[7px]'},
      {height: 'h-[15px]', marginTop: 'mt-[8px]'},
      {height: 'h-[14px]', marginTop: 'mt-[9px]'},
      {height: 'h-[13px]', marginTop: 'mt-[10px]'},
      {height: 'h-[12px]', marginTop: 'mt-[11px]'},
      {height: 'h-[11px]', marginTop: 'mt-[12px]'},
      {height: 'h-[10px]', marginTop: 'mt-[13px]'},
      {height: 'h-[9px]', marginTop: 'mt-[14px]'},
      {height: 'h-[8px]', marginTop: 'mt-[15px]'},
      {height: 'h-[7px]', marginTop: 'mt-[16px]'},
      {height: 'h-[6px]', marginTop: 'mt-[17px]'},
      {height: 'h-[5px]', marginTop: 'mt-[18px]'},
      {height: 'h-[4px]', marginTop: 'mt-[19px]'},
      {height: 'h-[3px]', marginTop: 'mt-[20px]'},
      {height: 'h-[2px]', marginTop: 'mt-[21px]'},
      {height: 'h-[1px]', marginTop: 'mt-[22px]'},
      {height: 'h-[0px]', marginTop: 'mt-[23px]'},
    ]
  ), [])

  return (
    <div className="flex flex-col">
      {stripes.reverse().map((item, index) => (
        <div
          key={index}
          className={`${item.height} ${item.marginTop} w-full bg-white`}
        />
      ))}
    </div>
  )
}
