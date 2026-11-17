export interface InsightApiResponse<T> {
    status: string;
    message: string;
    result: T;
}
