import { Document } from 'mongoose';

export interface Order {
    _id: string;
    user: string;
    products: string[];
    numbers: string[];
}

export interface OrderDocument extends Document, Order {
    _id: string;
}
