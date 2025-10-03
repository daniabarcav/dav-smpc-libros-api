export declare class Book {
    id: string;
    title: string;
    author: string;
    publisher: string;
    year: number;
    price: number;
    genre: string;
    available: boolean;
    coverurl?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
