import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUserEdit, FaHeart, FaComment, FaBookmark } from 'react-icons/fa';

const Profile = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const userId = '672ce142e7c0462494f10dd2';
                const response = await axios.get(`http://localhost:5000/users/profile/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            
            <div className="w-full h-[150px] md:h-[250px] relative">
                <img 
                    src={user.coverPhoto} 
                    alt="Cover" 
                    className="w-full h-full object-cover" 
                />
                
                {/* Profile Image */}
                <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="absolute -bottom-12 left-1/2 md:left-[5%] transform -translate-x-1/2 md:translate-x-0 rounded-full w-24 h-24 border-4 border-white"
                />
            </div>
            
            <div className="container mx-auto px-4 pt-16 md:pt-2">
                {/* User Info Section */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end pt-4 md:pt-10 pb-6">
                    <div className="text-center md:text-left w-full md:w-auto">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-500 text-lg">{user.username || '@' + user.name.toLowerCase().replace(/\s+/g, '')}</p>
                        <p className="mt-2 max-w-md">{user.bio || 'No bio available'}</p>
                    </div>
                    
                    <button className="mt-4 md:mt-0 flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">
                        <FaUserEdit className="mr-2" />
                        Edit Profile
                    </button>
                </div>
                
                {/* Stats Section */}
                <div className="flex justify-center md:justify-start py-4 space-x-4 md:space-x-10">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-xl">{user.posts?.length || 0}</span>
                        <span className="text-gray-500">Posts</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-xl">{user.followers?.length || 0}</span>
                        <span className="text-gray-500">Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-xl">{user.following?.length || 0}</span>
                        <span className="text-gray-500">Following</span>
                    </div>
                </div>
                
                <hr className="my-6" />
                
                {/* Content Tabs */}
                <div className="mt-6">
                    {/* Tab Headers */}
                    <div className="flex border-b">
                        <button 
                            className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === 0 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab(0)}
                        >
                            Posts
                        </button>
                        <button 
                            className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === 1 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab(1)}
                        >
                            Saved
                        </button>
                        <button 
                            className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === 2 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab(2)}
                        >
                            Tagged
                        </button>
                    </div>
                    
                    {/* Tab Contents */}
                    <div className="mt-6">
                        {/* Posts Tab */}
                        {activeTab === 0 && (
                            user.posts && user.posts.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {user.posts.map((post: any) => (
                                        <div 
                                            key={post._id} 
                                            className="relative h-[150px] md:h-[250px] overflow-hidden rounded-md"
                                        >
                                            <img 
                                                src={post.media[0]?.url || "https://via.placeholder.com/300"} 
                                                alt={`Post ${post._id}`} 
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 flex justify-around">
                                                <div className="flex items-center">
                                                    <FaHeart className="mr-1" />
                                                    <span>{post.likes?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaComment className="mr-1" />
                                                    <span>{post.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[200px]">
                                    <p className="text-gray-500">No posts yet</p>
                                </div>
                            )
                        )}
                        
                        {/* Saved Tab */}
                        {activeTab === 1 && (
                            <div className="flex flex-col items-center justify-center h-[200px]">
                                <FaBookmark className="text-gray-400 text-4xl" />
                                <p className="mt-4 text-gray-500">No saved items yet</p>
                            </div>
                        )}
                        
                        {/* Tagged Tab */}
                        {activeTab === 2 && (
                            <div className="flex flex-col items-center justify-center h-[200px]">
                                <FaUserEdit className="text-gray-400 text-4xl" />
                                <p className="mt-4 text-gray-500">No tagged posts</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;