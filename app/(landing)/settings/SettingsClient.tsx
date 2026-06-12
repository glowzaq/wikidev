'use client'

// Client-side settings component
import { User } from "@/app/shared/type";
import { UPDATE_PROFILE, UPDATE_PASSWORD } from "@/lib/graphql/mutations/account.mutations";
import { useMutation } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, FileText, Bookmark, PenTool, Settings, LogOut, User as UserIcon, Lock, Save, AlertCircle, CheckCircle2 } from "lucide-react";

type UpdateProfileResponse = {
    updateDev: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        bio: string;
        token?: string; // New JWT token from backend
    };
};

export default function SettingsClient({ user }: { user: User }) {
    const router = useRouter();

    // Profile state
    const [profile, setProfile] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio || ""
    });
    const [profileSuccess, setProfileSuccess] = useState(false);

    // Only sync profile if user data actually changed meaningfully
    useEffect(() => {
        setProfile(prevProfile => {
            // Only update if the values are actually different
            if (
                prevProfile.firstName !== user.firstName ||
                prevProfile.lastName !== user.lastName ||
                prevProfile.email !== user.email ||
                prevProfile.bio !== (user.bio || "")
            ) {
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    bio: user.bio || ""
                };
            }
            return prevProfile;
        });
    }, [user.firstName, user.lastName, user.email, user.bio]);

    // Password state
    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const [updateProfile, { loading: profileLoading }] = useMutation<UpdateProfileResponse>(UPDATE_PROFILE, {
        onCompleted: (data) => {
            setProfile({
                firstName: data.updateDev.firstName,
                lastName: data.updateDev.lastName,
                email: data.updateDev.email,
                bio: data.updateDev.bio || ""
            });

            if (data.updateDev.token) {
                document.cookie = `token=${data.updateDev.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
                router.refresh()
            }

            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        },
        onError: (err) => alert(err.message)
    });

    const [updatePassword, { loading: passwordLoading }] = useMutation(UPDATE_PASSWORD, {
        onCompleted: () => {
            setPasswordSuccess(true);
            setPassword({ current: "", new: "", confirm: "" });
            setTimeout(() => setPasswordSuccess(false), 3000);
        },
        onError: (err) => setPasswordError(err.message)
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile({
            variables: {
                id: user.id,
                ...profile
            }
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        if (password.new !== password.confirm) {
            setPasswordError("Passwords do not match");
            return;
        }
        updatePassword({
            variables: {
                id: user.id,
                currentPassword: password.current,
                newPassword: password.new
            }
        });
    };

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
        router.push("/login");
    };

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: false },
        { label: "Articles", href: "/articles", icon: FileText, active: false },
        { label: "Bookmarks", href: "/bookmarks", icon: Bookmark, active: false },
        { label: "My Contributions", href: "/contributions", icon: PenTool, active: false },
        { label: "Settings", href: "/settings", icon: Settings, active: true },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Main content */}
            <main className="flex-1 min-w-0 overflow-auto">
                <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 sticky top-0 z-10">
                    <div className="flex items-center justify-between h-[73px]">
                        {/* Left */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <Link
                                href="/dashboard"
                                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium whitespace-nowrap"
                            >
                                &larr; <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
                            <h1 className="font-display font-bold text-lg sm:text-xl text-gray-900 truncate">
                                Settings
                            </h1>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            {user && (
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase bg-indigo-600 shadow-sm flex-shrink-0">
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="hidden sm:block text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium cursor-pointer"
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                            <Link
                                href="/dashboard/write"
                                className="bg-indigo-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition-all whitespace-nowrap"
                            >
                                <span className="sm:hidden">Write</span>
                                <span className="hidden sm:inline">Write Article</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="max-w-3xl mx-auto px-8 py-10 space-y-10">
                    {/* Profile Section */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <UserIcon size={18} className="text-gray-400" />
                            <h3 className="font-display font-bold text-gray-900">Profile Information</h3>
                        </div>
                        <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                                    <input
                                        type="text"
                                        value={profile.firstName}
                                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                                    <input
                                        type="text"
                                        value={profile.lastName}
                                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    readOnly
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                    Email address cannot be changed.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder="Tell the world about your technical expertise..."
                                    rows={3}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all resize-none"
                                />
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                {profileSuccess && (
                                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                                        <CheckCircle2 size={16} />
                                        Profile updated successfully
                                    </div>
                                )}
                                <div className="flex-1" />
                                <button
                                    type="submit"
                                    disabled={profileLoading}
                                    className="bg-indigo-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {profileLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Security Section */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Lock size={18} className="text-gray-400" />
                            <h3 className="font-display font-bold text-gray-900">Security</h3>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
                                <input
                                    type="password"
                                    value={password.current}
                                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                                    <input
                                        type="password"
                                        value={password.new}
                                        onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={password.confirm}
                                        onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {passwordError && (
                                <div className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-xl">
                                    <AlertCircle size={16} />
                                    {passwordError}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4">
                                {passwordSuccess && (
                                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                                        <CheckCircle2 size={16} />
                                        Password updated successfully
                                    </div>
                                )}
                                <div className="flex-1" />
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="bg-indigo-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Lock size={16} />
                                    {passwordLoading ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-red-50/30 rounded-2xl border border-red-100 p-6 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-red-600">Delete Account</h4>
                            <p className="text-xs text-red-400 mt-0.5">Permanently remove your account and all articles.</p>
                        </div>
                        <button className="text-xs font-bold text-red-600 bg-white border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-all">
                            Delete Account
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
}
