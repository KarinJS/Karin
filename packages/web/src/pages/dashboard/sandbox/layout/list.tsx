import PureInput from '@/components/sandbox/pure_input'
// import clsx from 'clsx'
import { IoAdd, IoSearch } from 'react-icons/io5'
import ChatList from '../chat'
import { useMatch } from 'react-router-dom'
import ContactList from '../contact'

const SearchBar = () => {
  return (
    <div className="w-full group select-none h-[70px] flex items-end px-3 pb-3 app-drag gap-2 relative flex-grow-0 flex-shrink-0">
      <PureInput
        align="left"
        className="text-xs app-no-drag !ring-0"
        classNames={{
          input: '!py-2',
        }}
        id="search"
        startContent={<IoSearch className="text-gray-400 dark:text-gray-500" />}
        type="text"
        placeholder="搜索"
      />
      <div className="text-gray-400 bg-opacity-50 dark:text-gray-500 bg-zinc-300 dark:dark:bg-gray-800 p-2 rounded-lg hover:bg-opacity-80 active:bg-opacity-100 app-no-drag">
        <IoAdd />
      </div>
    </div>
  )
}

const List = () => {
  const isChat = useMatch('/sandbox/chat/*')
  return (
    <div className="flex flex-col dark:border-zinc-800">
      <SearchBar />
      <div className="flex-1 overflow-y-auto">
        <div hidden={!isChat}>
          <ChatList />
        </div>
        <div hidden={!!isChat}>
          <ContactList />
        </div>
      </div>
    </div>
  )
}

export default List
