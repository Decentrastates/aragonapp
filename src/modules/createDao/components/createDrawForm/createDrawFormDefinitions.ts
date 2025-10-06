import { type IResourcesInputResource } from '@/shared/components/forms/resourcesInput';

// 用于所有创建抽奖表单的基础接口
export interface ICreateDrawFormDataBase {
    /**
     * 流程名称
     */
    name: string;
    /**
     * 流程描述
     */
    description: string;
    /**
     * 抽奖插件的标识
     */
    drawKey: string;
    /**
     * 流程资源
     */
    resources: IResourcesInputResource[];
}

// 组合中的NFT单元
export interface IErc1155ComboUnit {
    /**
     * NFT ID
     */
    id: number;
    /**
     * 每次兑换所需的此NFT ID数量
     */
    unit: number;
}

// 用于兑换的NFT组合
export interface IErc1155Combo {
    /**
     * 组合ID
     */
    comboId: number;
    /**
     * 此组合中的NFT单元数组
     */
    nftUnits: IErc1155ComboUnit[];
    /**
     * 此组合是否启用
     */
    isEnabled: boolean;
    /**
     * 此组合的最大总兑换次数
     */
    maxExchangeCount: number;
    /**
     * 单次批次中可兑换的最大组合数
     */
    maxSingleBatch: number;
    /**
     * 此组合的当前兑换次数
     */
    currentExchangeCount: number;
}

// 抽奖功能的通用字段
export interface IDrawCommonFields {
    // 代币设置
    /**
     * 抽奖插件的ERC20代币地址
     * 设置为address(0)以部署新代币
     */
    tokenA?: string;
    /**
     * 抽奖插件的ERC1155代币地址
     * 设置为address(0)以部署新代币
     */
    tokenB?: string;

    // 资格设置
    /**
     * 用于资格验证的代币地址
     */
    eligibleToken?: string;
    /**
     * 最低代币持有要求
     */
    minTokenAmount?: number;
    /**
     * 是否使用ERC1155代币进行资格验证
     */
    isErc1155Eligible?: boolean;
    /**
     * ERC1155代币ID（如果isErc1155Eligible为true则必需）
     */
    eligibleNftId?: string;
    /**
     * 抽奖间隔（秒）
     */
    drawInterval?: number;

    /**
     * 用于兑换的NFT组合
     */
    nftCombos?: IErc1155Combo[];
}

// 分步表单的扩展字段
export interface IDrawExtendedFields extends IDrawCommonFields {
    // 自定义代币设置
    /**
     * 是否使用自定义代币A地址进行兑换规则
     */
    useCustomTokenA?: boolean;
    /**
     * 自定义代币A地址（如果useCustomTokenA为true）
     */
    customTokenA?: string;
    /**
     * 是否使用自定义资格代币
     */
    useCustomEligibleToken?: boolean;
    // NFT创建字段
    /**
     * 是否创建新的ERC1155代币
     */
    isCreateNewErc1155?: boolean;
    /**
     * 代币创建字段
     */
    tokenBMetaData: IErc1155Metadata;
    /**
     * 是否创建新的ERC20代币
     */
    isCreateNewErc20?: boolean;
    /**
     * ERC20代币元数据
     */
    tokenAMetaData: IErc20Metadata;
}

export interface IErc1155Attribute {
    /**
     * 特质类型
     */
    trait_type: string;
    /**
     * 特质值
     */
    value: string | number;
    /**
     * 数值的显示类型
     */
    display_type?: 'number';
}

export interface IErc20Metadata {
    /**
     * 代币名称
     */
    name: string;
    /**
     * 代币符号
     */
    symbol: string;
    /**
     * 代币小数位数
     */
    decimals: number;
    /**
     * 代币初始供应量
     */
    initialSupply?: number;
}

export interface IErc1155Metadata {
    /**
     * ERC1155代币URI（仅在部署新代币时使用）
     */
    erc1155Uri?: string;
    /**
     * NFT名称
     */
    name?: string;
    /**
     * NFT描述
     */
    description?: string;
    /**
     * NFT图像的IPFS URI（ipfs://{cid}）
     */
    image?: string;
    /**
     * 指向项目中多媒體附件的URL。支持的文件扩展名包括GLTF、GLB、WEBM、MP4、M4V、OGV和OGG，以及仅音频扩展名MP3、WAV和OGA。
     * Animation_url还支持HTML页面，允许您使用JavaScript画布、WebGL等构建丰富的体验和交互式NFT。现在支持HTML页面中的脚本和相对路径。但不支持访问浏览器扩展。
     */
    animation_url?: string;
    /**
     * 这是在OpenSea上显示在资产图像下方的URL，允许用户离开OpenSea并在您的网站上查看项目。
     */
    external_url?: string;
    /**
     * OpenSea上项目的背景色。必须是不带前缀#的六字符十六进制。
     */
    background_color?: string;
    /**
     * 此NFT的最大供应量
     */
    supply?: number;
    /**
     * NFT的属性
     */
    attributes?: IErc1155Attribute[];
}

// 主要抽奖表单接口
export interface ICreateDrawForm extends ICreateDrawFormDataBase {
    /**
     * 抽奖插件的治理设置
     */
    governance: IDrawExtendedFields;
}

export type ICreateDrawFormData = ICreateDrawForm;
