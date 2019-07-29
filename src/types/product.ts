import { Document } from 'mongoose';

export interface Product {
    _id: string;
    name: string;
    cost: number;
}

export interface ProductDocument extends Document, Product {
    _id: string;
}
