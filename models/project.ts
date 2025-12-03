import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    major: {type: Boolean, required: true},
    title: {type: String, required: true, unique: true},
    tags: {type: [String], required: true, default: []},
    description: {type: [mongoose.Schema.Types.Mixed], required: true, default: [
        {
            type: 'paragraph',
            children: [
                { text: "Default Text" }
            ],
        }
    ]},
    role: {type: String, required: true, default: 'Developer'},
    client: {type: String, required: true, default: 'Self'},
    images: {type: [mongoose.Schema.Types.Mixed], required: true, default: [{url:process.env.NEXT_PUBLIC_AWS_DEFAULT,hidden:false,bg:true,position:1}]},
    hidden: {type: Boolean, required: true, default: true},
    order: {type: Number, required: true, default: 99},
    status: {type: String, required: true, default: 'Pre-alpha'},
    url: {type: String, sparse: true},
    github: {type: String, sparse: true},
    shortcut: {type: String, required: true, default: 'default'},
})
 
export const Project = mongoose.models.Project ||  mongoose.model('Project', projectSchema)