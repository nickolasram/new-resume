import { ProjectProvider } from "@/app/contexts/projectContext"
import ProjectPillar from "../components/projectPillar"
import ProjectForm from "../components/projectForm"
import {Project} from "@/models/project";
import {Suspense} from "react";
import {Project as ProjectType} from "@/types";
import { revalidatePath } from 'next/cache'

const Page=()=>{
    const projects = Project.find({},{__v:0}).lean().then(e => {
        return e.map(obj => {
            return ({
                ...obj,
                _id: obj._id.toString(),
            })
        }) as unknown as ProjectType[];
    })
    const revalidateFunction=async ()=>{
        "use server"
        revalidatePath('/admin', 'page')
    }
    return(
        <div className="flex w-full">
            <ProjectProvider>
                <div className="w-[240px] border-r-2 border-white">
                    <h2>Projects</h2>
                    <Suspense fallback={<p className={'text-lg text-black'}>Loading...</p>}>
                        <ProjectPillar projectsPromise={projects} />
                    </Suspense>
                </div>
                <div className="grow pl-4">
                    <ProjectForm revalidateFunction={revalidateFunction} />
                </div>
            </ProjectProvider>
        </div>
    )
}

export default Page