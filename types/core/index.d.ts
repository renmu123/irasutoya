import type { AxiosInstance, AxiosProxyConfig } from "axios";
export default class Client {
    request: AxiosInstance;
    constructor(proxy?: AxiosProxyConfig | false);
    /**
     * 获取标签列表
     */
    getlabelList(): Promise<{
        label: string;
        link: string;
    }[]>;
    /**
     * 获取标签详情
     */
    getLabelDetail(url: string): Promise<{
        imageData: {
            label: string;
            link: string;
            image: string;
            rawImage: string;
        }[];
        nextPage: string;
    }>;
    /**
     * 获取页面
     */
    getPage(url: string): Promise<any>;
}
