import { Project, Status } from '@/types';
import { NextRequest,NextResponse } from 'next/server'
import {Project as MongooseProject} from '@/models/project'
import {ProjectImage} from "@/types";

export async function POST(req:NextRequest){
    try{
        const headers = req.headers;
        if(headers.get('Content-Type') === 'application/json'){
            const body = await req.json();
            const image = body.imageUrl;
            if(!image){
                return NextResponse.json({error: "Image Error"}, {status:500, statusText:'No URL returned from S3'});
            }
            console.log(image);
            const project = await MongooseProject.findById(body.id);
            const projectImages:ProjectImage[] = project['images'];
            const singleton = projectImages.length == 0;
            projectImages.push({
                url:body.imageUrl,
                hidden:!singleton,
                bg:singleton,
                position:99
            })
            project['images'] = projectImages;
            const writeResult = await project.save()
            if(writeResult._id){
                return NextResponse.json({success: true}, {status:200});
            } else {
                return NextResponse.json({error: new Error("upload error")}, {status:500, statusText:'something went wrong'});
            }
        }
        const formData = await req.formData();
        await MongooseProject.syncIndexes();
        const projectID = formData.get("id")?formData.get("id"):undefined;
        let projectObject;
        if(projectID){
            projectObject = await MongooseProject.findOne({_id:projectID});
        } else {
            projectObject = new MongooseProject()
        }
        let parsedDescription = JSON.parse(formData.get('description') as string).description
        if (typeof parsedDescription[0] == 'string'){
            parsedDescription = JSON.parse(parsedDescription)
        }
        const statusFiltered = formData.get('status') == 'Pre-alpha'?'PreAlpha':formData.get('status');
        const inputtedProject:Project = {
            title: formData.get('title') != '' ? formData.get('title') as string : 'Default Name',
            client: formData.get('client') != '' ? formData.get('client') as string : 'Default Client',
            role: formData.get('role') != '' ? formData.get('role') as string : 'Default Role',
            major: !!formData.get('major'),
            hidden: !!formData.get('hidden'),
            tags: formData.getAll('tags') ? formData.getAll('tags') as string[] : [],
            description: parsedDescription as {}[],
            order: formData.get("order") ? parseInt(formData.get("order") as string) : 99,
            images: formData.getAll('images[]').map(entry=>(
                    JSON.parse(entry as string)
                )
            ),
            status: Status[statusFiltered as keyof typeof Status],
            url: formData.get('url') ? formData.get('url') as string : undefined,
            github: formData.get('github') ? formData.get('github') as string : undefined,
            shortcut: formData.get('shortcut') as string,
        }
        for (const [key, value] of Object.entries(inputtedProject)){
            projectObject[key] = value;
        }
        console.log(formData.get('status'));
        console.log(Status[formData.get('status') as keyof typeof Status]);
        await projectObject.save();
        return NextResponse.json({success: true}, {status:200});
    }   catch (err) {
        console.error(err);
        return NextResponse.json({error: err}, {status:500, statusText:'something went wrong'});
    }

}