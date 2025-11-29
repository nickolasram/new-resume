import { ReactNode } from 'react';

interface MajorProjectItemProps{
    title:string;
    bgImg:string;
}

const MajorProjectItem=(
    {
        title,
        bgImg
    }: MajorProjectItemProps
)=>(
    <div
    style={{
        backgroundImage: bgImg?`url(${bgImg})`:'none'
    }} 
    className="p-3 flex bg-center bg-cover group flex-col [box-shadow:inset_0_0_10px_20px_#000] cursor-pointer transition-all hover:[box-shadow:inset_0_0_5px_10px_#000] aspect-square w-full">
        <div className="grow transition-all opacity-0 group-hover:opacity-100 group-hover:backdrop-brightness-50">
            <h2>{title}</h2>
        </div>
        <div className="h-16 transition-all opacity-0 group-hover:opacity-100 group-hover:backdrop-brightness-50">
            <p>ss</p>
        </div>
    </div>
)

interface MajorProjectContainerProps{
    children: ReactNode;
}

const MajorProjectContainer=({children}:MajorProjectContainerProps)=>(
    <div className="grid grid-cols-[repeat(1,1fr)] md:grid-cols-[repeat(3,1fr)] md:h-auto w-full">
        {children}
        {/*<MajorProjectItem title="Seattle Colleges" bgImg={helper.src}/> */}
    </div>
)

export default MajorProjectContainer;