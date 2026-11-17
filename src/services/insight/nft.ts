import { GET } from "../index.d";
import config from "../../config";
import { InsightApiResponse } from "./index";

const INSIGHT_API_HOST = `${config.api_host}/insight/api`;

/** Insight NFT 代币信息（/insight/api/nft/tokens） */
export interface InsightNftTokenVO {
    address: string;
    name: string;
    symbol: string;
    holders: number;
    totalTransfers: number;
    totalAssets: number;
    type: string;
    logoURI: string | null;
    template: boolean;
    creator: string;
}

/**
 * 获取链上 NFT 资产代币列表
 * GET /insight/api/nft/tokens
 */
export async function fetchInsightNftTokens(): Promise<InsightNftTokenVO[]> {
    const response = (await GET(
        `${INSIGHT_API_HOST}/nft/tokens`
    )) as InsightApiResponse<InsightNftTokenVO[]>;

    if (response?.status === "1" && Array.isArray(response.result)) {
        return response.result;
    }
    return [];
}

/**
 * 获取 NFT 资产代币数量
 */
export async function fetchInsightNftTokenCount(): Promise<number> {
    const tokens = await fetchInsightNftTokens();
    return tokens.length;
}
