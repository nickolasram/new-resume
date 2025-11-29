import { logout } from "@/session/actions";

const Page=()=>{
    return (
        <div className="flex w-full justify-between">
            <h1>Admin Page</h1>
            <button className="text-gray-600 underline"
                onClick={logout}
            >
                Logout
            </button>
        </div>
    )
}

export default Page;