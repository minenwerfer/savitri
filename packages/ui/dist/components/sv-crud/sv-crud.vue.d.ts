import { CollectionStore } from '@savitri/web';
import type { Layout } from '@semantic-api/types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    collection: {
        type: import("vue").PropType<string>;
        required: true;
    };
    componentProps: {
        type: import("vue").PropType<Record<string, any>>;
    };
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    layout: {
        type: import("vue").PropType<Layout>;
    };
    action: {
        type: import("vue").PropType<any>;
    };
    parentField: {
        type: import("vue").PropType<string>;
    };
    noControls: {
        type: import("vue").PropType<boolean>;
    };
    noActions: {
        type: import("vue").PropType<boolean>;
    };
    noFetch: {
        type: import("vue").PropType<boolean>;
    };
    noRefresh: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    noLayoutToggle: {
        type: import("vue").PropType<boolean>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    uiEvent: (event: any) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    collection: {
        type: import("vue").PropType<string>;
        required: true;
    };
    componentProps: {
        type: import("vue").PropType<Record<string, any>>;
    };
    parentCollection: {
        type: import("vue").PropType<string>;
    };
    layout: {
        type: import("vue").PropType<Layout>;
    };
    action: {
        type: import("vue").PropType<any>;
    };
    parentField: {
        type: import("vue").PropType<string>;
    };
    noControls: {
        type: import("vue").PropType<boolean>;
    };
    noActions: {
        type: import("vue").PropType<boolean>;
    };
    noFetch: {
        type: import("vue").PropType<boolean>;
    };
    noRefresh: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    noLayoutToggle: {
        type: import("vue").PropType<boolean>;
    };
}>> & {
    onUiEvent?: ((event: any) => any) | undefined;
}, {
    noRefresh: boolean;
}, {}>, Partial<Record<string, (_: {
    property: import("@semantic-api/types").CollectionProperty;
    modelValue: any;
    key: string;
}) => any>> & Partial<Record<string, (_: any) => any>> & {
    actions?(_: {}): any;
    empty?(_: {
        collection: string;
    }): any;
    component?(_: {
        store: CollectionStore;
    }): any;
    tfoot?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
