declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    modelValue: {
        type: import("vue").PropType<string | number | Date>;
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
    variant: {
        type: import("vue").PropType<"bold" | "normal" | "light">;
    };
    bordered: {
        type: import("vue").PropType<boolean>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    input: (value: string | number | Date) => void;
    change: (value: any) => void;
    "update:modelValue": (value: string | number | Date) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: import("vue").PropType<string | number | Date>;
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
    variant: {
        type: import("vue").PropType<"bold" | "normal" | "light">;
    };
    bordered: {
        type: import("vue").PropType<boolean>;
    };
}>> & {
    onChange?: ((value: any) => any) | undefined;
    onInput?: ((value: string | number | Date) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | number | Date) => any) | undefined;
}, {}, {}>, {
    default?(_: {}): any;
    description?(_: {}): any;
    hint?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
