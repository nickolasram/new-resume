import { Project, Status } from '@/types';
import { NextRequest,NextResponse } from 'next/server'
import {Project as MongooseProject} from '@/models/project'

export async function POST(req:NextRequest){
    const formData = await req.formData();
    await MongooseProject.syncIndexes();
    const projectID = formData.get("id")?formData.get("id"):undefined;
    let projectObject;
    if(projectID){
        projectObject = await MongooseProject.findOne({_id:projectID});
    } else {
        projectObject = new MongooseProject()
    }
    const inputtedProject:Project = {
        title: formData.get('title') != '' ? formData.get('title') as string : 'Default Name',
        client: formData.get('client') != '' ? formData.get('client') as string : 'Default Client',
        role: formData.get('role') != '' ? formData.get('role') as string : 'Default Role',
        major: !!formData.get('major'),
        hidden: !!formData.get('hidden'),
        tags: formData.getAll('tags') ? formData.getAll('tags') as string[] : [],
        description: 'default description',
        lastUpdate: formData.get('lastUpdate') ? new Date(formData.get('lastUpdate') as string) : new Date(),
        order: formData.get("order") ? parseInt(formData.get("order") as string) : 99,
        images: [],
        status: Status[formData.get('status') as keyof typeof Status],
        url: formData.get('url') ? formData.get('url') as string : undefined,
        github: formData.get('github') ? formData.get('github') as string : undefined,
    }
    for (const [key, value] of Object.entries(inputtedProject)){
        projectObject[key] = value;
    }
    try{
        await projectObject.save();
        return NextResponse.json({success: true}, {status:200});
    }   catch (err) {
        console.error(err);
        return NextResponse.json({error: err}, {status:500});
    }

}