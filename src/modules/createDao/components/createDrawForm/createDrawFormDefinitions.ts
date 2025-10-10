import { type IResourcesInputResource } from '@/shared/components/forms/resourcesInput';
import { type IAppsSetupBodyFormNew, type IAppsSetupBodyForm, type IAppsSetupBodyFormExisting } from '../../dialogs/setupAppsBodyDialog';
import { type ISetupStageSettingsForm } from '../../dialogs/setupStageSettingsDialog';

export enum AppsType {
    ICO = 'ICO',
    DRAW = 'DRAW',
}

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
     * 插件资源
     */
    resources: IResourcesInputResource[];
    /**
     * 抽奖插件的标识
     */
    plugin: string;
}

// ICO 表单接口
export interface ICreateAppFormDataIco extends ICreateDrawFormDataBase {
    /**
     * Advanced governance type.
     */
    appsType: AppsType.ICO;
    /**
     * Stages of the process.
     */
    body: IAppsSetupBodyFormNew | IAppsSetupBodyFormExisting;
}

export interface ICreateAppFormDataDraw extends ICreateDrawFormDataBase {
    /**
     * Advanced governance type.
     */
    appsType: AppsType.DRAW;
    /**
     * Stages of the process.
     */
    body: IAppsSetupBodyFormNew | IAppsSetupBodyFormExisting;
}

export type ICreateAppFormData = ICreateAppFormDataIco | ICreateAppFormDataDraw;

export interface ICreateAppFormStage {
    /**
     * Internal ID of the stage used as reference for bodies.
     */
    internalId: string;
    /**
     * Name of the stage.
     */
    name: string;
    /**
     * List of bodies of the stage.
     */
    bodies: IAppsSetupBodyForm[];
    /**
     * Settings of the stage.
     */
    settings: ISetupStageSettingsForm;
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