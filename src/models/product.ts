import Client from '../database'

export type Product = {
    id: number;
    title: string;
    author: string;
    totalPages: number;
    summary: string;
}