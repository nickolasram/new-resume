import bcrypt from "bcrypt";
import {getSession} from "@/session/actions";
import LoginForm from "../components/loginForm"

const Page=()=>{
    async function login(formData:FormData){
        "use server"
        const session = await getSession();
        const encrypted1 = process.env.NEXT_PUBLIC_PW1 as string
        const encrypted2 = process.env.NEXT_PUBLIC_PW2 as string
        const firstCheck = await bcrypt.compare(formData.get("pw1") as string, encrypted1);
        const secondCheck = await bcrypt.compare(formData.get("pw2") as string, encrypted2);
        if (!firstCheck || !secondCheck) {
            throw new Error("Invalid Credentials")
        }
        session.isLoggedIn = true;
        await session.save();
        if (!session || !session.isLoggedIn){
            throw new Error("Session not saved")
        }
        return {success: true}
    }


    return(
        <div className="gap-2 w-full flex flex-col items-center justify-center h-[50dvh]">
            <p>If you aren't the maker of this site, what're you doing here?</p>
            <LoginForm action={login} />
        </div>
    )
}
export default Page