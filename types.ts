export type FetchImageValues = 'helper main' | 'resume main' | 'expo main'

export enum Status{
    PreAlpha = 'Pre-alpha',
    Alpha = 'Alpha',
    Beta = 'Beta',
    Production = 'Production',
    Cancelled = 'Cancelled'
}

export enum ProjectTag{
    Nextjs = "Next.js",
    React = "React",
    Tailwind="Tailwind CSS",
    MUI="MaterialUI",
    Expo="Expo",
    Amplify="Amplify",
    Mongo="MongoDB Atlas",
    S3="S3 Buckets",
    RDS="AWS RDS",
    Dynamo="Dynamo DB",
    Lambda="Lambda",
    Kotlin="Kotlin",
    Headless="HeadlessUI",
    Java="Java",
    Desktop="Desktop",
    Mobile="Mobile",
}

export interface ProjectImage{
    url:string;
    position:number;
    hidden:boolean;
    bg:boolean;
}

export interface Project{
    major: boolean;
    title:string;
    tags:string[];
    description:{}[];
    role:string;
    client:string;
    images:ProjectImage[];
    order:number;
    status: Status;
    url?:string;
    github?:string;
    hidden:boolean;
    _id?:string;
    shortcut:string;
}