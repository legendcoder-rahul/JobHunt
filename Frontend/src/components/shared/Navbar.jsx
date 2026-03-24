import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Menu, X } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { ModeToggle } from '../Modetoggle'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;
    const getLinkClass = (path) => isActive(path) ? 'text-[#F83002] font-bold' : 'hover:text-[#6A38C2]';

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                localStorage.removeItem('token');
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    }
    return (
        <div className='bg-white dark:bg-gray-900 dark:text-white shadow-md'>
            <div className='flex items-center justify-between px-4 md:px-6 mx-auto max-w-7xl h-20'>
                <div>
                    <h1 className='text-xl md:text-2xl font-bold'>Job<span className='text-[#6C5CE7]'>Hunt</span></h1>
                </div>

                {/* Desktop Menu */}
                <div className='hidden md:flex items-center justify-center flex-1 gap-8 ml-4'>
                    <ul className='flex font-[14px] items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" className={getLinkClass('/admin/companies')}>Companies</Link></li>
                                    <li><Link to="/admin/jobs" className={getLinkClass('/admin/jobs')}>Jobs</Link></li>
                                    <li><Link to="/resumeAnalyzer" className={getLinkClass('/resumeAnalyzer')}>Resume Analyzer</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className={getLinkClass('/')}>Home</Link></li>
                                    <li><Link to="/jobs" className={getLinkClass('/jobs')}>Jobs</Link></li>
                                    <li><Link to="/resumeAnalyzer" className={getLinkClass('/resumeAnalyzer')}>Resume Analyzer</Link></li>
                                </>
                            )
                        }
                    </ul>
                </div>

                {/* Desktop Buttons */}
                <div className='hidden md:flex items-center gap-2 ml-auto'>
                    <ModeToggle />
                    {
                        !user ? (
                            <Link to="/login"><Button variant="outline" className="rounded-3xl bg-[#6C5CE7] px-8 py-5 text-white hover:bg-[#5a4bc2]">Login</Button></Link>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600 dark:text-gray-400'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>

                {/* Mobile Menu Toggle */}
                <div className='md:hidden flex items-center gap-4'>
                    <ModeToggle />
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className='p-1'>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

                {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className='md:hidden bg-white dark:bg-gray-800 border-t dark:border-t-gray-700 pl-4 pb-4'>
                    <ul className='flex flex-col font-medium gap-3 py-3'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" className={getLinkClass('/admin/companies')} onClick={() => setIsMobileMenuOpen(false)}>Companies</Link></li>
                                    <li><Link to="/admin/jobs" className={getLinkClass('/admin/jobs')} onClick={() => setIsMobileMenuOpen(false)}>Jobs</Link></li>
                                    <li><Link to="/resumeAnalyzer" className={getLinkClass('/resumeAnalyzer')} onClick={() => setIsMobileMenuOpen(false)}>Resume Analyzer</Link></li>

                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className={getLinkClass('/')} onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                                    <li><Link to="/jobs" className={getLinkClass('/jobs')} onClick={() => setIsMobileMenuOpen(false)}>Jobs</Link></li>
                                    <li><Link to="/resumeAnalyzer" className={getLinkClass('/resumeAnalyzer')} onClick={() => setIsMobileMenuOpen(false)}>Resume Analyzer</Link></li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex flex-col gap-2'>
                                <Link to="/login"><Button variant="outline" className='w-full h-10'>Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] w-full h-10">Signup</Button></Link>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-2 border-t dark:border-t-gray-700 pt-3'>
                                {
                                    user && user.role === 'student' && (
                                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className='w-full flex items-center gap-2'>
                                                <User2 size={18} /> View Profile
                                            </Button>
                                        </Link>
                                    )
                                }
                                <Button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} variant="outline" className='w-full flex items-center gap-2'>
                                    <LogOut size={18} /> Logout
                                </Button>
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    )
}

export default Navbar
