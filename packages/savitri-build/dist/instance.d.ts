export type InstanceConfig = {
    exposed: {
        themes?: Array<string>;
        darkThemes?: Array<string>;
        dashboardLayout?: Record<string, {}>;
        title: string;
        signinText: string;
    };
    icons?: Array<string>;
};
export declare const getInstanceConfig: () => Promise<{
    exposed: {};
    icons: string[];
}>;
