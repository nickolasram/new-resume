import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

export async function GET(){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('eT*p1[]~4>bTT4"n£4,::4!z', salt);
    const hashedPassword2 = await bcrypt.hash('UPjV9bHf7xBf>.7Bf21)Di:r', salt);
    const values = {
        pw1:hashedPassword,
        pw2:hashedPassword2
    }
    return NextResponse.json({success:true,data:values}, {status:200})
}