type ResponseWrapper<T> = {
    success: boolean;
    data: T;
    statusCode: number;
    total?: number;
    count?: number;
    error?: string;
    message?: string | string[];
};
