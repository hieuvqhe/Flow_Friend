import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./index.css";
import { FaFacebook, FaAppStore, FaGoogle } from "react-icons/fa";
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import apiUser from '../../../apis/users.api'
import { AppContext } from '../../../Contexts/app.context'

const Login = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [params] = useSearchParams()
  const { isAuthenticated } = useContext(AppContext)
  const [data, setData] = useState([{ email: '', password: '', remember: false }])
  const [focused, setFocused] = useState({
    email: false,
    password: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const getGoogleAuthUrl = () => {
    const url = 'https://accounts.google.com/o/oauth2/auth'
    const query = {
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' '),
      prompt: 'consent',
      access_type: 'offline'
    }
    const queryString = new URLSearchParams(query).toString()
    return `${url}?${queryString}`
  }

  const googleOAuthUrl = getGoogleAuthUrl()

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          code,
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
          redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code'
        })
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Failed to exchange code for token: ${error}`)
    }
  }

  useEffect(() => {
    const code = params.get('code')
    if (code) {
      exchangeCodeForToken(code)
        .then((res) => {
          const { access_token, refresh_token } = res
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)
          navigate('/')
        })
        .catch((error) => {
          toast.error(error.message)
        })
    }
  }, [params, navigate])

  const loginUserMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) => apiUser.loginUser(body)
  })

  const handleDataChange = (field: any) => (e: any) => {
    const value = field === 'remember' ? e.target.checked : e.target.value
    setData([
      {
        ...data[0],
        [field]: value
      }
    ])
  }

  const handleFocus = (field: any) => () => {
    setFocused({
      ...focused,
      [field]: true
    })
  }

  const handleBlur = (field: 'email' | 'password' | 'remember') => () => {
    if (!data[0][field]) {
      setFocused({
        ...focused,
        [field]: false
      })
    }
  }

  const handleLogin = () => {
    setErrorMessage(''); // Reset lỗi trước khi gửi request

    loginUserMutation.mutate(
      { email: data[0].email, password: data[0].password },
      {
        onSuccess: (res) => {
          const { access_token, refresh_token } = res.data.result
          localStorage.setItem('access_token', access_token as string)
          localStorage.setItem('refresh_token', refresh_token as string)
          setTimeout(() => {
            window.location.href = '/'
          }, 0)
        },
        onError: (error) => {
          const errorMsg = (error as any).data?.messages || "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
        }
      }
    )
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password')
  }

  return (
    <>
      <div
        className={`container transition-all duration-300 ${isSignUpActive ? "right-panel-active" : ""
          }`}
        id="container"
      >
        <div className="form-container sign-up-container">
          <form className="form-login" action="#">
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="" className="social">
                <FaFacebook size={40} />
              </a>
              <a href="#" className="social">
                <FaAppStore size={40} />
              </a>
              <a href="#" className="social">
                <FaGoogle size={40} />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input className="input-login" type="text" placeholder="Name" />
            <input className="input-login" type="email" placeholder="Email" />
            <input className="input-login" type="password" placeholder="Password" />
            <button className="btn-button">Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form className='form-login' action="#">
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="" className="social">
                <FaFacebook size={40} />
              </a>
              <a href="#" className="social">
                <FaAppStore size={40} />
              </a>
              <a onClick={() => (window.location.href = googleOAuthUrl)} className="social">
                <FaGoogle size={40} />
              </a>
            </div>
            <span>or use your account</span>
            <input
              className="input-login"
              value={data[0].email}
              onChange={handleDataChange('email')}
              onFocus={handleFocus('email')}
              onBlur={handleBlur('email')}
              placeholder="Email" />
            <input
              value={data[0].password}
              onChange={handleDataChange('password')}
              onFocus={handleFocus('password')}
              onBlur={handleBlur('password')}
              className="input-login"
              type="password"
              placeholder="Password" />
            {/* {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>} */}

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={data[0].remember}
                onChange={handleDataChange('remember')}
                className='w-4 h-4 rounded bg-white/10 border-white/30 text-blue-500 focus:ring-blue-500/50'
              />
              <span className='text-sm text-white/70'>Remember me</span>
            </label>

            <a className='cursor-pointer' onClick={handleForgotPassword}>Forgot your password?</a>

            <div className='px-8 pb-8'>
              <button onClick={handleLogin}
                className='btn-button text-sm text-blue-400 hover:text-blue-300'>
                Sign in
              </button>
            </div>

          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="btn-button ghost"
                id="signIn"
                onClick={() => setIsSignUpActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="btn-button ghost"
                id="signUp"
                onClick={() => setIsSignUpActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
