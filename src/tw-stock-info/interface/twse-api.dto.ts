interface TWSEApiResponse {
    stat?: string;
    date?: string;
    tables?: Tables[];
    title?: string;
    fields?: string[];
    data?: object[][];
    hints?: string;
    notes?: string[];
    params?: ParamsInfo;
    total?: number;
}

interface ParamsInfo {
    type?: string;
    controller?: string;
    action?: string;
    lang?: string;
    date?: string;
}

interface Tables {
    title?: string;
    fields?: string[];
    data?: object[][];
}