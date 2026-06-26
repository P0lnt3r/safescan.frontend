import { CirculationVO, CrossChainVO, GET, MasterNodeVO, NodeRegisterActionVO, NodeRewardVO, POST, PageQueryDTO, PageResponseVO, StateVO, SuperNodeVO, TimestampStatisticVO } from "./index.d";
import config from "../config";
const CROSSCHAIN_HOST = config.crosschain;

export async function fetchCrossChainByTxHash(params: { srcTxHash?: string, dstTxHash?: string }): Promise<CrossChainVO> {
  const serverResponse = await GET(`${CROSSCHAIN_HOST}/getByTxHash`, params);
  return serverResponse;
}

export async function fetchCrosschains(params: PageQueryDTO | { address?: string, txHash?: string }): Promise<PageResponseVO<CrossChainVO>> {
  const serverResponse = await POST(`${CROSSCHAIN_HOST}/getPage`, { ...params });
  return serverResponse.data;
}

export async function fetchCrosschainStatistic(): Promise< {
  balance : {
    [ network in string ] : {
      [ address in string ] : string
    }
  } , 
  statistic : {
    asset : string , 
    safe4BscCount : number ,  
    safe4BscAmount : string ,
    safe4EthCount : number ,
    safe4EthAmount : string ,
    safe4MaticCount : number ,
    safe4MaticAmount : string ,
    bscSafe4Count : number ,
    bscSafe4Amount : string ,
    ethSafe4Count : number ,
    ethSafe4Amount : string ,
    maticSafe4Count : number ,
    maticSafe4Amount : string
  }[]
} > {
  const serverResponse = await GET(`${CROSSCHAIN_HOST}/statistic` , {asset: 'SAFE'});
  return serverResponse;
}


