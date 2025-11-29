import { fetchImageValues } from "@/types";
import { fetchImage } from "../fetchImage";

interface MinorProjectPreviewProps{
    title:string;
    bgImg:fetchImageValues;
}

const MinorProjectPreview=({title,bgImg}:MinorProjectPreviewProps)=>{
    return(
        <div
        className="grow bg-center bg-cover group [box-shadow:inset_0_0_5px_10px_#000] cursor-pointer transition-all hover:[box-shadow:inset_0_0_5px_#000] w-full"
        style={{
            backgroundImage: bgImg?`url(${fetchImage(bgImg)})`:'none'
        }} 
        >
            <div className="transition-all p-3 opacity-0 group-hover:opacity-100 group-hover:backdrop-brightness-50 h-full w-full flex justify-between items-center">
                <h2>{title}</h2>
            </div>
        </div>
    )
}

export default MinorProjectPreview;