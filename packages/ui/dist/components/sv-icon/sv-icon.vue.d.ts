declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    name: {
        type: import("vue").PropType<string>;
        required: true;
    };
    fill: {
        type: import("vue").PropType<string>;
    };
    small: {
        type: import("vue").PropType<boolean>;
    };
    variant: {
        type: import("vue").PropType<string>;
        default: string;
    };
    size: {
        type: import("vue").PropType<string>;
    };
    medium: {
        type: import("vue").PropType<boolean>;
    };
    alt: {
        type: import("vue").PropType<boolean>;
    };
    reactive: {
        type: import("vue").PropType<boolean | null>;
        default: null;
    };
    iconRight: {
        type: import("vue").PropType<boolean>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    name: {
        type: import("vue").PropType<string>;
        required: true;
    };
    fill: {
        type: import("vue").PropType<string>;
    };
    small: {
        type: import("vue").PropType<boolean>;
    };
    variant: {
        type: import("vue").PropType<string>;
        default: string;
    };
    size: {
        type: import("vue").PropType<string>;
    };
    medium: {
        type: import("vue").PropType<boolean>;
    };
    alt: {
        type: import("vue").PropType<boolean>;
    };
    reactive: {
        type: import("vue").PropType<boolean | null>;
        default: null;
    };
    iconRight: {
        type: import("vue").PropType<boolean>;
    };
}>>, {
    variant: string;
    reactive: boolean | null;
}, {}>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
