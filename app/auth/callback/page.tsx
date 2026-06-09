"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { GOOGLE_CALLBACK } from "@/lib/graphql/mutations/dev.mutations";
import { GoogleCallbackData } from "@/app/shared/type";

const LoadingSpinner = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Signing you in with Google...</p>
    </div>
)

function AuthCallbackInner() {
    const router = useRouter();
    const params = useSearchParams();
    const code = params.get("code");

    const [googleCallback] = useMutation<GoogleCallbackData>(GOOGLE_CALLBACK, {
        onCompleted: (data) => {
            document.cookie = `token=${data.googleCallback.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
            router.push("/dashboard");
        },
        onError: () => {
            router.push("/login");
        },
    });

    useEffect(() => {
        if (code) {
            googleCallback({ variables: { code } });
        }
    }, [code]);

    return <LoadingSpinner />
}

export default function AuthCallback() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <AuthCallbackInner />
        </Suspense>
    )
}