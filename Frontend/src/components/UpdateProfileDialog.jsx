import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, Upload, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [resumeFileName, setResumeFileName] = useState("");
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills && Array.isArray(user.profile.skills) ? [...user.profile.skills] : [],
        file: null,
        profilePhoto: null
    });

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFileName(file.name);
            setInput({ ...input, file })
        }
    }

    const profilePhotoHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, profilePhoto: file })
    }

    const handleAddSkill = () => {
        if (skillInput.trim() !== "") {
            setInput({
                ...input,
                skills: [...input.skills, skillInput.trim()]
            });
            setSkillInput("");
        }
    }

    const handleRemoveSkill = (indexToRemove) => {
        setInput({
            ...input,
            skills: input.skills.filter((_, index) => index !== indexToRemove)
        });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills.join(','));
        if (input.file) {
            formData.append("resume", input.file);
        }
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-bold">Update Profile</DialogTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Refine your digital presence for top recruiters.</p>
                </DialogHeader>

                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Profile Preview */}
                    <div className="flex items-center gap-4 pb-6 border-b">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt="profile" />
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg dark:text-white">{input.fullname}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">PRODUCT DESIGNER • SAN FRANCISCO</p>
                            <label className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer mt-2 inline-block hover:underline">
                                Change Photo
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={profilePhotoHandler}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                            <Label htmlFor="fullname" className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-2 block">Full Name</Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                type="text"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-2 block">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <Label htmlFor="phoneNumber" className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-2 block">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            />
                        </div>

                        {/* Core Skills */}
                        <div>
                            <Label className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-2 block">Core Skills</Label>
                            <div className="flex gap-2 mb-2 flex-wrap bg-gray-50 dark:bg-gray-800 p-2 rounded-md min-h-10">
                                {input.skills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 px-3 py-1 rounded-full text-sm">
                                        <span>{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(index)}
                                            className="hover:text-blue-900 dark:hover:text-blue-300"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                    placeholder="Add skill..."
                                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddSkill}
                                    variant="outline"
                                    className="px-3 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                                >
                                    + Add
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Professional Bio */}
                    <div>
                        <Label htmlFor="bio" className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-2 block">Professional Bio</Label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={input.bio}
                            onChange={changeEventHandler}
                            placeholder="Tell recruiters about yourself..."
                            rows="4"
                            className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Resume Upload */}
                    <div>
                        <Label className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-2 block">Latest Resume</Label>
                        <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="text-blue-500" size={32} />
                                <p className="font-medium text-gray-700 dark:text-gray-300">Click to upload your resume</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC up to 10MB • {resumeFileName || "No file chosen"}</p>
                            </div>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={fileChangeHandler}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-medium"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Update Profile'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog
