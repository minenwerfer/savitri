declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    url: {
        type: import("vue").PropType<string>;
    };
    fileId: {
        type: import("vue").PropType<string>;
    };
    modelValue: {
        type: import("vue").PropType<string>;
    };
    objectFit: {
        type: import("vue").PropType<string>;
    };
    bordered: {
        type: import("vue").PropType<boolean>;
    };
    width: {
        type: import("vue").PropType<string>;
    };
    height: {
        type: import("vue").PropType<string>;
    };
    expandable: {
        type: import("vue").PropType<boolean>;
    };
    meta: {
        type: import("vue").PropType<{
            created_at: string;
            updated_at: string;
            owner: {
                full_name: string;
            };
        }>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    url: {
        type: import("vue").PropType<string>;
    };
    fileId: {
        type: import("vue").PropType<string>;
    };
    modelValue: {
        type: import("vue").PropType<string>;
    };
    objectFit: {
        type: import("vue").PropType<string>;
    };
    bordered: {
        type: import("vue").PropType<boolean>;
    };
    width: {
        type: import("vue").PropType<string>;
    };
    height: {
        type: import("vue").PropType<string>;
    };
    expandable: {
        type: import("vue").PropType<boolean>;
    };
    meta: {
        type: import("vue").PropType<{
            created_at: string;
            updated_at: string;
            owner: {
                full_name: string;
            };
        }>;
    };
}>>, {}, {}>, {
    fallback?(_: {}): any;
    default?(_: {}): any;
    caption?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
