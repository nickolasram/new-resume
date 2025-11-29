import { ReactNode } from "react"
import { getSession } from "@/session/actions"
import StaticNavbar from "@/app/components/staticNavbar";

const Layout= async({
    children,
    login,
    main
}:{
    children: ReactNode,
    login: ReactNode,
    main: ReactNode
}
)=>{
    const session = await getSession();
    return (
        <>
            <StaticNavbar />
            <div className="max-w-[90dvw] mx-auto">
                {children}
                {session.isLoggedIn ?
                    main :
                    login
                }
            </div>
        </>
    )
}

export default Layout;