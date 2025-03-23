import { useEffect, useState, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import storiesApi, { NewsFeedStory } from '@/apis/stories.api';
import { X, Trash } from 'lucide-react';
import RightPart from '@/components/RightPart';
import Navigation from '@/components/Navigation/Navigation';

const MyStoriesSection = () => {
    const [stories, setStories] = useState<NewsFeedStory[]>([]);
    const [selectedStory, setSelectedStory] = useState<NewsFeedStory | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<{ _id?: string; name: string; avatar: string | null }>({
        name: 'Unknown',
        avatar: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) setAccessToken(token);

        const fetchData = async () => {
            try {
                setIsLoading(true);
                if (token) {
                    const [userResponse, storiesResponse] = await Promise.all([
                        storiesApi.getCurrentUser(token),
                        storiesApi.getNewsFeedStories(10, 1),
                    ]);
                    setUser(userResponse.data.result);
                    const myStories = storiesResponse.data.result.filter(
                        (story) => story.user._id === userResponse.data.result._id
                    );
                    setStories(myStories);
                }
            } catch (err) {
                setError('Cannot load your stories. Please try again!');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeleteStory = useCallback(
        async (storyId: string) => {
            if (!window.confirm('Are you sure you want to delete this story?') || !accessToken) return;
            try {
                setIsLoading(true);
                await storiesApi.deleteStory(storyId, accessToken);
                setStories(stories.filter((s) => s._id !== storyId));
                setSelectedStory(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete story!');
                setTimeout(() => setError(null), 3000);
            } finally {
                setIsLoading(false);
            }
        },
        [accessToken, stories]
    );

    const handleViewStory = useCallback((story: NewsFeedStory) => {
        setSelectedStory(story);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <div className="flex flex-col lg:flex-row max-w-9xl mx-auto p-3 gap-6">
                {/* Navigation (Left Sidebar) */}
                <div className="lg:w-2/12 w-full">
                    <Navigation />
                </div>

                {/* My Stories (Main Content) */}
                <div className="lg:w-8/12 w-full">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight">My Stories</h2>

                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="flex justify-center items-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
                            {error}
                        </div>
                    )}

                    {/* Grid Layout cho danh sách story */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {stories.map((story) => (
                            <div
                                key={story._id}
                                className="group relative w-full aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                onClick={() => handleViewStory(story)}
                            >
                                {story.media_type === 'video' ? (
                                    <video
                                        src={story.media_url}
                                        className="w-full h-full object-cover"
                                        muted
                                        preload="metadata"
                                    />
                                ) : (
                                    <img
                                        src={story.media_url}
                                        alt="Story preview"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                                <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                                    {story.user?.name || 'Me'}
                                </div>
                                {story.media_type === 'video' && (
                                    <span className="absolute top-2 right-2 text-white text-xs bg-black/50 px-1.5 py-0.5 rounded-full">
                                        ▶
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RightPart (Right Sidebar) */}
                <div className="hidden lg:block lg:w-3/12 w-full">
                    <RightPart />
                </div>
            </div>

            {/* Modal View Story */}
            {selectedStory && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 animate-fade-in">
                    <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-102">
                        <button
                            className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
                            onClick={() => setSelectedStory(null)}
                        >
                            <X size={20} className="text-gray-600" />
                        </button>

                        <div className="absolute top-4 left-4">
                            <button
                                className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
                                onClick={() => handleDeleteStory(selectedStory._id)}
                            >
                                <Trash size={20} className="text-white" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-6">
                            <Avatar className="w-20 h-20 ring-4 ring-blue-500 shadow-md">
                                <AvatarImage src={selectedStory.user.avatar || ''} alt="User" />
                                <AvatarFallback className="text-2xl font-bold">
                                    {selectedStory.user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <p className="mt-3 text-lg font-semibold text-gray-800">@{selectedStory.user.name}</p>
                        </div>

                        {selectedStory.media_type === 'video' ? (
                            <video
                                src={selectedStory.media_url}
                                controls
                                className="w-full h-80 rounded-lg shadow-md object-cover"
                            />
                        ) : (
                            <img
                                src={selectedStory.media_url}
                                alt="Story"
                                className="w-full h-80 rounded-lg shadow-md object-cover"
                            />
                        )}
                        <p className="mt-4 text-gray-700 text-base font-medium">{selectedStory.content}</p>
                        {selectedStory.caption && (
                            <p className="mt-2 text-sm italic text-gray-500">{selectedStory.caption}</p>
                        )}

                        {/* Danh sách viewer */}
                        {selectedStory.viewer?.length > 0 && selectedStory.viewer.some((view) => view.content) ? (
                            <div className="mt-6 max-h-32 overflow-y-auto bg-gray-50 p-4 rounded-lg shadow-inner">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Comments</h3>
                                {selectedStory.viewer.map(
                                    (view, index) =>
                                        view.content && (
                                            <div
                                                key={index}
                                                className="flex items-start py-2 border-b border-gray-200 last:border-b-0"
                                            >
                                                <Avatar className="w-8 h-8 mr-3">
                                                    <AvatarImage src={view.viewer_id[0] /* Giả sử có API lấy avatar */} />
                                                    <AvatarFallback className="text-xs">{'U'}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-800">Viewer {index + 1}</p>
                                                    <p className="text-xs text-gray-600">{view.content}</p>
                                                </div>
                                            </div>
                                        )
                                )}
                            </div>
                        ) : (
                            <p className="mt-6 text-sm text-gray-500 text-center">No comments yet</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyStoriesSection;