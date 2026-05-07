'use client'

// Client-side settings component
import { User } from "@/app/shared/type";
import { UPDATE_PROFILE, UPDATE_PASSWORD } from "@/lib/graphql/mutations/account.mutations";
import { useMutation } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, FileText, Bookmark, PenTool, Settings, LogOut, User as UserIcon, Lock, Save, AlertCircle, CheckCircle2 } from "lucide-react";

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

    // Password state
    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const [updateProfile, { loading: profileLoading }] = useMutation(UPDATE_PROFILE, {
        onCompleted: () => {
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
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-gray-100">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">W</span>
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight text-gray-900">WikiDev</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                item.active
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all w-full cursor-pointer"
                    >
                        <LogOut size={18} />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0 overflow-auto">
                <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="font-display font-bold text-2xl text-gray-900">Settings</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and security.</p>
                    </div>
                </header>

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
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                                />
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
