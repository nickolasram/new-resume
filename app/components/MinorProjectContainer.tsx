import {Project} from "@/types";
import {fetchImage} from "@/app/fetchImage";

interface MinorProjectContainerProps{
    project:Project;
}

const MinorProjectContainer=({project}:MinorProjectContainerProps)=>{
    let bgImg;
    if (project.images.length == 0) {
        bgImg = process.env.NEXT_PUBLIC_AWS_DEFAULT;
    } else {
        const image = project.images.find(obj=>{obj.bg})
        bgImg = image?.url
    }
    return(
        <div
            className="grow bg-center bg-cover group [box-shadow:inset_0_0_5px_10px_#000] cursor-pointer transition-all hover:[box-shadow:inset_0_0_5px_#000] w-full"
            style={{
                backgroundImage: `url(${bgImg})`
            }}
        >
            <div className="transition-all p-3 opacity-0 group-hover:opacity-100 group-hover:backdrop-brightness-50 h-full w-full flex justify-between items-center">
                <h2>{project.title}</h2>
            </div>
        </div>
    )
}

export default MinorProjectContainer;