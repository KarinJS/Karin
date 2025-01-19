interface ChatMenuProps {
  icon: React.ReactNode
  onClick?: () => void
}

const ChatMenu: React.FC<ChatMenuProps> = ({ icon, onClick }) => {
  return (
    <div
      className="flex items-center justify-center w-6 h-6 text-xl hover:text-blue-500 dark:text-zinc-400"
      onClick={onClick}
    >
      {icon}
    </div>
  )
}

export default ChatMenu
