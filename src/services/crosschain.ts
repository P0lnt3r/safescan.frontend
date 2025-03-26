import { CirculationVO, CrossChainVO, GET, MasterNodeVO, NodeRegisterActionVO, NodeRewardVO, POST, PageQueryDTO, PageResponseVO, StateVO, SuperNodeVO, TimestampStatisticVO } from "./index.d";
import config from "../config";
const CROSSCHAIN_HOST = config.crosschain;

export async function fetchCrossChainByTxHash( params: { srcTxHash ?: string , dstTxHash ?: string }): Promise<CrossChainVO> {
    const serverResponse = await GET(`${CROSSCHAIN_HOST}/getByTxHash`, params);
    return serverResponse;
  }