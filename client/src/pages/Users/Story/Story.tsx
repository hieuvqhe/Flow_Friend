import { useEffect, useState, useCallback, useMemo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar';
import storiesApi, { NewsFeedStory } from '@/apis/stories.api';
import usersApi from '../../../apis/users.api';
import mediasApi from '@/apis/medias.api';
import { PlusCircle, X, Edit, Trash } from 'lucide-react';

const StorySection = () => {
  const [stories, setStories] = useState<NewsFeedStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<NewsFeedStory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStory, setEditStory] = useState<NewsFeedStory | null>(null);
  const [storyText, setStoryText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ _id?: string; name: string; avatar: string | null }>({
    name: 'Unknown',
    avatar: null,
  });
  const [privacyMode, setPrivacyMode] = useState<string>('private');
  const [selectedFollowers, setSelectedFollowers] = useState<{ _id: string; name: string }[]>([]);
  const [followers, setFollowers] = useState<{ _id: string; name: string; avatar: string | null }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOwnStory, setIsOwnStory] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaInputMethod, setMediaInputMethod] = useState<'file' | 'url'>('file'); // Mặc định là tải file

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setAccessToken(token);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (token) {
          const [userResponse, followersResponse, storiesResponse] = await Promise.all([
            storiesApi.getCurrentUser(token),
            usersApi.getFollowers(),
            storiesApi.getNewsFeedStories(10, 1),
          ]);
          setUser(userResponse.data.result);
          setFollowers(followersResponse.data.result);
          // Lọc story: chỉ hiển thị nếu là chủ sở hữu hoặc user ID có trong privacy
          // const filteredStories = storiesResponse.data.result.filter((story) =>
          //   story.user._id === userResponse.data.result._id || // Chủ sở hữu
          //   (story.privacy && story.privacy.includes(userResponse.data.result._id)) // Có trong privacy
          // );

          // Lọc story: chỉ hiển thị nếu là chủ sở hữu hoặc user ID có trong privacy, và trong 24 giờ
          const now = new Date();
          const filteredStories = storiesResponse.data.result.filter((story) => {
            const createdAt = new Date(story.created_at); // Giả sử API trả về trường created_at
            const timeDiff = now.getTime() - createdAt.getTime();
            const within24Hours = timeDiff <= 24 * 60 * 60 * 1000; // 24 giờ tính bằng milliseconds
            return (
              within24Hours && // Chỉ hiển thị trong 24 giờ
              (story.user._id === userResponse.data.result._id || // Chủ sở hữu
                (story.privacy && story.privacy.includes(userResponse.data.result._id))) // Có trong privacy
            );
          });

          setStories(filteredStories);
        }
      } catch (err) {
        setError('Cannot load stories or user info. Please try again!');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFollowers = useMemo(() => {
    return searchQuery.trim() === ''
      ? followers
      : followers.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, followers]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG, GIF) or video (MP4)!');
        setMediaFile(null);
        setMediaUrl('');
        setMediaPreview(null);
        setTimeout(() => setError(null), 3000);
        return;
      }

      try {
        setIsLoading(true);
        let uploadResponse;
        if (file.type.startsWith('image/')) {
          uploadResponse = await mediasApi.uploadImages(file);
        } else {
          uploadResponse = await mediasApi.uploadVideo(file);
        }

        const mediaUrl = uploadResponse.data.result[0].url; // Lấy URL từ response
        setMediaFile(null); // Không cần lưu file nữa vì đã upload
        setMediaUrl(mediaUrl);
        setMediaPreview(mediaUrl);
        setError(null);
      } catch (err) {
        setError('Failed to upload media. Please try again.');
        setMediaFile(null);
        setMediaUrl('');
        setMediaPreview(null);
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsLoading(false);
      }
    } else {
      setMediaFile(null);
      setMediaUrl('');
      setMediaPreview(null);
      setError('No file selected!');
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  const handlePrivacyModeChange = useCallback((mode: string) => {
    setPrivacyMode(mode);
    if (mode === 'public') {
      setSelectedFollowers(followers.map((f) => ({ _id: f._id, name: f.name })));
    } else if (mode === 'private') {
      setSelectedFollowers([]);
    } else {
      setSelectedFollowers([]);
    }
  }, [followers]);

  const handleCreateStory = useCallback(async () => {
    if (!storyText.trim() || !accessToken) {
      setError('Content and login are required!');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!mediaUrl) {
      setError('Please upload an image or video, or provide a media URL!');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('content', storyText);

      const mediaType = mediaUrl.toLowerCase().endsWith('.mp4') ? 'video' : 'image';
      formData.append('media_url', mediaUrl);
      formData.append('media_type', mediaType);

      if (caption) formData.append('caption', caption);

      if (privacyMode === 'private') {
        const privacyArray = user._id ? [{ _id: user._id, name: user.name }] : [];
        privacyArray.forEach((follower) => formData.append('privacy[]', follower._id));
      } else {
        const privacyArray = selectedFollowers.map((f) => f._id);
        privacyArray.forEach((id) => formData.append('privacy[]', id));
      }

      await storiesApi.createStory(formData, accessToken);
      const storiesResponse = await storiesApi.getNewsFeedStories(10, 1);

      const now = new Date();
      const filteredStories = storiesResponse.data.result.filter((story) => {
        const createdAt = new Date(story.created_at);
        const timeDiff = now.getTime() - createdAt.getTime();
        const within24Hours = timeDiff <= 24 * 60 * 60 * 1000;
        return (
          within24Hours &&
          (story.user._id === user._id || (story.privacy && story.privacy.includes(user._id)))
        );
      });

      setStories(filteredStories);
      setShowCreateModal(false);
      resetForm();

      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create story!');
      console.error('Error creating story:', err.response?.data || err);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [storyText, mediaUrl, caption, privacyMode, selectedFollowers, accessToken, user._id]);

  const handleEditStory = useCallback((story: NewsFeedStory) => {
    setSelectedStory(null);
    setEditStory(story);
    setStoryText(story.content);
    setMediaUrl(story.media_url || '');
    setCaption(story.caption || '');
    setMediaPreview(story.media_url || null);
    setMediaInputMethod(story.media_url ? 'url' : 'file'); // Nếu có media_url thì chọn 'url', không thì 'file'

    if (!story.privacy || story.privacy.length === 0) {
      setPrivacyMode('private');
      setSelectedFollowers([]);
    } else if (story.privacy.length === 1 && story.privacy[0] === user._id) {
      // Trường hợp privacy chỉ chứa user hiện tại -> "private"
      setPrivacyMode('private');
      setSelectedFollowers([]);
    } else if (story.privacy.length === followers.length) {
      setPrivacyMode('public');
      setSelectedFollowers(followers.map((f) => ({ _id: f._id, name: f.name })));
    } else {
      setPrivacyMode('custom');
      setSelectedFollowers(followers.filter((f) => story.privacy.includes(f._id)));
    }
    setShowEditModal(true);
  }, [followers, user._id]);

  const handleUpdateStory = useCallback(async () => {
    if (!editStory || !storyText.trim() || !accessToken) {
      setError('Content and login are required!');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!mediaUrl) {
      setError('Please upload an image or video, or provide a media URL!');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('story_id', editStory._id);
      formData.append('content', storyText);

      const mediaType = mediaUrl.toLowerCase().endsWith('.mp4') ? 'video' : 'image';
      formData.append('media_url', mediaUrl);
      formData.append('media_type', mediaType);

      formData.append('caption', caption || '');

      if (privacyMode === 'private') {
        const privacyArray = user._id ? [{ _id: user._id, name: user.name }] : [];
        privacyArray.forEach((follower) => formData.append('privacy[]', follower._id));
      } else {
        const privacyArray = selectedFollowers.map((f) => f._id);
        privacyArray.forEach((id) => formData.append('privacy[]', id));
      }

      await storiesApi.updateStory(formData, accessToken);
      const storiesResponse = await storiesApi.getNewsFeedStories(10, 1);

      const now = new Date();
      const filteredStories = storiesResponse.data.result.filter((story) => {
        const createdAt = new Date(story.created_at);
        const timeDiff = now.getTime() - createdAt.getTime();
        const within24Hours = timeDiff <= 24 * 60 * 60 * 1000;
        return (
          within24Hours &&
          (story.user._id === user._id || (story.privacy && story.privacy.includes(user._id)))
        );
      });

      setStories(filteredStories);
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update story!');
      console.error('Error updating story:', err.response?.data || err);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [editStory, storyText, mediaUrl, caption, privacyMode, selectedFollowers, accessToken, user._id]);

  const handleDeleteStory = useCallback(async (storyId: string) => {
    if (!window.confirm('Are you sure you want to delete this story?') || !accessToken) return;
    try {
      setIsLoading(true);
      await storiesApi.deleteStory(storyId, accessToken);
      setStories(stories.filter((s) => s._id !== storyId));
      setSelectedStory(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete story!');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, stories]);

  // const handleViewStory = useCallback(async (story: NewsFeedStory) => {
  //   const isOwner = story.user._id === user._id;
  //   setIsOwnStory(isOwner);
  //   setSelectedStory(story);

  //   // Chỉ gửi request "seen" nếu không phải chủ sở hữu
  //   if (!isOwner && accessToken) {
  //     try {
  //       setIsLoading(true);
  //       const payload = { story_id: story._id, content: '', view_status: 'seen' };
  //       await storiesApi.viewAndStatusStory(payload, accessToken);
  //       const storiesResponse = await storiesApi.getNewsFeedStories(10, 1);

  //       // const filteredStories = storiesResponse.data.result.filter((s) =>
  //       //   s.user._id === user._id || (s.privacy && s.privacy.includes(user._id))
  //       // );
  //       // Lọc lại: chỉ hiển thị trong 24 giờ
  //       const now = new Date();
  //       const filteredStories = storiesResponse.data.result.filter((story) => {
  //         const createdAt = new Date(story.created_at);
  //         const timeDiff = now.getTime() - createdAt.getTime();
  //         const within24Hours = timeDiff <= 24 * 60 * 60 * 1000;
  //         return (
  //           within24Hours &&
  //           (story.user._id === user._id || (story.privacy && story.privacy.includes(user._id)))
  //         );
  //       });

  //       setStories(filteredStories);
  //     } catch (err) {
  //       console.error('Failed to mark story as seen:', err?.response?.data || err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // }, [accessToken, user._id, stories]);

  const handleViewStory = useCallback(async (story: NewsFeedStory) => {
    const isOwner = story.user._id === user._id;
    setIsOwnStory(isOwner);
    setSelectedStory(story);

    // Chỉ gửi request "seen" nếu không phải chủ sở hữu
    if (!isOwner && accessToken) {
      try {
        setIsLoading(true);
        const payload = { story_id: story._id, content: '', view_status: 'seen' };
        const response = await storiesApi.viewAndStatusStory(payload, accessToken);
        console.log('View response:', response.data); // Debug response từ API

        // Fetch lại danh sách stories để cập nhật giao diện
        const storiesResponse = await storiesApi.getNewsFeedStories(10, 1);
        const now = new Date();
        const filteredStories = storiesResponse.data.result.filter((story) => {
          const createdAt = new Date(story.created_at);
          const timeDiff = now.getTime() - createdAt.getTime();
          const within24Hours = timeDiff <= 24 * 60 * 60 * 1000;
          return (
            within24Hours &&
            (story.user._id === user._id || (story.privacy && story.privacy.includes(user._id)))
          );
        });

        setStories(filteredStories);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to mark story as seen';
        setError(errorMessage);
        console.error('Error viewing story:', err.response?.data || err);
        setTimeout(() => setError(null), 3000); // Xóa thông báo lỗi sau 3 giây
      } finally {
        setIsLoading(false);
      }
    }
  }, [accessToken, user._id]);


  // const handleSubmitComment = useCallback(async () => {
  //   if (!selectedStory || !accessToken || !commentText.trim()) return;

  //   if (!isOwnStory) {
  //     try {
  //       setIsLoading(true);
  //       const payload = {
  //         story_id: selectedStory._id,
  //         content: commentText,
  //         view_status: 'seen',
  //       };
  //       await storiesApi.viewAndStatusStory(payload, accessToken);
  //       const storiesResponse = await storiesApi.getNewsFeedStories(10, 1);
  //       // const filteredStories = storiesResponse.data.result.filter((story) =>
  //       //   story.user._id === user._id || (story.privacy && story.privacy.includes(user._id))
  //       // );

  //       // Lọc lại: chỉ hiển thị trong 24 giờ
  //       const now = new Date();
  //       const filteredStories = storiesResponse.data.result.filter((story) => {
  //         const createdAt = new Date(story.created_at);
  //         const timeDiff = now.getTime() - createdAt.getTime();
  //         const within24Hours = timeDiff <= 24 * 60 * 60 * 1000;
  //         return (
  //           within24Hours &&
  //           (story.user._id === user._id || (story.privacy && story.privacy.includes(user._id)))
  //         );
  //       });

  //       setStories(filteredStories);
  //       setCommentText('');
  //     } catch (err) {
  //       setError('Failed to send comment: ' + (err?.response?.data?.message || 'Unknown error'));
  //       console.error('Error submitting comment:', err?.response?.data || err);
  //       setTimeout(() => setError(null), 3000);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   } else {
  //     setError('You cannot comment on your own story.');
  //     setTimeout(() => setError(null), 3000);
  //   }
  // }, [selectedStory, commentText, accessToken, isOwnStory, user._id]);

  const handleSubmitComment = useCallback(async () => {
    if (!selectedStory || !accessToken || !commentText.trim()) return;

    if (!isOwnStory) {
      try {
        setIsLoading(true);
        const payload = {
          story_id: selectedStory._id,
          content: commentText,
          view_status: 'seen',
        };
        const response = await storiesApi.viewAndStatusStory(payload, accessToken);
        console.log('Comment response:', response.data); // Debug response từ API

        // Fetch lại danh sách stories để cập nhật giao diện
        const storiesResponse = await storiesApi.getNewsFeedStories(10, 1);
        const now = new Date();
        const filteredStories = storiesResponse.data.result.filter((story) => {
          const createdAt = new Date(story.created_at);
          const timeDiff = now.getTime() - createdAt.getTime();
          const within24Hours = timeDiff <= 24 * 60 * 60 * 1000;
          return (
            within24Hours &&
            (story.user._id === user._id || (story.privacy && story.privacy.includes(user._id)))
          );
        });

        setStories(filteredStories);
        setCommentText(''); // Xóa nội dung bình luận sau khi gửi thành công
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to send comment';
        setError(errorMessage);
        console.error('Error submitting comment:', err.response?.data || err);
        setTimeout(() => setError(null), 3000); // Xóa thông báo lỗi sau 3 giây
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('You cannot comment on your own story.');
      setTimeout(() => setError(null), 3000);
    }
  }, [selectedStory, commentText, accessToken, isOwnStory, user._id]);

  const resetForm = useCallback(() => {
    setStoryText('');
    setMediaFile(null);
    setMediaUrl('');
    setMediaPreview(null);
    setCaption('');
    setSelectedFollowers([]);
    setPrivacyMode('private');
    setSearchQuery('');
    setError(null);
    setMediaInputMethod('file');
  }, []);

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Stories</h2>
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {/* {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>} */}

      <div className="flex space-x-4 overflow-x-auto py-2">
        <div className="flex flex-col items-center">
          <button
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-1 hover:scale-105 transition-transform"
            onClick={() => setShowCreateModal(true)}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-gray-600">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </button>
          <span className="text-xs mt-1 text-gray-600">Add Story</span>
        </div>
        {stories.length > 0 ? (
          stories.map((story) => (
            <div key={story._id} className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full overflow-hidden cursor-pointer ring-2 ${story.viewer?.some((v) => v.viewer_id.includes(user._id || '')) ? 'ring-gray-300' : 'ring-blue-500'
                  } hover:scale-105 transition-transform relative`}
                onClick={() => handleViewStory(story)}
              >
                {story.media_type === 'video' ? (
                  <video
                    src={story.media_url} // Sử dụng trực tiếp media_url
                    className="w-full h-full object-cover rounded-full"
                    muted
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={story.media_url} // Sử dụng trực tiếp media_url
                    alt="Story preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
                  {story.media_type === 'video' && (
                    <span className="text-white text-xs font-semibold">▶</span>
                  )}
                </div>
              </div>
              <span className="text-xs mt-1 text-gray-600 truncate w-16">{story.user?.name || 'Unknown'}</span>
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-6 bg-white rounded-xl shadow-md border border-gray-200">
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 text-sm font-medium">No stories yet</p>
            <p className="text-gray-400 text-xs mt-1">Share your first story today!</p>
          </div>
        )}
      </div>

      {/* Modal Create/Edit Story */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="relative w-full max-w-lg bg-white rounded-xl p-6 shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => (showCreateModal ? setShowCreateModal(false) : setShowEditModal(false))}
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">{showCreateModal ? 'Create Story' : 'Edit Story'}</h3>
            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
            {mediaPreview && (
              <div className="mb-4 relative">
                {mediaPreview.toLowerCase().endsWith('.mp4') ? (
                  <video src={mediaPreview} controls className="w-full h-40 object-cover rounded-lg" />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                )}
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  onClick={() => {
                    setMediaFile(null);
                    setMediaUrl('');
                    setMediaPreview(null);
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <textarea
              className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="What's on your mind?"
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
            />

            <div className="mt-4 flex space-x-4">
              <button
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mediaInputMethod === 'file'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => {
                  setMediaInputMethod('file');
                  setMediaUrl('');
                  setMediaPreview(mediaFile ? URL.createObjectURL(mediaFile) : null);
                }}
              >
                Upload File
              </button>
              <button
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mediaInputMethod === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => {
                  setMediaInputMethod('url');
                  setMediaFile(null);
                  setMediaPreview(mediaUrl || null);
                }}
              >
                Paste URL
              </button>
            </div>

            {mediaInputMethod === 'file' ? (
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,video/mp4"
                onChange={handleFileChange}
                className="mt-4 w-full p-2 border rounded-lg"
              />
            ) : (
              <input
                type="text"
                className="w-full p-3 mt-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Paste a media URL (image or video)..."
                value={mediaUrl}
                onChange={(e) => {
                  setMediaUrl(e.target.value);
                  setMediaPreview(e.target.value);
                  setMediaFile(null);
                }}
              />
            )}

            <input
              type="text"
              className="w-full p-3 mt-4 border rounded-lg"
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <div className="mt-4">
              <label className="mr-2 font-medium">Privacy:</label>
              <select
                className="p-2 border rounded-lg"
                value={privacyMode}
                onChange={(e) => handlePrivacyModeChange(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {privacyMode === 'custom' && (
              <div className="mt-4">
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Search followers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="mt-2 max-h-32 overflow-y-auto border rounded-lg p-2">
                  {filteredFollowers.map((follower) => (
                    <label key={follower._id} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        checked={selectedFollowers.some((f) => f._id === follower._id)}
                        onChange={() => {
                          setSelectedFollowers((prev) =>
                            prev.some((f) => f._id === follower._id)
                              ? prev.filter((f) => f._id !== follower._id)
                              : [...prev, { _id: follower._id, name: follower.name }]
                          );
                        }}
                        className="mr-2"
                      />
                      {follower.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <button
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              onClick={showCreateModal ? handleCreateStory : handleUpdateStory}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : showCreateModal ? 'Create' : 'Update'}
            </button>
          </div>
        </div>
      )}

      {/* Modal View Story */}
      {selectedStory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85 z-50">
          <div className="relative w-full max-w-md bg-gradient-to-b from-gray-800 to-black rounded-2xl p-6 text-white">
            <button
              className="absolute top-4 right-4 bg-gray-700 p-2 rounded-full hover:bg-gray-600"
              onClick={() => setSelectedStory(null)}
            >
              <X size={20} />
            </button>

            {isOwnStory && (
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  className="bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                  onClick={() => handleEditStory(selectedStory)}
                >
                  <Edit size={20} />
                </button>
                <button
                  className="bg-red-700 p-2 rounded-full hover:bg-red-600"
                  onClick={() => handleDeleteStory(selectedStory._id)}
                >
                  <Trash size={20} />
                </button>
              </div>
            )}
            <div className="flex flex-col items-center mb-4">
              <Avatar className="w-16 h-16 ring-2 ring-blue-500">
                <AvatarImage src={selectedStory.user.avatar || ''} alt="User" />
                <AvatarFallback>{selectedStory.user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="mt-2 font-semibold">@{selectedStory.user.name}</p>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}

            <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
              {selectedStory.media_type === 'video' ? (
                <video
                  src={selectedStory.media_url} // Sử dụng trực tiếp media_url
                  controls
                  className="w-full h-full object-contain"
                  onError={() => setError('Failed to load video.')}
                />
              ) : (
                <img
                  src={selectedStory.media_url} // Sử dụng trực tiếp media_url
                  alt="Story"
                  className="w-full h-full object-contain"
                  onError={() => setError('Failed to load image.')}
                />
              )}
            </div>
            <p className="mt-4 text-sm">{selectedStory.content}</p>
            {selectedStory.caption && <p className="mt-2 text-xs italic text-gray-400">{selectedStory.caption}</p>}
            <div className="mt-4 max-h-24 overflow-y-auto">
              {selectedStory.viewer?.map(
                (view, index) =>
                  view.content && (
                    <div key={index} className="flex items-start py-2 border-b border-gray-700">
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarImage src={followers.find((f) => f._id === view.viewer_id[0])?.avatar || ''} />
                        <AvatarFallback>
                          {followers.find((f) => f._id === view.viewer_id[0])?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">
                          {followers.find((f) => f._id === view.viewer_id[0])?.name || 'Unknown'}
                        </p>
                        <p className="text-xs">{view.content}</p>
                      </div>
                    </div>
                  )
              )}
            </div>
            {!isOwnStory && (
              <div className="mt-4 flex space-x-2">
                <input
                  type="text"
                  className="flex-1 p-2 bg-gray-700 rounded-full text-sm"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-400"
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StorySection;