declare const _default: import("vue").DefineComponent<{
    property: {
        type: import("vue").PropType<import("@semantic-api/types").CollectionProperty>;
    };
    modelValue: {
        type: import("vue").PropType<any>;
        required: true;
    };
    propertyName: {
        type: import("vue").PropType<string>;
    };
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    columns: {
        type: import("vue").PropType<number>;
        default: number;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: any) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    property: {
        type: import("vue").PropType<import("@semantic-api/types").CollectionProperty>;
    };
    modelValue: {
        type: import("vue").PropType<any>;
        required: true;
    };
    propertyName: {
        type: import("vue").PropType<string>;
    };
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    columns: {
        type: import("vue").PropType<number>;
        default: number;
    };
}>> & {
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}, {
    columns: number;
}, {}>;
export default _default;
