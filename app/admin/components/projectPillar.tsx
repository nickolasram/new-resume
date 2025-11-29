"use client"
import { useProjectContext } from "@/app/contexts/projectContext"
import {use, useEffect} from "react";
import {Project} from "@/types";

const ProjectPillar=(
    {projectsPromise}:{projectsPromise:Promise<Project[]>}
)=>{
    const projects = use(projectsPromise);
    const {project, setProject} = useProjectContext();
    useEffect(()=>{
        setProject(projects[0])
    }, [])
    return(
        <div className="flex flex-col">
            {projects.map((projectItem:any)=>{
                return (
                    <div
                        onClick={() => setProject(projectItem)}
                        key={projectItem._id}
                        className={`hover:bg-gray-800 pl-2 py-3 border-b-[1px] border-[#888] cursor-pointer ${project == projectItem?'bg-gray-600':''}`}>
                        <p className={''}>{projectItem.title}</p>
                    </div>
                )
            })}
            <div
                onClick={() => setProject(undefined)}
                className={`hover:bg-gray-800 pl-2 py-3 cursor-pointer ${project == undefined?'bg-gray-600':''}`}>
                <p className={'text-gray-400'}>New Project +</p>
            </div>
        </div>
    )
}

export default ProjectPillar