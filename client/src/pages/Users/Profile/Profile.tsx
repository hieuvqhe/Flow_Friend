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
        
    );
};

export default Profile;