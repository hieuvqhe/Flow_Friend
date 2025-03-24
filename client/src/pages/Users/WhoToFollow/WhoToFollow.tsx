import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HiOutlineBadgeCheck } from 'react-icons/hi';
import { FiSearch } from 'react-icons/fi'; // Thêm icon tìm kiếm
import userApi from '@/apis/users.api';
import RightPart from '@/components/RightPart';
import Navigation from '@/components/Navigation/Navigation';

// Định nghĩa kiểu dữ liệu cho User
interface User {
    _id: string;
    name: string;
    email: string;
    avatar: string | null;
    verified?: boolean;
}

const WhoToFollow: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [following, setFollowing] = useState<string[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State cho tìm kiếm
    const observer = useRef<IntersectionObserver | null>(null);

    // Lấy danh sách người dùng đang follow khi component mount
    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await userApi.getFollowing();
                const followingIds = response.data.result.map((user: any) => user.followed_user_id.toString());
                setFollowing(followingIds);
            } catch (err) {
                console.error('Error fetching following list:', err);
            }
        };

        fetchFollowing();
    }, []);

    // Ref để theo dõi phần tử cuối cùng trong danh sách
    const lastUserElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    // Hàm lấy danh sách người dùng (dựa trên tìm kiếm hoặc tất cả)
    const fetchUsers = async (pageNum: number, query: string = '') => {
        try {
            setLoading(true);
            setError(null);

            let response;
            if (query) {
                // Nếu có tìm kiếm, gọi API search
                response = await userApi.searchUsersByName(query, pageNum, 10);
            } else {
                // Nếu không có tìm kiếm, gọi API lấy tất cả người dùng
                response = await userApi.getAllUsers(pageNum, 10);
            }

            const fetchedUsers = response.data.result.users.map((user: any) => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar || null,
                verified: user.verify === 'Verified',
            }));

            // Nếu là trang 1, thay thế danh sách; nếu không, thêm vào danh sách
            if (pageNum === 1) {
                setUsers(fetchedUsers);
            } else {
                setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]);
            }

            // Kiểm tra xem còn dữ liệu để tải hay không
            setHasMore(pageNum < response.data.result.totalPages);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý follow/unfollow
    const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
        try {
            if (isFollowing) {
                // Unfollow
                await userApi.unfollowUser(userId);
                setFollowing((prev) => prev.filter((id) => id !== userId));
            } else {
                // Follow
                await userApi.followUser(userId);
                setFollowing((prev) => [...prev, userId]);
            }
        } catch (err) {
            console.error('Error toggling follow:', err);
            alert('Không thể thực hiện hành động này. Vui lòng thử lại.');
        }
    };

    // Xử lý khi thay đổi tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setPage(1); // Reset về trang 1 khi tìm kiếm
        setUsers([]); // Xóa danh sách hiện tại để tải lại
        setHasMore(true); // Reset hasMore để cho phép tải thêm
    };

    // Gọi API khi page hoặc searchQuery thay đổi
    useEffect(() => {
        fetchUsers(page, searchQuery);
    }, [page, searchQuery]);

    return (
        <div className="flex bg-gray-900 w-screen h-full px-5 lg:px-0 justify-between">
            <div className="lg:block lg:w-3/12 w-full relative transition-all duration-300">
                <Navigation />
            </div>
            <div className="lg:w-6/12 border border-gray-700 w-full relative">
                <div className="p-3 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                    <h1 className="text-xl text-white font-bold mb-3">Who to Follow</h1>
                    {/* Thanh tìm kiếm */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Hiển thị danh sách người dùng */}
                {users.length === 0 && !loading && !error && (
                    <div className="text-center text-white py-4">
                        <p>No users found.</p>
                    </div>
                )}
                {users.length > 0 && (
                    <div className="divide-y divide-gray-700">
                        {users.map((user, index) => {
                            const isFollowing = following.includes(user._id);

                            // Gắn ref vào phần tử cuối cùng để theo dõi
                            if (users.length === index + 1) {
                                return (
                                    <div
                                        ref={lastUserElementRef}
                                        key={user._id}
                                        className="p-3 hover:bg-gray-800 transition-colors duration-200 flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-2">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-indigo-200 text-base font-medium">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Thông tin người dùng */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <p className="font-medium text-gray-200 text-sm truncate">{user.name}</p>
                                                    {user.verified && <HiOutlineBadgeCheck className="text-indigo-400 h-4 w-4 flex-shrink-0" />}
                                                </div>
                                                <p className="text-xs text-gray-400 truncate">@{user.email.split('@')[0]}</p>
                                            </div>
                                        </div>

                                        {/* Nút Follow/Unfollow */}
                                        <button
                                            onClick={() => handleFollowToggle(user._id, isFollowing)}
                                            disabled={loading}
                                            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${isFollowing
                                                ? 'bg-gray-600 text-gray-400 hover:bg-gray-500 hover:text-gray-200'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-500'
                                                }`}
                                        >
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </button>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={user._id}
                                    className="p-3 hover:bg-gray-800 transition-colors duration-200 flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-2">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-indigo-200 text-base font-medium">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Thông tin người dùng */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-gray-200 text-sm truncate">{user.name}</p>
                                                {user.verified && <HiOutlineBadgeCheck className="text-indigo-400 h-4 w-4 flex-shrink-0" />}
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">@{user.email.split('@')[0]}</p>
                                        </div>
                                    </div>

                                    {/* Nút Follow/Unfollow */}
                                    <button
                                        onClick={() => handleFollowToggle(user._id, isFollowing)}
                                        disabled={loading}
                                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${isFollowing
                                                ? 'bg-gray-600 text-gray-400 hover:bg-gray-500 hover:text-gray-200'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-500'
                                            }`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Hiển thị trạng thái loading khi đang tải thêm */}
                {loading && (
                    <div className="text-center text-gray-400 py-4">
                        <div className="animate-pulse flex justify-center space-x-2">
                            <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
                            <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
                            <div className="h-3 w-3 bg-indigo-600 rounded-full"></div>
                        </div>
                    </div>
                )}

                {/* Hiển thị thông báo lỗi */}
                {error && (
                    <div className="text-center text-red-400 py-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* Thông báo khi không còn dữ liệu để tải */}
                {!hasMore && users.length > 0 && (
                    <div className="text-center text-gray-400 py-4">
                        <p>No more users to load.</p>
                    </div>
                )}
            </div>
            {/* Rightpart */}
            <div className="hidden ml-5 lg:block lg:w-4/12 w-full relative">
                <RightPart />
            </div>
        </div>
    );
};

export default WhoToFollow;