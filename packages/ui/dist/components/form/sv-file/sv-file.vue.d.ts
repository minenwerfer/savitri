declare const _default: import("vue").DefineComponent<{
    modelValue: {
        type: import("vue").PropType<any>;
        required: true;
    };
    property: {
        type: import("vue").PropType<import("@semantic-api/types").CollectionProperty>;
    };
    propertyName: {
        type: import("vue").PropType<string>;
    };
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    meta: {
        type: import("vue").PropType<Record<string, any>>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: any) => void;
    "update:modelValue": (value: any) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: import("vue").PropType<any>;
        required: true;
    };
    property: {
        type: import("vue").PropType<import("@semantic-api/types").CollectionProperty>;
    };
    propertyName: {
        type: import("vue").PropType<string>;
    };
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    meta: {
        type: import("vue").PropType<Record<string, any>>;
    };
}>> & {
    onChange?: ((value: any) => any) | undefined;
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}, {}, {}>;
export default _default;
