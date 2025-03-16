/* eslint-disable react-refresh/only-export-components */
import { useContext } from 'react';
import { AppContext } from './Contexts/app.context';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import path from './constants/path'
import Login from './pages/Users/Login'
// import VerifyEmail from './pages/User/VerifyEmail'
import ForgotPassword from './pages/Users/ForgotPassword'
import VerifyForgotToken from './pages/Users/VerifyForgotToken'
import ResetPassword from './pages/Users/ResetPassword'

// function ProtectedRoute() {
//     const { isAuthenticated } = useContext(AppContext)
//     return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
// }

// function RejectedRoute() {
//     const { isAuthenticated } = useContext(AppContext)
//     return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
// }

export default function useRouteElement() {
    const routeElements = useRoutes([
        {
            path: path.auth,
            // element: <RejectedRoute />,
            children: [
                {
                    path: path.login,
                    element: (
                        <Login />
                    )
                },
                // {
                //     path: path.register,
                //     element: (
                //             <Register />
                //     )
                // }
            ],
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
        },
    ])
    return routeElements
}
