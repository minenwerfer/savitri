declare const mongoose: any;
export * from 'mongoose';
/**
 * @exports
 * Mongoose singleton instance.
 */
export { mongoose };
/**
 * @exports
 * Options that might be used in schema creation.
 */
export declare const options: {
    timestamps: {
        createdAt: string;
        updatedAt: string;
    };
};
