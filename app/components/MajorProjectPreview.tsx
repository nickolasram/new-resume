import { fetchImage } from "../fetchImage";
import { FetchImageValues } from "@/types";

interface MajorProjectPreviewProps{
    title:string;
    bgImg:FetchImageValues;
}

const MajorProjectPreview=(
    {
        title,
        bgImg
    }: MajorProjectPreviewProps
)=>(
    <div
    style={{
        backgroundImage: bgImg?`url(${fetchImage(bgImg)})`:'none'
    }} 
    className="flex bg-center bg-cover group flex-col [box-shadow:inset_0_0_5px_10px_#000] cursor-pointer transition-all hover:[box-shadow:inset_0_0_5px_#000] aspect-square w-full">
        <div className="px-3 pt-3 grow transition-all opacity-0 group-hover:opacity-100 group-hover:backdrop-brightness-50">
            <h2>{title}</h2>
        </div>
        <div className="h-16 px-3 pb-3 transition-all opacity-0 group-hover:opacity-100 group-hover:backdrop-brightness-50">
            <p>ss</p>
        </div>
    </div>
)

export default MajorProjectPreview;