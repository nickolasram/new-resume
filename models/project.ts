import mongoose from "mongoose";

const PictureSchema = new mongoose.Schema({
    url: {type: String, required: true, default: ''},
    hidden: {type: Boolean, required: true, default: true},
    bg: {type: Boolean, required: true, default: false},
    position: {type: Number, required: true, default: 99}
})

const projectSchema = new mongoose.Schema({
    major: {type: Boolean, required: true},
    title: {type: String, required: true, unique: true},
    tags: {type: [String], required: true, default: []},
    description: {type: String, required: true, default: ""},
    lastUpdate: {type: Date, required: true, default: Date.now()},
    role: {type: String, required: true, default: 'Developer'},
    client: {type: String, required: true, default: 'Self'},
    images: {type: [PictureSchema], required: true, default: [{url:process.env.NEXT_PUBLIC_AWS_DEFAULT,hidden:false,bg:true,position:1}]},
    hidden: {type: Boolean, required: true, default: true},
    order: {type: Number, required: true, default: 99},
    status: {type: String, required: true, default: 'Pre-alpha'},
    url: {type: String, sparse: true},
    github: {type: String, sparse: true},
})
 
export const Project = mongoose.models.Project ||  mongoose.model('Project', projectSchema)