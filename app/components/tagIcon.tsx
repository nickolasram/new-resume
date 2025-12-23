import nextJs from '@/public/images/nextjs.png'
import Image from 'next/image'
import {ProjectTag} from "@/types";
import react from '@/public/images/react.png'
import tailwind from '@/public/images/tailwind.png'
import amplify from '@/public/images/amplify.png'
import mongoDB from '@/public/images/mongoDB.png'
import s3 from '@/public/images/s3.png'
import headlessUI from '@/public/images/headlessUI.png'

export type TagValue = typeof ProjectTag[keyof typeof ProjectTag];

interface TagIconProps {
    tag:TagValue;
}

const TagIcon =({tag}:TagIconProps)=>{
    let tagObject = {
        url:'',
        description:'',
    }
    switch(tag){
        case ProjectTag.Nextjs:
            tagObject.url = nextJs.src;
            tagObject.description = 'Next.js'
            break;
        case ProjectTag.React:
            tagObject.url = react.src;
            tagObject.description = 'React JS'
            break;
        case ProjectTag.Tailwind:
            tagObject.url = tailwind.src;
            tagObject.description = 'Tailwind CSS'
            break;
        case ProjectTag.Amplify:
            tagObject.url = amplify.src;
            tagObject.description = 'AWS Amplify'
            break;
        case ProjectTag.Mongo:
            tagObject.url = mongoDB.src;
            tagObject.description = 'MongoDB Atlas'
            break;
        case ProjectTag.S3:
            tagObject.url = s3.src;
            tagObject.description = 'Amazon S3'
            break;
        case ProjectTag.Headless:
            tagObject.url = headlessUI.src;
            tagObject.description = 'HeadlessUI'
            break;
        default:
            tagObject.url = nextJs.src;
            tagObject.description = 'Next.js'
            break;
    }
    return (
        <Image
            className={'hover:scale-105 cursor-help'}
            height={45}
            width={45}
            src={tagObject.url}
            title={tagObject.description}
            alt={tagObject.description}/>
    )
}

export default TagIcon;