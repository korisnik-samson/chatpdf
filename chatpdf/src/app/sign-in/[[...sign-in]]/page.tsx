import { SignIn } from '@clerk/nextjs';

export default function Page() {
    return (
        <div className="w-screen min-h-screen bg-[conic-gradient(at_right,_var(--tw-gradient-stops))]
        from-indigo-200 via-slate-600 to-indigo-200">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <SignIn />
            </div>
        </div>
    )
}