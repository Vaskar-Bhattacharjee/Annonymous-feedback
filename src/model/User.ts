import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})
export interface User extends Document {
    username: string;
    password: string;
    email: string;
    verfiyCode: string;
    isVerified: boolean;
    verifyCodeExpire: Date;
    isAcceptingMessage: boolean;
    messages: Message[];

}
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "password must be at least 6 characters"],
    },
    verfiyCode: {
        type: String,
        required: [true, "verfiyCode is required"],
    },
    verifyCodeExpire: {
        type: Date,
        required: [true, "verifyCodeExpire is required"]
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: {
        type: [MessageSchema],
        default: []
    }
}, {
    timestamps: true
        
})

const UserModel = (mongoose.models.Users as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);
export default UserModel;