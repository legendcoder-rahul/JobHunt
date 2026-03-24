import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import google from '../../assets/googleIcon.png'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Eye, EyeOff } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            dispatch(setLoading(true));
            const { credential } = credentialResponse;
            
            const res = await axios.post(`${USER_API_END_POINT}/auth/google/verify`, 
                { token: credential },
                { withCredentials: true }
            );
            
            if (res.data.success) {
                dispatch(setUser(res.data.user));

                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Google login failed");
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGoogleError = () => {
        toast.error("Google login failed");
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">


            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
                        {/* Heading */}
                        <h1 className="text-3xl font-bold text-center dark:text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                            Enter your credentials to access your curated dashboard
                        </p>

                        {/* Role Tabs */}
                        <div className="flex gap-4 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                            <button
                                type="button"
                                onClick={() => setInput({ ...input, role: 'student' })}
                                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${input.role === 'student'
                                        ? 'bg-[#6A38C2] text-white'
                                        : 'text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setInput({ ...input, role: 'recruiter' })}
                                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${input.role === 'recruiter'
                                        ? 'bg-[#6A38C2] text-white'
                                        : 'text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                Recruiter
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={submitHandler} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <Input
                                        type="email"
                                        name="email"
                                        value={input.email}
                                        onChange={changeEventHandler}
                                        placeholder="curator@resume.ai"
                                        className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Password
                                    </label>
                                    <Link to="/forgot-password" className="text-xs text-[#6A38C2] hover:text-[#5b30a6] font-medium">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={input.password}
                                        onChange={changeEventHandler}
                                        placeholder="••••••••"
                                        className="pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Keep Signed In */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="keep-signed"
                                    checked={keepSignedIn}
                                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 cursor-pointer"
                                />
                                <label htmlFor="keep-signed" className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                    Keep me signed in
                                </label>
                            </div>

                            {/* Submit Button */}
                            {loading ? (
                                <Button disabled className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] py-3 rounded-full">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="w-full bg-[#6A38C2] h-12 text-lg text-white hover:bg-[#5b30a6] py-3 rounded-full"
                                >
                                    Login
                                </Button>
                            )}

                            {/* Google Login */}
                            <div className="w-full flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="outline"
                                    size="large"
                                    text="signin_with"
                                />
                            </div>
                        </form>

                        {/* Signup Link */}
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[#6A38C2] hover:text-[#5b30a6] font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-12 text-center">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                            Trusted by candidates at
                        </p>
                        <div className="flex items-center justify-center gap-6">
                            <span className="text-sm font-semibold text-gray-400 dark:text-gray-600">MODERN</span>
                            <span className="text-sm font-semibold text-gray-400 dark:text-gray-600">CANVAS</span>
                            <span className="text-sm font-semibold text-gray-400 dark:text-gray-600">TECH_C</span>
                        </div>
                    </div>
                </div>
            </main>



        </div>
    )
}

export default Login