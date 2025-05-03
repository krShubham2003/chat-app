import { RiMessage2Fill } from "react-icons/ri"
import { HeaderProps } from "../../interfaces"
import { GetUserIcon } from "../../helpers"
import { FiLogOut } from "react-icons/fi"
import { BsCircleFill } from "react-icons/bs"

const Header = ({ currentUser, users, onLogout }: HeaderProps) => {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-md">
            {/* Top Bar */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Brand Section */}
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-2 rounded-xl shadow-md">
                            <RiMessage2Fill className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            Gup Shup
                        </h1>
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200 shadow-inner bg-white/50 backdrop-blur-md">
                            <div className="relative">
                                <GetUserIcon name={currentUser?.username || "User"} size={7} />
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                                {currentUser?.username}
                            </span>
                        </div>

                        {currentUser?.username && (
                            <button
                                onClick={() => onLogout(currentUser.username)}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                                title="Logout"
                            >
                                <FiLogOut className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Online Users Bar */}
            <div className="px-6 py-2 border-t border-gray-100 bg-white/70 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto">
                    <div className="flex -space-x-2">
                        {users.slice(0, 5).map((user) => (
                            <div key={user.id} className="relative">
                                <div className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm">
                                    <GetUserIcon name={user.username} size={9} />
                                </div>
                            </div>
                        ))}

                        {users.length > 5 && (
                            <div className="w-9 h-9 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-semibold text-gray-600">
                                +{users.length - 5}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <BsCircleFill className="w-2 h-2 text-green-500" />
                    {users.length} online
                </div>
            </div>
        </header>
    )
}

export default Header
