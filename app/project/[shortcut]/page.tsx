import {Project as ProjectModel} from "@/models/project";
import {Project} from "@/types";
import SlateTextArea from "@/app/components/slateTextArea";
import {Descendant} from "slate";
import TipTapText from "@/app/components/tipTapText";
import Link from "next/link";
import TagIcon, {TagValue} from "@/app/components/tagIcon";
import Image from "next/image";

const Page=async ({params}: { params: { shortcut: string } }) => {
    const providedParams = await params;
    const project:Project|null = await ProjectModel.findOne({shortcut: providedParams.shortcut}, {__v: 0});
    if(!project){
        return <p>asd</p>
    }
    let bgImage;
    if (project.images.length == 0) {
        bgImage = process.env.NEXT_PUBLIC_AWS_DEFAULT;
    } else {
        bgImage = project.images.find(obj=>(obj.bg))?.url
    }
    return (
        <div className={'max-w-5xl mx-auto px-4'}>
            <div className={'w-full h-36 bg-top [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]'}
                 style={{
                     backgroundImage: `url(${bgImage})`
                 }}
            >
            </div>
            <h1 className={'mt-6  ml-4'}>{project.title}</h1>
            <div className={'flex mb-8'}>
                <div className={'ml-4 mr-14 grow'}>
                    <p className={'text-xl'}>Role: {project.role}</p>
                    <p className={'text-xl'}>Client: {project.client}</p>
                    <p className={'text-xl mb-5'}>Status: {project.status}</p>
                    {/*<SlateTextArea value={project.description as Descendant[]} areaColor={'#030712'} textColor={'#fff'} />*/}
                    <TipTapText text={project.description} />
                    { project.images.length > 0 &&
                        <div className={'flex gap-5 mt-5 overflow-x-auto'}>
                            { project.images.map((image,i) => (
                                <div className={'h-60 w-fit cursor-zoom-in'} key={i}>
                                    <Image
                                        alt={image.alt ?? 'Screenshot of site/app'}
                                        src={image.url}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        style={{ width: 'auto', height: '100%' }}
                                    />
                                </div>
                            ))
                            }
                        </div>
                    }
                </div>
                <div className={'mt-7'}>
                    <div className={'flex flex-col items-center justify-start gap-2 mb-10 linkRow'}>
                        <Link href="/">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                 className="size-12">
                                <path
                                    d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z"/>
                            </svg>
                        </Link>
                        <Link href="/">
                            <svg className={'size-10'} viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)"
                                       fill="#fff">
                                        <g id="icons" transform="translate(56.000000, 160.000000)">
                                            <path
                                                d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                                                id="github-[#142]">
                                            </path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </Link>
                    </div>
                    <div className={'flex flex-col gap-3 tagRow'}>
                        { project.tags.map((tag,i) => (
                            <TagIcon tag={tag as TagValue} key={i} />
                        ))
                        }
                    </div>
                </div>
            </div>
            <div className={'w-full h-36 bg-bottom [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]'}
                 style={{
                     backgroundImage: `url(${bgImage})`
                 }}
            >
            </div>


</div>
)
}

export default Page;