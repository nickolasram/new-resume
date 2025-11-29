"use client"

import toast from "react-hot-toast"

const LoginForm=({action}:{action:(formData:FormData)=>Promise<any>})=>{
    async function attemptLogin(formData:FormData){
        toast.promise(
            action(formData),
            {
                loading: 'Attempting Login...',
                success: "Successul Login",
                error: (err) => `${err}`

            },
            {
                style: {
                    minWidth: '250px',
                },
                success: {
                    duration: 1000
                }
            }
        )
    }

    return(
        <form action={attemptLogin} className="text-black bg-gray-200 shadow-md shadow-gray-200 p-3 flex flex-col gap-2">
            <input required className="border bg-white rounded-sm" type='password' name='pw1' />
            <input required className="border bg-white rounded-sm" type='password' name='pw2' />
            <div className="flex gap-2 w-full justify-center">
                <button type="reset" className="py-2 px-3 rounded-sm bg-white">
                    Reset
                </button>
                <button type="submit" className="py-2 px-3 rounded-sm bg-white">
                    Submit
                </button>
            </div>
        </form>
    )
}

export default LoginForm;