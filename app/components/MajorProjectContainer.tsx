import {Project} from "@/types";

interface MajorProjectContainerProps {
    project: Project;
}

const MajorProjectContainer = ({project}:MajorProjectContainerProps) => {
    let bgImg;
    if (project.images.length == 0) {
        bgImg = process.env.NEXT_PUBLIC_AWS_DEFAULT;
    } else {
        const image = project.images.find(obj=>{return obj.bg})
        bgImg = image?.url
    }

    return (
        <div
            style={{
                backgroundImage: `url(${bgImg})`
            }}
            className="p-3 flex bg-center bg-cover group flex-col [box-shadow:inset_0_0_10px_20px_#000] cursor-pointer transition-all hover:[box-shadow:inset_0_0_5px_10px_#000] aspect-square w-full">
            <div className="grow transition-all opacity-0 group-hover:opacity-100 group-hover:backdrop-brightness-50">
                <h2>{project.title}</h2>
            </div>
            <div className="h-16 transition-all opacity-0 group-hover:opacity-100 group-hover:backdrop-brightness-50">
                <p>ss</p>
            </div>
        </div>
    )
}

export default MajorProjectContainer;