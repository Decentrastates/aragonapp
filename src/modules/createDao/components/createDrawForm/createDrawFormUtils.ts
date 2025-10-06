import type { ICreateDrawFormData, IDrawExtendedFields } from './createDrawFormDefinitions';

class CreateDrawFormUtils {
    buildDefaultData = (): ICreateDrawFormData => {
        const defaultDraw: IDrawExtendedFields = {
            // 资格设置
            eligibleToken: undefined, // 用于资格验证的代币地址,对应的应该是address类型
            minTokenAmount: 100, // 最低代币持有要求
            isErc1155Eligible: false, // 是否使用ERC1155代币进行资格验证
            eligibleNftId: undefined, // ERC1155代币ID（如果isErc1155Eligible为true则必需）
            drawInterval: 86400, // 抽奖间隔（秒）- 24小时

            // 代币设置
            tokenA: '', // 抽奖插件的ERC20代币地址
            tokenB: '', // 抽奖插件的ERC1155代币地址

            // NFT组合
            nftCombos: [
                {
                    comboId: 1,
                    nftUnits: [
                        { id: '1', unit: 1 },
                        { id: '2', unit: 1 },
                        { id: '3', unit: 1 },
                        { id: '4', unit: 1 },
                        { id: '5', unit: 1 },
                        { id: '6', unit: 1 },
                    ],
                    isEnabled: true,
                    maxExchangeCount: 0,
                    maxSingleBatch: 0,
                    currentExchangeCount: 0,
                },
            ], // 用于兑换的NFT组合

            // 扩展字段
            isCreateNewErc1155: true, // 是否创建新的ERC1155代币
            isCreateNewErc20: true, // 是否创建新的ERC20代币
            
            tokenAMetaData: {
                name: 'A', // ERC20代币名称
                symbol: 'A', // ERC20代币符号
                decimals: 18, // 代币小数位数
                initialSupply: 10000000, // 代币初始供应量
            },
            tokenBMetaData: {
                erc1155Uri: 'https://ipfs.io/ipfs/', // ERC1155代币URI（仅在部署新代币时使用）
            },
        };

        return {
            // 提案基础字段
            name: 'New Draw', // 提案名称
            description: '新的抽奖提案，抽奖规则等', // 提案描述
            drawKey: 'NDW', // 抽奖插件的标识
            resources: [], // 提案资源

            // 抽奖设置（为了与其他插件保持一致性而使用governance命名）
            governance: defaultDraw,
        };
    };
}

export const createDrawFormUtils = new CreateDrawFormUtils();
