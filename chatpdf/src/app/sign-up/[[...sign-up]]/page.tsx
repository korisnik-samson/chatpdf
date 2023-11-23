import { SignUp } from '@clerk/nextjs';

export default function Page() {
    return (
        <div className="w-screen min-h-screen bg-[conic-gradient(at_left,_var(--tw-gradient-stops))]
        from-yellow-500 via-purple-500 to-blue-500">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <SignUp />
            </div>
        </div>
    )
}