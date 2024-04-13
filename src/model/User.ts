import { Schema, model } from "mongoose";

interface User {
    firstName: String,
    lastName: String,
    email?: String,
    isikukood?: String,
    birthDate: String,
    username?: String,
    password: String,
    roles: String
}

const userSchema = new Schema<User>({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email is required"]
    },
    isikukood: {
        type: String,
        unique: [true, "Isikukood already exists"],
        required: [true, "Isikukood is required"]
    },
    birthDate: {
        type: String,
        required: [true, "Birth date is required"]
    },
    username: {
        type: String,
        unique: [true, "Username already exists"],
        required: [true, "Username is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
}, {
    timestamps: true
});

const User = model<User>('User', userSchema);

export default User;