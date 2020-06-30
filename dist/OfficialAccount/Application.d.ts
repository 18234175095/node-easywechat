import BaseApplication from '../Core/BaseApplication';
import AccessToken from './Auth/AccessToken';
import Encryptor from '../Core/Encryptor';
import Guard from './Server/Guard';
import UserClient from './User/UserClient';
import TagClient from './User/TagClient';
import OAuthClient from './OAuth/OAuthClient';
import MenuClient from './Menu/MenuClient';
import TemplateMessageClient from './TemplateMessage/TemplateMessageClient';
import MaterialClient from './Material/MaterialClient';
import CustomerServiceClient from './CustomerService/CustomerServiceClient';
import CustomerServiceSession from './CustomerService/CustomerServiceSession';
import SemanticClient from './Semantic/SemanticClient';
import DataCubeClient from './DataCube/DataCubeClient';
import POIClient from './POI/POIClient';
import AutoReplyClient from './AutoReply/AutoReplyClient';
import BroadcastingClient from './Broadcasting/BroadcastingClient';
import Card from './Card/Card';
import DeviceClient from './Device/DeviceClient';
import ShakeAround from './ShakeAround/ShakeAround';
import StoreClient from './Store/StoreClient';
import CommentClient from './Comment/CommentClient';
import OfficialAccountBase from './Base/OfficialAccountBase';
import OCRClient from './OCR/OCRClient';
import GoodsClient from './Goods/GoodsClient';
import JssdkClient from '../BaseService/Jssdk/JssdkClient';
import MediaClient from '../BaseService/Media/MediaClient';
import QrcodeClient from '../BaseService/Qrcode/QrcodeClient';
import UrlClient from '../BaseService/Url/UrlClient';
export default class OfficialAccount extends BaseApplication {
    protected defaultConfig: object;
    access_token: AccessToken;
    encryptor: Encryptor;
    server: Guard;
    user: UserClient;
    user_tag: TagClient;
    oauth: OAuthClient;
    menu: MenuClient;
    template_message: TemplateMessageClient;
    material: MaterialClient;
    customer_service: CustomerServiceClient;
    customer_service_session: CustomerServiceSession;
    semantic: SemanticClient;
    data_cube: DataCubeClient;
    poi: POIClient;
    auto_reply: AutoReplyClient;
    broadcasting: BroadcastingClient;
    card: Card;
    device: DeviceClient;
    shake_around: ShakeAround;
    store: StoreClient;
    comment: CommentClient;
    base: OfficialAccountBase;
    ocr: OCRClient;
    goods: GoodsClient;
    jssdk: JssdkClient;
    media: MediaClient;
    qrcode: QrcodeClient;
    url: UrlClient;
    constructor(config?: Object, prepends?: Object, id?: String);
    registerProviders(): void;
    clearQuota(): Promise<any>;
    getValidIps(): Promise<any>;
    checkCallbackUrl(): Promise<any>;
}