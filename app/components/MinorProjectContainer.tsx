import { ReactNode } from "react";

interface MinorProjectContainerProps{
    children:ReactNode
}

const MinorProjectContainer=({children}:MinorProjectContainerProps)=>{
    return(
        <div className="bg-blue-700 flex flex-col aspect-square w-full">
            {children}
        </div>
    )
}

export default MinorProjectContainer;