import { useState, useEffect } from 'react';
import bookmarksApi from '../../../apis/bookmarks.api';
import { Bookmark } from '../../../types/Bookmarks.type';
import Navigation from '../../../components/Navigation/Navigation';
import RightPart from '../../../components/RightPart';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await bookmarksApi.getBookmarks();
                const bookmarkData = res.data.data || [];
                setBookmarks(bookmarkData);
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
                setBookmarks([]); // Ensure state remains an array
            }
        };
        fetchBookmarks();
    }, []);

    return (
        <div className='flex w-screen px-5 lg:px-0 justify-between'>
            <div className='lg:block lg:w-3/12 w-full relative transition-all duration-300'>
                <Navigation />
            </div>
            <div className="lg:w-5/12 w-full relative">
                <h2 className="text-2xl font-bold mb-6">Bookmarks</h2>
                {bookmarks.length === 0 ? (
                    <p className="text-gray-500">No bookmarks found.</p>
                ) : (
                    <ul className="space-y-6">
                        {bookmarks.map((bookmark) => {
                            const tweet = bookmark.tweet;
                            return (
                                <li
                                    key={bookmark._id}
                                    className="p-4 border border-gray-200 rounded-lg shadow-md bg-white hover:bg-gray-50 transition-colors"
                                >
                                    {/* Tweet User Info */}
                                    <div className="flex items-center mb-2">
                                        {/* <img
                                        src={tweet.user.avatar || '/default-avatar.png'} // Fallback avatar
                                        alt={tweet.user.name}
                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                    /> */}
                                        <div className="flex flex-col items-center pr-2">
                                            <button
                                                className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 cursor-pointer overflow-hidden"
                                            >
                                                {tweet.user.avatar ? (
                                                    <img src={tweet.user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-700">
                                                        {tweet.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{tweet.user.name}</p>
                                            <p className="text-xs text-gray-500">@{tweet.user.username || 'username'}</p>
                                        </div>
                                    </div>

                                    {/* Tweet Content */}
                                    <p className="text-gray-800 mb-2">{tweet.content}</p>

                                    {/* Hashtags */}
                                    {tweet.hashtags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {tweet.hashtags.map((hashtag) => (
                                                <span
                                                    key={hashtag._id}
                                                    className="text-blue-500 text-sm hover:underline cursor-pointer"
                                                >
                                                    #{hashtag.name.replace('#', '')}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Medias */}
                                    {tweet.medias.length > 0 && (
                                        <div className="mb-2">
                                            {tweet.medias.map((media, index) => (
                                                <img
                                                    key={index}
                                                    src={media.url}
                                                    alt="Tweet media"
                                                    className="w-full h-64 object-cover rounded-md"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Timestamp */}
                                    <p className="text-xs text-gray-500">
                                        {new Date(tweet.created_at).toLocaleDateString()} at{' '}
                                        {new Date(tweet.created_at).toLocaleTimeString()}
                                    </p>

                                    {/* Optional: Views */}
                                    <p className="text-xs text-gray-500 mt-1">
                                        {/* Views: {tweet.guest_views} (Guests) | {tweet.user_views} (Users) */}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
            {/* Rightpart */}
            <div className='hidden lg:block lg:w-4/12 w-full relative'>
                <RightPart />
            </div>
        </div>
    );
};

export default Bookmarks;