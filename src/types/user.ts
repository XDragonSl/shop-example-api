import { Document } from 'mongoose';
import { BinaryLike } from 'crypto';

export interface User {
    _id: string;
    email?: string;
    name?: string;
    role?: string;
    hash?: string;
    salt?: string;
}

export interface UserDocument extends Document, User {
    _id: string;
}
