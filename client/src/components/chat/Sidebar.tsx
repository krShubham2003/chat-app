import { GetUserIcon } from "../../helpers";
import { SidebarProps } from "../../interfaces";

const Sidebar = ({ users, currentUser }: SidebarProps) => {
    return (
        <aside className="hidden md:block w-64 border-r border-gray-200 bg-white/80 backdrop-blur-sm shadow-inner">
            <div className="p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5">
                    Active Members ({users.length})
                </h3>

                <div className="space-y-2">
                    {users.map((user) => {
                        const isCurrentUser = currentUser && user.id === currentUser.id;

                        return (
                            <div
                                key={user.id}
                                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-150 cursor-pointer ${
                                    isCurrentUser
                                        ? "bg-violet-100/80 text-violet-800 shadow-sm"
                                        : "hover:bg-gray-50 text-gray-700"
                                }`}
                            >
                                <div className="relative">
                                    <GetUserIcon
                                        name={isCurrentUser && currentUser ? currentUser.username : user.username}
                                        size={6}
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        {user.username}
                                        {isCurrentUser && " (You)"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
