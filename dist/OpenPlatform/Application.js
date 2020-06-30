'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseApplication_1 = require("../Core/BaseApplication");
const Merge = require("merge");
const Utils_1 = require("../Core/Utils");
const AccessToken_1 = require("./Authorizer/Auth/AccessToken");
const Guard_1 = require("./Authorizer/Server/Guard");
const Application_1 = require("./Authorizer/OfficialAccount/Application");
const Client_1 = require("./Authorizer/OfficialAccount/OAuth/Client");
const Client_2 = require("./Authorizer/OfficialAccount/Account/Client");
const Application_2 = require("./Authorizer/MiniProgram/Application");
const Client_3 = require("./Authorizer/MiniProgram/Auth/Client");
const VerifyTicket_1 = require("./Auth/VerifyTicket");
const AccessToken_2 = require("./Auth/AccessToken");
const OpenPlatformBase_1 = require("./Base/OpenPlatformBase");
const Encryptor_1 = require("../Core/Encryptor");
const OpenPlatformGuard_1 = require("./Server/OpenPlatformGuard");
const CodeTemplateClient_1 = require("./CodeTemplate/CodeTemplateClient");
const ComponentClient_1 = require("./Component/ComponentClient");
class OpenPlatform extends BaseApplication_1.default {
    constructor(config = {}, prepends = {}, id = null) {
        super(config, prepends, id);
        this.verify_ticket = null;
        this.access_token = null;
        this.base = null;
        this.encryptor = null;
        this.server = null;
        this.code_template = null;
        this.component = null;
        this.registerProviders();
    }
    registerProviders() {
        super.registerCommonProviders();
        this.offsetSet('verify_ticket', function (app) {
            return new VerifyTicket_1.default(app);
        });
        this.offsetSet('access_token', function (app) {
            return new AccessToken_2.default(app);
        });
        this.offsetSet('base', function (app) {
            return new OpenPlatformBase_1.default(app);
        });
        this.offsetSet('encryptor', function (app) {
            return new Encryptor_1.default(app.config['app_id'], app.config['token'], app.config['aes_key']);
        });
        this.offsetSet('server', function (app) {
            return new OpenPlatformGuard_1.default(app);
        });
        this.offsetSet('code_template', function (app) {
            return new CodeTemplateClient_1.default(app);
        });
        this.offsetSet('component', function (app) {
            return new ComponentClient_1.default(app);
        });
    }
    getPreAuthorizationUrl(callbackUrl, optional = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Utils_1.isString(optional)) {
                optional = {
                    pre_auth_code: optional,
                };
            }
            else {
                optional['pre_auth_code'] = (yield this.createPreAuthorizationCode())['pre_auth_code'];
            }
            return 'https://mp.weixin.qq.com/cgi-bin/componentloginpage?' + Utils_1.buildQueryString(Merge({}, optional, {
                component_appid: this.config['app_id'],
                redirect_uri: callbackUrl,
            }));
        });
    }
    getMobilePreAuthorizationUrl(callbackUrl, optional = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Utils_1.isString(optional)) {
                optional = {
                    pre_auth_code: optional,
                };
            }
            else {
                optional['pre_auth_code'] = yield this.createPreAuthorizationCode()['pre_auth_code'];
            }
            return 'https://mp.weixin.qq.com/safe/bindcomponent?' + Utils_1.buildQueryString(Merge({}, optional, {
                component_appid: this.config['app_id'],
                redirect_uri: callbackUrl,
                action: 'bindcomponent',
                no_scan: 1,
            }));
        });
    }
    getAuthorizerConfig(appId, refreshToken = null) {
        return Merge({}, this.config, {
            component_app_id: this.config['app_id'],
            app_id: appId,
            refresh_token: refreshToken,
        });
    }
    getReplaceServices(accessToken = null) {
        let that = this;
        let services = {
            access_token: accessToken || function (app) {
                return new AccessToken_1.default(app, that);
            },
            server: function (app) {
                return new Guard_1.default(app);
            },
        };
        ['cache', 'log', 'request'].forEach(function (reuse) {
            if (that[reuse]) {
                services[reuse] = that[reuse];
            }
        });
        return services;
    }
    officialAccount(appId, refreshToken = null, accessToken = null) {
        let that = this;
        let services = Merge({}, this.getReplaceServices(accessToken), {
            encryptor: this.encryptor,
            account: function (app) {
                return new Client_2.default(app, that);
            },
            oauth: function (app) {
                return new Client_1.default(that);
            },
        });
        return new Application_1.default(this.getAuthorizerConfig(appId, refreshToken), services);
    }
    miniProgram(appId, refreshToken = null, accessToken = null) {
        let that = this;
        let services = Merge({}, this.getReplaceServices(accessToken), {
            auth: function (app) {
                return new Client_3.default(app, that);
            },
        });
        return new Application_2.default(this.getAuthorizerConfig(appId, refreshToken), services);
    }
    // map to `base` module
    handleAuthorize() {
        return this.base.handleAuthorize.apply(this.base, arguments);
    }
    getAuthorizer() {
        return this.base.getAuthorizer.apply(this.base, arguments);
    }
    getAuthorizerOption() {
        return this.base.getAuthorizerOption.apply(this.base, arguments);
    }
    setAuthorizerOption() {
        return this.base.setAuthorizerOption.apply(this.base, arguments);
    }
    getAuthorizers() {
        return this.base.getAuthorizers.apply(this.base, arguments);
    }
    createPreAuthorizationCode() {
        return this.base.createPreAuthorizationCode.apply(this.base, arguments);
    }
    clearQuota() {
        return this.base.clearQuota.apply(this.base, arguments);
    }
}
exports.default = OpenPlatform;
;