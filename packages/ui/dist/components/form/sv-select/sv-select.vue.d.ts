declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
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
    booleanRef: {
        type: import("vue").PropType<boolean>;
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
    booleanRef: {
        type: import("vue").PropType<boolean>;
    };
}>> & {
    onChange?: ((value: any) => any) | undefined;
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}, {}, {}>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
