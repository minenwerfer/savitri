type Action = {
    click: (subject: any) => void;
};
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    actions: {
        type: import("vue").PropType<any>;
    };
    subject: {
        type: import("vue").PropType<any>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    actionClick: (event: {
        action: Action;
        subject: any;
    }) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    actions: {
        type: import("vue").PropType<any>;
    };
    subject: {
        type: import("vue").PropType<any>;
    };
}>> & {
    onActionClick?: ((event: {
        action: Action;
        subject: any;
    }) => any) | undefined;
}, {}, {}>, {
    default?(_: {}): any;
    extra?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
