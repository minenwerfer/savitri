declare const _default: (name: string, store: any) => {
    useFields: (fields: string[], except?: boolean) => any;
    useFieldsExcept: (fields: string[]) => any;
    getFirstField: (value: any, key: string, form?: boolean) => any;
    getFirstValue: (value: any, key: string, form?: boolean) => any;
    formatValue: (value: any, key: string, form?: boolean) => any;
    resumedItem: import("vue").ComputedRef<{
        [x: string]: any;
    }>;
    resumedItems: import("vue").ComputedRef<any>;
};
export default _default;
