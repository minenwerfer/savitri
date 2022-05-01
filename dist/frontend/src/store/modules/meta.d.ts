import { Module, ActionProps } from '../module';
/**
 * @exports @interface
 * Prompt actions.
 */
export interface PromptAction {
    title: string;
}
/**
 * @exports @interface
 * Meta interface.
 */
export interface Meta {
    globalIsLoading: boolean;
    globalDescriptions: any[];
    viewTitle: string;
    menu: {
        isVisible: boolean;
        isMobileVisible: boolean;
    };
    modal: {
        isVisible: boolean;
        title: string;
        body: string;
        image?: string;
        component?: string;
        details: {};
    };
    prompt: {
        isVisible: boolean;
        title: string;
        body: string;
        actions: PromptAction[];
    };
    sidebar: {
        isVisible: boolean;
        title: string;
        component: string;
    };
    toast: {
        isVisible: boolean;
        text: string;
        itr: number;
    };
    report: {
        isVisible: boolean;
    };
    crud: {
        isInsertVisible: boolean;
        isInsertReadonly: boolean;
    };
}
/**
 * @exports @class
 * Meta module.
 */
export declare class MetaModule extends Module<Meta, {}> {
    constructor();
    getters(): {
        isInsertVisible: (state: any) => any;
        isInsertReadonly: (state: any) => any;
        isMenuVisible: (state: any) => any;
        isMobileMenuVisible: (state: any) => any;
    };
    actions(this: MetaModule): {
        /**
         * @function
         * Fetchs all modules metadata from backend.
         * It may be accessed through _description.
         */
        describeAll: ({ commit }: ActionProps) => Promise<any>;
        describe: ({ commit }: ActionProps, modules: string[]) => Promise<void>;
        setViewTitle: ({ commit }: ActionProps, value: string) => void;
        swapMenu: ({ commit }: ActionProps, value?: any) => void;
        spawnModal: ({ commit }: ActionProps, payload: any) => Promise<void>;
        closeModal: ({ commit }: ActionProps) => void;
        spawnPrompt: ({ commit }: ActionProps, payload: any) => Promise<string>;
        closePrompt: ({ commit }: ActionProps) => void;
        fulfillPrompt: ({ commit }: ActionProps, option: string) => void;
        closeCrud: ({ commit }: ActionProps) => void;
        spawnSidebar: ({ commit }: ActionProps, payload: any) => void;
        closeSidebar: ({ commit }: ActionProps) => void;
        spawnToast: ({ commit }: ActionProps, payload: any) => void;
        closeToast: ({ commit }: ActionProps) => void;
        spawnReport: ({ commit }: ActionProps) => void;
        closeReport: ({ commit }: ActionProps) => void;
    };
    mutations(): {
        GLOBAL_LOADING_SWAP: (state: any, value: boolean) => void;
        VIEW_TITLE_SET: (state: any, value: string) => void;
        DESCRIPTIONS_ADD: (state: any, module: any) => void;
        DESCRIPTIONS_CLEAR: (state: any) => void;
        MENU_SWAP: (state: any, value: {
            isVisible?: boolean;
            isMobileVisible?: boolean;
        }) => void;
        MODAL_SPAWN: (state: any, payload: any) => void;
        MODAL_CLOSE: (state: any) => void;
        PROMPT_SPAWN: (state: any, payload: any) => void;
        PROMPT_CLOSE: (state: any) => void;
        PROMPT_FULFILL: (_: unknown, option: string) => void;
        SIDEBAR_SPAWN: (state: any, payload: any) => void;
        SIDEBAR_CLOSE: (state: any) => void;
        TOAST_SPAWN: (state: any, payload: any) => void;
        TOAST_CLOSE: (state: any) => void;
        REPORT_SPAWN: (state: any) => void;
        REPORT_CLOSE: (state: any) => void;
        CRUD_CLOSE: (state: any) => void;
        CRUD_EDIT: (state: any) => void;
        CRUD_OPEN: (state: any) => void;
    };
}
