// /* eslint-disable react-refresh/only-export-components */
// import { useContext } from 'react';
// import { AppContext } from './Contexts/app.context';
// import { Navigate, Outlet, useRoutes } from 'react-router-dom';
// import path from './constants/path'
// import Login from './pages/Users/Login'
// // import VerifyEmail from './pages/User/VerifyEmail'
// import ForgotPassword from './pages/Users/ForgotPassword'
// import VerifyForgotToken from './pages/Users/VerifyForgotToken'
// import ResetPassword from './pages/Users/ResetPassword'
// import Profile from './pages/Users/Profile/Profile'

// // function ProtectedRoute() {
// //     const { isAuthenticated } = useContext(AppContext)
// //     return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
// // }

// // function RejectedRoute() {
// //     const { isAuthenticated } = useContext(AppContext)
// //     return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
// // }

// export default function useRouteElement() {
//     const routeElements = useRoutes([
//         {
//             path: path.auth,
//             // element: <RejectedRoute />,
//             children: [
//                 {
//                     path: path.login,
//                     element: (
//                         <Login />
//                     )
//                 },
//                 // {
//                 //     path: path.register,
//                 //     element: (
//                 //             <Register />
//                 //     )
//                 // }
//             ],
//         },
//         {
//             path: path.forgotPassword,
//             element: <ForgotPassword />
//         },
//         {
//             path: path.verifyForgotPassword,
//             element: <VerifyForgotToken />
//         },
//         {
//             path: path.resetPassword,
//             element: <ResetPassword />
//         },
//         {
//             path: path.profile,
//             element: <Profile />
//         },
//     ])
//     return routeElements
// }



/* eslint-disable react-refresh/only-export-components */
import { useContext } from 'react'
import { AppContext } from './Contexts/app.context'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from './constants/path'
import RegisterLayout from './layout/RegisterLayout'
import Login from './pages/User/Login'
import Register from './pages/User/Register'
import MainLayout from './layout/MainLayout'
import UserLayout from './layout/UserLayout'
import Profile from './pages/User/Profile'
import ChangePassword from './pages/User/ChangePassword'
import VerifyEmail from './pages/User/VerifyEmail'
import ForgotPassword from './pages/User/ForgotPassword'
import VerifyForgotToken from './pages/User/VerifyForgotToken'
import ResetPassword from './pages/User/ResetPassword'
import Chat from './pages/User/ChatUser'
import Home from './components/Home'
import OAuthCallback from './components/Customs/OAuthCallback'
import Story from './pages/User/Story/StoryList'
import SearchPage from './pages/User/SearchPage/SearchPage'
import SubscriptionPage from './pages/User/Subscription'
import PaymentResultPage from './pages/User/Payment/PaymentResultPage'
import PaymentHistoryPage from './pages/User/Payment/PaymentHistoryPage'
import PaymentDetailPage from './pages/User/Payment/PaymentDetailPage'
import StoriesPage from './pages/User/HomeSection/StoriesPage/StoriesPage'
import StoryCreator from './pages/User/HomeSection/StoryCreator/StoryCreator'
import StoryArchiveViewer from './pages/User/HomeSection/StoryArchiveViewer'
import MyStoriesSection from './pages/User/Story/MyStoriesSection'
import Bookmarks from './pages/User/BookMark/Bookmarks'
import WhoToFollow from './pages/User/WhoToFollow'
import FollowingList from './pages/User/HomeSection/FollowingList'
function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
}

export default function useRouteElement() {
    const profile = useContext(AppContext).profile
    const routeElements = useRoutes([
        {
            path: path.asHome,
            element: <Navigate to={path.home} />
        },
        {
            path: path.home,
            element: <Home />
        },
        {
            path: path.auth,
            element: <RejectedRoute />,
            children: [
                {
                    path: path.login,
                    element: (
                        <RegisterLayout>
                            <Login />
                        </RegisterLayout>
                    )
                },
                {
                    path: path.register,
                    element: (
                        <RegisterLayout>
                            <Register />
                        </RegisterLayout>
                    )
                },
                {
                    path: path.forgotPassword,
                    element: <ForgotPassword />
                },
                {
                    path: path.verifyForgotPassword,
                    element: <VerifyForgotToken />
                },
                {
                    path: path.resetPassword,
                    element: <ResetPassword />
                }
            ]
        },
        {
            path: path.user,
            element: <ProtectedRoute />,
            children: [
                {
                    path: path.no,
                    element: (
                        <MainLayout>
                            <UserLayout />
                        </MainLayout>
                    ),
                    children: [
                        {
                            path: path.profile,
                            element: <Profile />
                        },
                        {
                            path: path.changePassword,
                            element: <ChangePassword />
                        },
                        {
                            path: path.verifyEmail,
                            element: <VerifyEmail />
                        }
                    ]
                },
                {
                    path: path.chat,
                    element: <Chat />
                },
                {
                    path: path.my_story,
                    element: <MyStoriesSection />
                },
                {
                    path: 'story',
                    element: <StoriesPage />
                },
                {
                    path: 'story/:id',
                    element: <StoriesPage />
                },
                {
                    path: 'story/create',
                    element: <StoryCreator onClose={() => window.history.back()} />
                },
                {
                    path: 'story/archive',
                    element: <StoryArchiveViewer userId={profile?._id || ''} onClose={() => window.history.back()} />
                },
                {
                    path: path.story,
                    element: <Story />
                },
                {
                    path: path.search,
                    element: <SearchPage />
                },
                {
                    path: 'payment/result',
                    element: <PaymentResultPage />
                },
                {
                    path: 'payment/history',
                    element: <PaymentHistoryPage />
                },
                {
                    path: 'payment/detail/:orderId',
                    element: <PaymentDetailPage />
                },
                {
                    path: 'subscription',
                    element: <SubscriptionPage />
                }
            ]
        },
        {
            path: path.googleLogin,
            element: <OAuthCallback />
        },
        {
            path: path.any,
            element: <Navigate to={path.home} />
        },
        {
            path: path.bookmark,
            element: <Bookmarks />
        },
        {
            path: path.whoToFollow,
            element: <WhoToFollow />
        },
        {
            path: path.followingList,
            element: <FollowingList profile={profile} />
        },
    ])
    return routeElements
}
