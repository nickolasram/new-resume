import {Project} from "@/models/project";
import {NextRequest, NextResponse} from "next/server";
import {Project as ProjectType} from "@/types";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const shortcut = params.get("shortcut");
    try {
        const project = await Project.findOne({shortcut:shortcut},{__v:0}).lean()
            .then(e => {
            return ({
                ...e,
                _id: e._id.toString(),
            }) as ProjectType
        })
        return NextResponse.json( { data: project },{status:200, headers: { "Content-Type": "application/json" }});
    } catch (err) {
        return NextResponse.json({error: err}, {status:500});
    }
}