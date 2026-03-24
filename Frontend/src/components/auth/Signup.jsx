import React, { useEffect, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import google from '../../assets/googleIcon.png'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Eye, EyeOff, User, Phone, Upload } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [fileName, setFileName] = useState("No file chosen");
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file: file });
            setFileName(file.name);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message || "Registration failed");
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
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true,
                }
            );
            
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                // localStorage.setItem('token', res.data.token);
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Google signup failed");
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGoogleError = () => {
        toast.error("Google signup failed");
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
                            Create Account
                        </h1>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                            Join our platform and start your career journey
                        </p>

                        {/* Role Tabs */}
                        <div className="flex gap-4 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                            <button
                                type="button"
                                onClick={() => setInput({ ...input, role: 'student' })}
                                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                                    input.role === 'student'
                                        ? 'bg-[#6A38C2] text-white'
                                        : 'text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setInput({ ...input, role: 'recruiter' })}
                                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                                    input.role === 'recruiter'
                                        ? 'bg-[#6A38C2] text-white'
                                        : 'text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                Recruiter
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={submitHandler} className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <Input
                                        type="text"
                                        name="fullname"
                                        value={input.fullname}
                                        onChange={changeEventHandler}
                                        placeholder="Rahul Kumar"
                                        className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

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
                                        placeholder="rahul@example.com"
                                        className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <Input
                                        type="tel"
                                        name="phoneNumber"
                                        value={input.phoneNumber}
                                        onChange={changeEventHandler}
                                        placeholder="+91 98765 43210"
                                        className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                    Password
                                </label>
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

                            {/* Profile Photo */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                    Profile Photo
                                </label>
                                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#6A38C2] dark:hover:border-[#6A38C2] transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{fileName}</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={changeFileHandler}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Submit Button */}
                            {loading ? (
                                <Button disabled className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] py-3 rounded-full">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="w-full bg-[#6A38C2] h-12 text-lg text-white hover:bg-[#5b30a6] py-3 rounded-full"
                                >
                                    Sign Up
                                </Button>
                                
                            )}

                            {/* Google Signup */}
                            <div className="w-full flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="outline"
                                    size="large"
                                    text="signup_with"
                                />
                            </div>
                        </form>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#6A38C2] hover:text-[#5b30a6] font-semibold">
                                Sign in
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

export default Signup
                    