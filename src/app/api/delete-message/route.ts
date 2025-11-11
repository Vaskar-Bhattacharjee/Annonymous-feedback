import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import UserModel from '@/model/User'
import mongoose from 'mongoose';

export async function DELETE(req: Request) {
    await dbConnect();
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        console.log('error: Message ID is required' )
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid message ID' }, { status: 400 })
    }

    try {
        console.log("DELETE MESSAGE ID:", id);
        const user = await UserModel.findOne({ "messages._id": id });
        console.log("FOUND USER:", user ? user.username : "NO USER FOUND");

        if (!user) {
            console.log('error: Message not found' )
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
         const msg = user.messages.id(id)
        if (!msg) {
            console.log('error: Message not found' )
        return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 })
        }

              const result = await UserModel.updateOne(
                { "messages._id": id },
                { $pull: { messages: { _id: id } } }
            );
            console.log("DELETE RESULT:", result);

            return NextResponse.json({ success: true, message: 'Message deleted successfully' }, { status: 200 })
            
        } catch (error : any) {
                return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
                }
  
}

