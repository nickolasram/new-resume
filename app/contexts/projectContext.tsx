"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { Project } from "@/types"; 

type ProjectContextType ={
    project:Project|undefined;
    setProject:Dispatch<SetStateAction<Project|undefined>>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({children}:{children:ReactNode}){
    const [project, setProject] = useState<Project|undefined>(undefined);

    return(
        <ProjectContext.Provider value={{project, setProject}}>
            {children}
        </ProjectContext.Provider>
    )
};

export function useProjectContext(){
    const context = useContext(ProjectContext);
    if (context==undefined){
        throw new Error("missing project context")
    }
    return context;
}