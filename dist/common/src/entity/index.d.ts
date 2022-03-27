export declare const getIndexes: (description: any, key: string, form?: boolean) => any;
export declare const getFirstIndex: (description: any, key: string, form?: boolean) => any;
/**
 * @param {string} value
 * @param {string} key
 * @param {boolean} form - tells whether or not the value is being used in a form
 */
export declare const getFirstValue: (description: any, value: any, key: string, form?: boolean, name?: string | undefined) => any;
export declare const formatValue: (description: any, value: any, key: string, form?: boolean, field?: any) => string;
export declare const resumeItem: (description: any, item: any) => {
    [x: string]: any;
};
export declare const getItemIndex: (item: any, items?: any[] | undefined, name?: string | undefined) => any;
