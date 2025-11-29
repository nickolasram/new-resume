"use client"
import { useProjectContext } from "@/app/contexts/projectContext"
import {use} from "react";
import {Project} from "@/types";

const ProjectPillar=(
    {projectsPromise}:{projectsPromise:Promise<Project[]>}
)=>{
    const projects = use(projectsPromise);
    const {setProject} = useProjectContext();
    return(
        <div className="flex flex-col">
            {projects.map((project:any)=>{
                return (
                    <div
                        onClick={() => setProject(project)}
                        key={project._id}
                        className={'hover:bg-gray-800 pl-2 py-3 border-b-[1px] border-[#888] cursor-pointer'}>
                        <p className={''}>{project.title}</p>
                    </div>
                )
            })}
            <div
                onClick={() => setProject(undefined)}
                className={'hover:bg-gray-800 pl-2 py-3 cursor-pointer'}>
                <p className={'text-gray-400'}>New Project +</p>
            </div>
        </div>
    )
}

export default ProjectPillar