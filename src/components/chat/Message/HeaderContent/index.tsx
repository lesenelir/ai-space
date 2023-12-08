import Select from '@/components/ui/Select'
import I18Change from '@/components/chat/Message/HeaderContent/I18Change'
import ThemeChange from '@/components/chat/Message/HeaderContent/ThemeChange'
import { GPT3, GPT4 } from '@/components/chat/Message/HeaderContent/OptionData'

const options = [
  {value: <GPT3/>, label: 'GPT-3.5 Turbo'},
  {value: <GPT4/>, label: 'GPT-4 Turbo'},
]

export default function HeaderContent() {
  return (
    <div className={'w-full h-[66px] p-3 border-b flex justify-between items-center'}>
      {/* left icon */}
      <div>
        <Select
          width={`w-fit`}
          options={options}
          className={'text-black'}
        />
      </div>

      {/* right icon */}
      <div className={'flex flex-row gap-4'}>
        <I18Change/>
        <ThemeChange/>
      </div>
    </div>
  )
}
