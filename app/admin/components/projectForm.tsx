"use client"
import { useProjectContext } from "@/app/contexts/projectContext"
import {ProjectImage, ProjectTag, Status} from "@/types";
import TextEditor from "./TextEditor";
import {Dispatch, FormEvent, MouseEventHandler, SetStateAction, useRef, useState, useReducer, ChangeEvent, useEffect} from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import toast from "react-hot-toast";
import {Descendant} from "slate";


interface ImageContainerProps{
    image:ProjectImage;
    index: number;
}

const ImageContainer=({image, index}:ImageContainerProps)=>{
    const [state, dispatch] = useReducer(
        (state: any, newState: any) => ({...state, ...newState}),
        {
            url: image.url,
            hidden: image.hidden,
            bg: image.bg,
            position:image.position,
            markedForDeletion: false
        })
    return(
        <div>
            <div className="aspect-square h-[144px] border grid grid-rows-[144px]">
                <img src={image.url} alt="Project Image" className="h-full w-full object-contain col-start-1 col-end-2 row-start-1 row-end-2" />
                <input type={'number'} name={"genPosId"+index} value={state.position}
                       max={99}
                className={'w-[48px] text-sm justify-self-end col-start-1 col-end-2 row-start-1 row-end-2 h-min self-end'}
                   onChange={(e:ChangeEvent<HTMLInputElement>) => {
                    const {value} = e.target
                    dispatch({position: value})
                }} />
            </div>
            <div className="flex px-2 justify-between w-36">
                <div className="flex gap-1 items-center">
                    <input type="radio" name={'bg'} value={index}
                           defaultChecked={state.bg}
                    />
                    <p className="text-lg font-black">bg</p>
                </div>
                <div className="flex gap-1 items-center">
                    <input type='checkbox'
                           name={"genHidId"+index}
                           checked={state.hidden}
                           value={state.hidden}
                           onChange={()=> {
                                dispatch({hidden: !state.hidden})
                            }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                    </svg>
                </div>
                <div className="flex gap-1 items-center">
                    <input type='checkbox' name={"genMFDId"+index} value={state.markedForDeletion} onChange={()=> {
                        dispatch({markedForDeletion: !state.markedForDeletion})
                    }} />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="FireBrick" className="size-5">
                        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

interface ProjectFormProps {
    revalidateFunction:()=>void;
}

const ProjectForm=({revalidateFunction}:ProjectFormProps)=>{
    const {project, setProject} = useProjectContext();
    const [value, setValue] = useState<{}[]>([]);
    const [loaded, setLoaded] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [state, dispatch] = useReducer(
        (state: any, newState: any) => ({...state, ...newState}),
        {
            title: '',
            role: '',
            client: '',
            url:'',
            github:'',
            order:99,
            id:'',
            hidden: true,
            major: false,
            status: Status.PreAlpha,
            tags:[],
            shortcut:'default'
        }
    );
    useEffect(()=>{
        if(project){
            setLoaded(true);
        }
        dispatch({
            title:project?project.title:'',
            role:project?project.role:'',
            client:project?project.client:'',
            url:project?.url?project.url:'',
            github:project?.github?project.github:'',
            order:project?project.order:99,
            id:project?project._id:'',
            hidden:project?project.hidden:true,
            major:project?project.major:false,
            status:project?project.status:Status.PreAlpha,
            tags:project?project.tags:[],
            shortcut:project?project.shortcut:'',
        });
        if (project){
            setValue(project?.description!)
        } else {
            setValue([
                {
                    type: 'paragraph',
                    children: [
                        { text: "Default Value" }
                    ],
                }
            ])
        }
    }, [project]);
    const [open, setOpen] = useState(false)
    const tagValues = Object.values(ProjectTag);
    const statusValues = Object.values(Status);
    const projectImages = project?.images ?? [];
    async function attemptPost(e:FormEvent<HTMLFormElement>){
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedShortcut = formData.get('shortcut');
        if(project){
            formData.append("id", project._id as string)
        }
        const valueObject = {description:value};
        formData.append("description", JSON.stringify(valueObject));
        const images = []
        const l = project?project.images.length:0;
        for (let i = 0; i < l; i++) {
            const markedForDeletion = !!formData.get("genMFDId" + i);
            if(!markedForDeletion){
                const imgObj = {
                    url: project!.images[i].url,
                    position: parseInt(formData.get("genPosId"+i) as string),
                    hidden:!!formData.get("genHidId" + i),
                    bg:parseInt(formData.get("bg") as string)==i
                }
                images.push(imgObj);
            } else {
                const deletionResponse = await fetch('/api/image', {
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        imageUrl: project!.images[i].url
                    })
                }).then(async res => {
                    if(res.status === 200){
                        return res.json()
                    } else {
                        console.log(res)
                        throw new Error(`${res.statusText}`)
                    }
                })
            }
        }
        images.forEach((image) => {
            formData.append('images[]', JSON.stringify(image));
        });
        const response = await fetch('/api/update', {
          method: 'POST',
          body: formData
        }).then(async res=>{
            if(res.ok){
                revalidateFunction();
                const updateProjectContext = await fetch('api/project?shortcut='+updatedShortcut)
                    .then(async res2 => {
                        if (res2.ok) {
                            // @ts-ignore
                            const updated = await res2.json()
                            setProject(updated.data);
                        } else {
                            console.log(res2)
                            throw new Error(`${res2.statusText}`)
                        }
                    }
                )
                return res.json()
            } else {
                console.log(res)
                throw new Error(`${res.statusText}`)
            }
        })
    }
    async function handleSubmit(e:FormEvent<HTMLFormElement>) {
        toast.promise(
            attemptPost(e),
            {
                loading: 'Attempting update...',
                success: `Update Success!`,
                error: (err) => `${err}`,
            },
            {
                style: {
                    minWidth: '250px'
                },
                success: {
                    duration: 1000,
                }
            }
        )
    }
    const handleOnChange = (event:ChangeEvent<HTMLInputElement>) => {
        const {name, value } = event.target;
        dispatch({ [name]: value });
    };
    const handleOnCheck = (event:ChangeEvent<HTMLInputElement>) => {
        const {name} = event.target;
        dispatch({ [name]: !state[name] });
    };
    const handleOnRadio=(event:ChangeEvent<HTMLInputElement>)=>{
        const {value}= event.target;
        dispatch({ status: value });
    };
    const handleCheckTag=(event:ChangeEvent<HTMLInputElement>)=>{
        const {value}=event.target;
        if (state.tags.includes(value)){
            dispatch({tags: [...state.tags.filter((e:string)=>(e!=value))]})
        } else {
            dispatch({ tags: [...state.tags, value] });
        }
    }
    const  attemptUploadImage = async (event: FormEvent) => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('file', imageInputRef!.current!.files![0])
        const response = await fetch('/api/image', {
            method: 'POST',
            body: formData
        }).then(async res => {
            if (res.ok) {
                const secondResponse = await fetch('api/update', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        imageUrl: res.statusText,
                        id:project?._id
                    }),
                }).then(async res2 => {
                        if (res2.ok) {
                            const updateProjectContext = await fetch('api/project?shortcut='+project?.shortcut)
                                .then(async res3 => {
                                        if (res3.ok) {
                                            // @ts-ignore
                                            const updated = await res3.json()
                                            setProject(updated.data);
                                        } else {
                                            console.log(res3)
                                            throw new Error(`${res3.statusText}`)
                                        }
                                    }
                                )
                            return res2.json()
                        } else {
                            console.log(res2)
                            throw new Error(`${res2.statusText}`)
                        }
                    }
                )
                return res.json()
            } else {
                console.log(res)
                throw new Error(`${res.statusText}`)
            }
        })
    }
    async function handleImageSubmit(e:FormEvent<HTMLFormElement>) {
        toast.promise(
            attemptUploadImage(e),
            {
                loading: 'Attempting upload...',
                success: `Update Success!`,
                error: (err) => `${err}`,
            },
            {
                style: {
                    minWidth: '250px'
                },
                success: {
                    duration: 1000,
                }
            }
        )
    }
    return(
        <>
            <form onSubmit={handleSubmit} className="text-black w-fit p-3 flex items-stretch flex-col gap-8 lg:flex-row">
                <div>
                    <label htmlFor='title'>Project Title</label>
                    <input type="text" name="title" required={true} value={state.title} onChange={handleOnChange} />
                    <label htmlFor='role'>Project Role</label>
                    <input type="text" name="role" required={true} value={state.role} onChange={handleOnChange}/>
                    <label htmlFor='client'>Project Client</label>
                    <input type="text" name="client" required={true} value={state.client} onChange={handleOnChange}/>
                    <label htmlFor={'url'}>
                        URL
                    </label>
                    <input type={'url'} name={'url'} value={state.url} onChange={handleOnChange} />
                    <label htmlFor={'github'}>
                        Github
                    </label>
                    <input type={'url'} name={'github'} value={state.github} onChange={handleOnChange} />
                    <div className="flex gap-2 w-[40ch] justify-between">
                        <div>
                            <label htmlFor='shortcut'>Shortcut</label>
                            <input type="text" name="shortcut" className={'max-w-[24ch]'} required value={state.shortcut} onChange={handleOnChange}/>
                        </div>
                        <div>
                            <label htmlFor='order'>Order</label>
                            <input type="number" name="order" className={'w-[45px]'} value={state.order} onChange={handleOnChange}/>
                        </div>
                        <div>
                            <label htmlFor='id'>ID</label>
                            <input type="type" name="id" className="text-ellipsis w-[50px]" disabled value={project?state.id:''}/>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex gap-2 items-center mb-2">
                            <input type="checkbox" name='major' value='major' checked={state.major} onChange={handleOnCheck}/>
                            <label htmlFor="major">Major</label>
                        </div>
                        <div className="flex gap-2 items-center mb-2">
                            <input type="checkbox" name='hidden' value='hidden' checked={state.hidden} onChange={handleOnCheck}/>
                            <label htmlFor="hidden">Hidden</label>
                        </div>
                    </div>
                    <fieldset className="mb-2">
                        <legend className="font-semibold text-gray-700">Status</legend>
                        { statusValues.map((projectStatus,i)=>(
                            <div className="flex gap-2 items-center" key={i}>
                                <input checked={state.status == projectStatus} onChange={handleOnRadio} required={true} type="radio" id={projectStatus} name="status" value={projectStatus} />
                                <label htmlFor={projectStatus}>{projectStatus}</label>
                            </div>
                        ))

                        }
                    </fieldset>
                    <p className="text-gray-700 font-semibold">Tags</p>
                    <div className='grid grid-cols-[repeat(3,1fr)] gap-2 mb-2'>
                        { tagValues.map((tag, i)=>(
                        <div className="flex gap-2 items-center" key={i}>
                            <input type="checkbox" name='tags' value={tag} checked={state.tags.includes(tag)} onChange={handleCheckTag}/>
                            <label htmlFor={tag}>{tag}</label>
                        </div>  
                        ))
                        }
                    </div>
                    <div className="bg-white mb-2 max-w-196.5 w-196.5">
                        { loaded &&
                            <TextEditor key={state.id} givenInitialValue={project?project.description as Descendant[]:'Default Value'} setValue={setValue} />
                        }
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    <div>
                        <p className="font-semibold">Images</p>
                        <div className="gap-2 grid grid-cols-[repeat(3,auto)] min-w-[448px]">
                            { projectImages.map((image, i)=>(
                                <ImageContainer image={image} index={i} key={i} />
                            ))
                            }
                            <div>
                                <div className="aspect-square h-36 border grid">
                                    <img src={process.env.NEXT_PUBLIC_AWS_DEFAULT as string} alt="Project Image" className="h-full w-full object-contain col-start-1 col-end-2 row-start-1 row-end-2" />
                                    <input type={'number'} disabled value={100}
                                           className={'w-[48px] text-sm justify-self-end col-start-1 col-end-2 row-start-1 row-end-2 h-min self-end'} />
                                </div>
                                <div className="flex px-2 justify-start gap-2 w-36">
                                    <div className="flex gap-1 items-center">
                                        <input type="radio"
                                               checked={projectImages.length==0}
                                               disabled={true}
                                        />
                                        <p className="text-lg font-black">bg</p>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <input type='checkbox'
                                               checked={projectImages.length>0}
                                               disabled={true}
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                            <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                            <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                            <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <button
                                type={'button'}
                            onClick={()=>{setOpen(true)}} 
                            className="h-36 cursor-pointer aspect-square border flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-12">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" className={'formBtn text-2xl'}>
                            Delete
                        </Button>
                        <Button type="reset" className={'formBtn text-2xl'}>
                            Reset
                        </Button>
                        <Button type="submit" className={'formBtn text-2xl'}>
                            Save
                        </Button>
                    </div>
                </div>
            </form>
            <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={()=>{setOpen(false)}}>
                <div className="fixed inset-0 z-10 backdrop-brightness-50 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl text-black bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle as="h3" className="font-medium">
                                Upload Picture
                            </DialogTitle>
                            { !project ?
                                <div>Save the project before uploading any photos.</div> :
                                <form className={'bg-white'} onSubmit={handleImageSubmit}>
                                    <div className={'flex justify-between'}>
                                        <input ref={imageInputRef} type={'file'} accept={'image/*'} className={'cursor-pointer w-[255px]'} />
                                        <div className={'flex gap-2'}>
                                            <button type={'reset'} className={'border rounded-sm px-2'}>Reset</button>
                                            <button type={'submit'} className={'border rounded-sm px-2'}>Upload</button>
                                        </div>
                                    </div>
                                </form>

                            }
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ProjectForm