import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react'

interface ITab {
  key: string
  title: ReactNode
  content: ReactNode
}

interface IProps {
  tabs: ITab[]
  className?: string
}

type TabsHandle = {
  setActiveTab: (key: string) => void
}

const Tabs = forwardRef<TabsHandle, IProps>((
  {
    tabs,
    className
  },
  ref
) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].key)

  useImperativeHandle(ref, () => ({ setActiveTab }))

  return (
    <div>
      <ul className={`w-fit flex gap-2 justify-between bg-chatpage-message-background-dark rounded-lg p-1 ${className}`}>
        {
          tabs.map((tab) => (
            <li
              className={`rounded-md ${tab.key === activeTab ? 'bg-gray-500/50' : ''}`}
              key={tab.key}
            >
              <button
                className={`px-4 py-2 font-medium text-sm rounded-t-md hover:bg-gray-500/10 transition-change ${activeTab === tab.key ? 'bg-gray-500/10' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.title}
              </button>
            </li>
          ))
        }
      </ul>

      <div className={'mt-1 p-4 border border-gray-500 rounded-lg'}>
        {tabs.find(tab => tab.key === activeTab)?.content}
      </div>
    </div>
  )
})

Tabs.displayName = 'Tabs'

export default Tabs
