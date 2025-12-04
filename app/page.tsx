import MajorProjectContainer from "./components/MajorProjectContainer";
import ShrinkingHeader from "./components/ShrinkingHeader";
import MinorProjectContainer from "./components/MinorProjectContainer";
import {Project} from "@/models/project";
import {Project as ProjectType} from "@/types";
import {Suspense} from "react";
import StaticNavbar from "@/app/components/staticNavbar";

export default async function Home() {
    const projects = await Project.find({}, {__v: 0}).lean().then(e => {
        return e.map(obj => {
            return ({
                ...obj,
                _id: obj._id.toString(),
            })
        }) as unknown as ProjectType[];
    })
    const majorProjects = projects.filter(obj => (obj.major))
    const minorProjects = projects.filter(obj => (!obj.major))
    return (
        <main className="h-screen">
            <StaticNavbar />
            <p className="text-xl text-center px-[10%] transition-all">North Seattle College, BAS in Application Development.
                Thank you for visiting this site where you&apos;ll find information about my background, projects, and goals as a developer.</p>
            <Suspense fallback={<p>Loading...</p>}>
                <div className="grid grid-cols-[repeat(1,1fr)] md:grid-cols-[repeat(3,1fr)] md:h-auto w-full">
                    {majorProjects.map((project, i) => {
                        return (
                            <MajorProjectContainer project={project} key={i}/>
                        )
                    })}
                    <div className="bg-blue-700 flex flex-col aspect-square w-full">
                        {minorProjects.map((project, i) => {
                            return (
                                <MinorProjectContainer project={project} key={i}/>
                            )
                        })}
                    </div>
                </div>
            </Suspense>
            <div className="h-24 w-full bg-blue-800"></div>
        </main>
    );
}
