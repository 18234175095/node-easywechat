/*!
 * EasyWechat.js v1.2.0
 * (c) 2017-2017 Hpyer
 * Released under the MIT License.
 */
"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}function t(e){return new Promise(function(t,n){function i(r,o){try{var c=e[o?"throw":"next"](r)}catch(e){return void n(e)}c.done?t(c.value):Promise.resolve(c.value).then(i,s)}function s(e){i(e,1)}i()})}var n=e(require("merge")),i=e(require("request")),s=e(require("body")),r=e(require("url")),o=e(require("qs")),c=e(require("sha1")),a=require("xml2js");class u{constructor(e,t){this.$req=e,this.$res=t}getMethod(){return this.$req?this.$req.method:{}}getQuery(){return this.$req?r.parse(this.$req.url,!0).query:{}}_readBody(){return new Promise((e,t)=>{s(this.$req,(n,i)=>{n?t(n):e(i)})}).catch(e=>{console.log("app_server._readBody()",e)})}getBody(){return t(function*(){return this.$req?yield this._readBody():""}.call(this))}_initResponseOptions(e={}){return e.status=e.status||200,e.contentType=e.contentType||"text/html",e.headers=e.headers||{},e.headers["Content-Type"]=e.contentType,e}sendResponse(e,t={}){if(!this.$res)return!1;t=this._initResponseOptions(t),this.$res.writeHead(t.status,t.headers),this.$res.end(e)}}class l extends u{constructor(e){super(e.req,e.res),this.$ctx=e}sendResponse(e,t={}){if(!this.$ctx)return!1;t=this._initResponseOptions(t),this.$ctx.status=t.status;for(let e in t.headers)this.$ctx.set(e,t.headers[e]);this.$ctx.body=e}}class d extends u{constructor(e,t){super(e,t)}sendResponse(e,t={}){if(!this.$res)return!1;t=this._initResponseOptions(t),this.$res.status(t.status).set(t.headers).send(e)}}const f={appKey:"",appSecret:""};class p{constructor(e={}){if(this.$config=n({},f,e),!this.$config.appKey)throw new Error("\u672a\u586b\u5199appKey");if(!this.$config.appSecret)throw new Error("\u672a\u586b\u5199appSecret");this.$plugins.forEach(e=>{this[e].init(this)})}setAppServerDefault(e,t){this.$config.app=new u(e,t)}setAppServerKoa2(e){this.$config.app=new l(e)}setAppServerExpress(e,t){this.$config.app=new d(e,t)}}p.prototype.requestGet=(e=>new Promise((t,n)=>{i({method:"GET",uri:e},function(e,i,s){if(e)n(e);else{try{s=JSON.parse(s)}catch(e){}t(s)}})})),p.prototype.requestFile=(e=>new Promise((t,n)=>{i({method:"GET",uri:e,encoding:"binary"},function(e,i,s){e?n(e):t(s)})})),p.prototype.requestPost=((e,t=null)=>new Promise((n,s)=>{i({method:"POST",uri:e,json:t},function(e,t,i){e?s(e):n(i)})})),p.prototype.$plugins=[],p.registPlugin=((e,t)=>{p.prototype[e]=t,p.prototype.$plugins.push(e)});const h="https://open.weixin.qq.com/connect/oauth2/authorize",g="https://open.weixin.qq.com/connect/qrconnect",m="https://api.weixin.qq.com/sns/oauth2/access_token",_="https://api.weixin.qq.com/sns/userinfo";class y{constructor(){this.id="",this.nickname="",this.name="",this.avatar="",this.original={},this.token={}}}var k;const q=function(e){k=e},$=function(e=""){if(!k.$config.oauth)return"";if(!k.$config.oauth.scope)throw new Error("\u672a\u586b\u5199\u6388\u6743scope");if(!k.$config.oauth.redirect)throw new Error("\u672a\u586b\u5199\u6388\u6743\u56de\u8c03\u5730\u5740");let t=k.$config.oauth.redirect;if("http://"!=t.substr(0,7)&&"https://"!=t.substr(0,8))throw new Error("\u8bf7\u586b\u5199\u5b8c\u6574\u7684\u56de\u8c03\u5730\u5740\uff0c\u4ee5\u201chttp://\u201d\u6216\u201chttps://\u201d\u5f00\u5934");let n=h;"snsapi_login"==k.$config.oauth.scope&&(n=g);let i={appid:k.$config.appKey,redirect_uri:t,response_type:"code",scope:k.$config.oauth.scope};return e&&(i.state=e),n+"?"+o.stringify(i)+"#wechat_redirect"},T=function(e){return t(function*(){let t=yield b(e);return"snsapi_base"!=k.$config.oauth.scope&&(t=yield w(t)),t}())},b=function(e){return t(function*(){let t={appid:k.$config.appKey,secret:k.$config.appSecret,code:e,grant_type:"authorization_code"},n=m+"?"+o.stringify(t),i=yield k.requestGet(n),s=new y;return s.id=i.openid,s.token=i,s}())},w=function(e){return t(function*(){let t={access_token:e.token.access_token,openid:e.id,lang:"zh_CN"},n=_+"?"+o.stringify(t),i=yield k.requestGet(n);return i.errcode?(console.log("oauth.fetchUserInfo()",i),!1):(e.id=i.openid,e.nickname=i.nickname,e.name=i.nickname,e.avatar=i.headimgurl,e.original=i,e)}())};var P={init:function(e){k=e},redirect:function(e=""){if(!k.$config.oauth)return"";if(!k.$config.oauth.scope)throw new Error("\u672a\u586b\u5199\u6388\u6743scope");if(!k.$config.oauth.redirect)throw new Error("\u672a\u586b\u5199\u6388\u6743\u56de\u8c03\u5730\u5740");let t=k.$config.oauth.redirect;if("http://"!=t.substr(0,7)&&"https://"!=t.substr(0,8))throw new Error("\u8bf7\u586b\u5199\u5b8c\u6574\u7684\u56de\u8c03\u5730\u5740\uff0c\u4ee5\u201chttp://\u201d\u6216\u201chttps://\u201d\u5f00\u5934");let n=h;"snsapi_login"==k.$config.oauth.scope&&(n=g);let i={appid:k.$config.appKey,redirect_uri:t,response_type:"code",scope:k.$config.oauth.scope};return e&&(i.state=e),n+"?"+o.stringify(i)+"#wechat_redirect"},user:function(e){return t(function*(){let t=yield b(e);return"snsapi_base"!=k.$config.oauth.scope&&(t=yield w(t)),t}())}};const v=function(){return parseInt((new Date).getTime()/1e3)},x=function(e=16){let t="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",n="";for(let i=0;i<e;i++)n+=t.charAt(Math.floor(Math.random()*t.length));return n},E=function(e,n){return t(function*(){let t=yield e.access_token.getToken();return n+"?access_token="+t}())};var S={getTimestamp:function(){return parseInt((new Date).getTime()/1e3)},randomString:function(e=16){let t="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",n="";for(let i=0;i<e;i++)n+=t.charAt(Math.floor(Math.random()*t.length));return n},buildApiUrl:function(e,n){return t(function*(){let t=yield e.access_token.getToken();return n+"?access_token="+t}())}};class M{constructor(){this.$datas={}}fetch(e){return this.contains(e)?this.$datas[e].data:null}contains(e,t=0){let n=this.$datas[e];return"object"==typeof n&&!(n.lifeTime>0&&n.lifeTime-t<S.getTimestamp())}save(e,t=null,n=0){let i={data:t,lifeTime:n>0?n+S.getTimestamp():0};this.$datas[e]=i}delete(e){this.$datas[e]=null}}var U;const A=function(e){(U=e).$config.cache=U.$config.cache||new M},j=function(e){e&&"function"==typeof e.fetch&&"function"==typeof e.contains&&"function"==typeof e.save&&"function"==typeof e.delete&&($cache=e)};var C={init:function(e){(U=e).$config.cache=U.$config.cache||new M},CacheDriver:M,setCache:function(e){e&&"function"==typeof e.fetch&&"function"==typeof e.contains&&"function"==typeof e.save&&"function"==typeof e.delete&&($cache=e)}};const I="https://api.weixin.qq.com/cgi-bin/token";var N;const R=function(e){(N=e).$config.access_token=N.$config.access_token||{},N.$config.access_token.cache_id=N.$config.access_token.cache_id||"NODE_EASYWECHAT_ACCESS_TOKEN",N.$config.access_token.buffer_time=N.$config.access_token.buffer_time||60},D=function(){return t(function*(){let e={appid:N.$config.appKey,secret:N.$config.appSecret,grant_type:"client_credential"},t=I+"?"+o.stringify(e);return yield N.requestGet(t)}())},K=function(e=!1){return t(function*(){let t=N.$config.cache.fetch(N.$config.access_token.cache_id);if(e||!N.$config.cache.contains(N.$config.access_token.cache_id,N.$config.access_token.buffer_time)){let e=yield D();G(e.access_token,e.expires_in),t=e.access_token}return t}())},G=function(e,t=7200){N.$config.cache.save(N.$config.access_token.cache_id,e,t)};var O={init:function(e){(N=e).$config.access_token=N.$config.access_token||{},N.$config.access_token.cache_id=N.$config.access_token.cache_id||"NODE_EASYWECHAT_ACCESS_TOKEN",N.$config.access_token.buffer_time=N.$config.access_token.buffer_time||60},getToken:function(e=!1){return t(function*(){let t=N.$config.cache.fetch(N.$config.access_token.cache_id);if(e||!N.$config.cache.contains(N.$config.access_token.cache_id,N.$config.access_token.buffer_time)){let e=yield D();G(e.access_token,e.expires_in),t=e.access_token}return t}())},setToken:G};const Q="https://api.weixin.qq.com/cgi-bin/ticket/getticket";var H;const F=function(e){(H=e).$config.jssdk=H.$config.jssdk||{},H.$config.jssdk.cache_id=H.$config.jssdk.cache_id||"NODE_EASYWECHAT_JSSKD_TICKET",H.$config.jssdk.buffer_time=H.$config.jssdk.buffer_time||60};var L="";const B=function(e){L=e},z=function(){return t(function*(){let e={access_token:yield H.access_token.getToken(),type:"jsapi"},t=Q+"?"+o.stringify(e);return yield H.requestGet(t)}())},J=function(e,n=!1,i=!0){return t(function*(){let t=H.$config.cache.fetch(H.$config.jssdk.cache_id);if(!H.$config.cache.contains(H.$config.jssdk.cache_id,H.$config.jssdk.buffer_time)){let e=yield z();H.$config.cache.save(H.$config.jssdk.cache_id,e.ticket,e.expires_in),t=e.ticket}let s=L,r=S.randomString(),o=S.getTimestamp(),c=V({jsapi_ticket:t,noncestr:r,timestamp:o,url:s}),a={debug:n,appId:H.$config.appKey,timestamp:o,nonceStr:r,signature:c,url:s,jsApiList:e};return L="",i?JSON.stringify(a):a}())},V=function(e){let t="",n="";for(let i in e)t+=n+i+"="+e[i],n="&";return c(t)};var W={init:function(e){(H=e).$config.jssdk=H.$config.jssdk||{},H.$config.jssdk.cache_id=H.$config.jssdk.cache_id||"NODE_EASYWECHAT_JSSKD_TICKET",H.$config.jssdk.buffer_time=H.$config.jssdk.buffer_time||60},setUrl:function(e){L=e},config:function(e,n=!1,i=!0){return t(function*(){let t=H.$config.cache.fetch(H.$config.jssdk.cache_id);if(!H.$config.cache.contains(H.$config.jssdk.cache_id,H.$config.jssdk.buffer_time)){let e=yield z();H.$config.cache.save(H.$config.jssdk.cache_id,e.ticket,e.expires_in),t=e.ticket}let s=L,r=S.randomString(),o=S.getTimestamp(),c=V({jsapi_ticket:t,noncestr:r,timestamp:o,url:s}),a={debug:n,appId:H.$config.appKey,timestamp:o,nonceStr:r,signature:c,url:s,jsApiList:e};return L="",i?JSON.stringify(a):a}())}};class Y{constructor(e){this.dataParams={ToUserName:"",FromUserName:"",CreateTime:S.getTimestamp(),MsgType:""},this.json=null,this.data="","object"==typeof e?this.json=e:this.data=e}setAttribute(e,t){this.dataParams[e]=t}formatData(){return"<xml>"+this._formatData(this.dataParams)+"</xml>"}_formatData(e){if("object"==typeof e){let t="";for(let n in e)t+=`<${n}>${this._formatData(e[n])}</${n}>`;return t}return"string"==typeof e?"<![CDATA["+e+"]]>":e}getData(){return this.json?JSON.stringify(this.json):(this.data||(this.data=this.formatData()),this.data)}}class X extends Y{constructor(e){super(""),this.dataParams.MsgType="text",this.dataParams.Content=e.content||""}content(e){this.dataParams.Content=e}}class Z extends Y{constructor(e){super(""),this.dataParams.MsgType="image",this.dataParams.Image={MediaId:e.media_id||""}}mediaId(e){this.dataParams.Image.MediaId=e}}class ee extends Y{constructor(e){super(""),this.dataParams.MsgType="voice",this.dataParams.Voice={MediaId:e.media_id||""}}mediaId(e){this.dataParams.Voice.MediaId=e}}class te extends Y{constructor(e){super(""),this.dataParams.MsgType="video",this.dataParams.Video={MediaId:e.media_id||"",Title:e.title||"",Description:e.description||""}}mediaId(e){this.dataParams.Video.MediaId=e}title(e){this.dataParams.Video.Title=e}description(e){this.dataParams.Video.Description=e}}class ne extends Y{constructor(e){super(""),this.dataParams.MsgType="music",this.dataParams.Music={MediaId:e.media_id||"",Title:e.title||"",Description:e.description||"",MusicUrl:e.music_url||"",HQMusicUrl:e.hq_music_url||"",ThumbMediaId:e.thumb_media_id||""}}mediaId(e){this.dataParams.Music.MediaId=e}title(e){this.dataParams.Music.Title=e}description(e){this.dataParams.Music.Description=e}musicUrl(e){this.dataParams.Music.MusicUrl=e}hqMusicurl(e){this.dataParams.Music.HQMusicUrl=e}thumbMediaId(e){this.dataParams.Music.ThumbMediaId=e}}class ie extends Y{constructor(e){super(""),this.dataParams.MsgType="news",this.dataParams.ArticleCount=1,this.dataParams.Articles={item:{Title:e.title||"",Description:e.description||"",Url:e.url||"",PicUrl:e.image||""}}}title(e){this.dataParams.Articles.item.Title=e}description(e){this.dataParams.Articles.item.Description=e}url(e){this.dataParams.Articles.item.Url=e}picUrl(e){this.dataParams.Articles.item.PicUrl=e}}var se=Object.freeze({Raw:Y,Text:X,Image:Z,Voice:ee,Video:te,Music:ne,News:ie}),re;const oe=function(e){re=e,ce=function(){}};let ce,ae;const ue=function(e){"function"!=typeof e&&(e=function(){}),ce=e},le=function(){return t(function*(){let e=re.$config.app;if(!e)throw new Error("\u672a\u5728\u914d\u7f6e\u6587\u4ef6\u4e2d\u8bbe\u7f6e\u5e94\u7528\u670d\u52a1\u5668");if("GET"==e.getMethod()){let t=e.getQuery();if(!(t.signature&&t.echostr&&t.timestamp&&t.nonce))return void e.sendResponse("Hello node-easywechat");let n=[t.nonce,t.timestamp,re.$config.token].sort();c(n.join(""))===t.signature?e.sendResponse(t.echostr):e.sendResponse("fail")}else{let t=yield e.getBody();if(ae=yield de(t),ce&&"function"==typeof ce){let t=yield ce(ae);if(!t||"SUCCESS"==t.toUpperCase())return void e.sendResponse("SUCCESS");let n=null;if((n="string"==typeof t?new X({content:t}):t)&&"object"==typeof n){n.setAttribute("ToUserName",ae.FromUserName),n.setAttribute("FromUserName",ae.ToUserName);let t=n.getData();console.log("server.send()",t),e.sendResponse(t)}}}}())},de=function(e){return t(function*(){return new Promise((t,n)=>{a.parseString(e,(e,i)=>{if(e)n(e);else{let e;if(i&&i.xml){e={};for(let t in i.xml)e[t]=i.xml[t][0]}t(e)}})}).catch(e=>{console.log("server.parseMessage()",e)})}())},fe=function(){return ae};var pe={init:function(e){re=e,ce=function(){}},setMessageHandler:function(e){"function"!=typeof e&&(e=function(){}),ce=e},serve:function(){return t(function*(){let e=re.$config.app;if(!e)throw new Error("\u672a\u5728\u914d\u7f6e\u6587\u4ef6\u4e2d\u8bbe\u7f6e\u5e94\u7528\u670d\u52a1\u5668");if("GET"==e.getMethod()){let t=e.getQuery();if(!(t.signature&&t.echostr&&t.timestamp&&t.nonce))return void e.sendResponse("Hello node-easywechat");let n=[t.nonce,t.timestamp,re.$config.token].sort();c(n.join(""))===t.signature?e.sendResponse(t.echostr):e.sendResponse("fail")}else{let t=yield e.getBody();if(ae=yield de(t),ce&&"function"==typeof ce){let t=yield ce(ae);if(!t||"SUCCESS"==t.toUpperCase())return void e.sendResponse("SUCCESS");let n=null;if((n="string"==typeof t?new X({content:t}):t)&&"object"==typeof n){n.setAttribute("ToUserName",ae.FromUserName),n.setAttribute("FromUserName",ae.ToUserName);let t=n.getData();console.log("server.send()",t),e.sendResponse(t)}}}}())},getMessage:function(){return ae}};const he="https://api.weixin.qq.com/cgi-bin/message/template/send",ge="https://api.weixin.qq.com/cgi-bin/template/get_industry",me="https://api.weixin.qq.com/cgi-bin/template/api_set_industry",_e="https://api.weixin.qq.com/cgi-bin/template/api_add_template",ye="https://api.weixin.qq.com/cgi-bin/template/get_all_private_template",ke="https://api.weixin.qq.com/cgi-bin/template/del_private_template";var qe;const $e=function(e){qe=e,be=new Te};class Te{constructor(){this.reset()}}Te.prototype.reset=function(){this.touser="",this.template_id="",this.url="",this.miniprogram={},this.data=[]};let be=null;const we=function(e){return be.touser=e,this},Pe=function(e){return be.template_id=e,this},ve=function(e){return be.url=e,this},xe=function(e){return be.data=Ee(e),this},Ee=function(e){let t={};for(let n in e){let i=e[n];"object"==typeof i?void 0!==i.length?t[n]={value:i[0],color:i[1]}:t[n]=i:t[n]={value:i}}return t},Se=function(e=null){return t(function*(){if(e?e.data&&(e.data=Ee(e.data)):e={},e=n({},be,e),be.reset(),!e.touser)throw new Error("\u7528\u6237openid\u4e3a\u7a7a");if(!e.template_id)throw new Error("\u6a21\u677fid\u4e3a\u7a7a");let t=yield S.buildApiUrl(qe,he);return yield qe.requestPost(t,e)}())},Me=function(){return t(function*(){let e=yield S.buildApiUrl(qe,ge);return yield qe.requestPost(e)}())},Ue=function(e,n){return t(function*(){let t=yield S.buildApiUrl(qe,me),i={industry_id1:e,industry_id2:n};return yield qe.requestPost(t,i)}())},Ae=function(e){return t(function*(){let t=yield S.buildApiUrl(qe,_e),n={template_id_short:e};return yield qe.requestPost(t,n)}())},je=function(){return t(function*(){let e=yield S.buildApiUrl(qe,ye);return yield qe.requestPost(e)}())},Ce=function(e){return t(function*(){let t=yield S.buildApiUrl(qe,ke),n={template_id:e};return yield qe.requestPost(t,n)}())};var Ie={init:function(e){qe=e,be=new Te},to:we,withTo:we,andTo:we,receiver:we,withReceiver:we,andhReceiver:we,uses:Pe,withUses:Pe,andUses:Pe,template:Pe,withTemplate:Pe,andTemplate:Pe,templateId:Pe,withTemplateId:Pe,andTemplateId:Pe,url:ve,withUrl:ve,andUrl:ve,link:ve,withLink:ve,andLink:ve,linkTo:ve,withLinkTo:ve,andLinkTo:ve,data:xe,withData:xe,andData:xe,send:function(e=null){return t(function*(){if(e?e.data&&(e.data=Ee(e.data)):e={},e=n({},be,e),be.reset(),!e.touser)throw new Error("\u7528\u6237openid\u4e3a\u7a7a");if(!e.template_id)throw new Error("\u6a21\u677fid\u4e3a\u7a7a");let t=yield S.buildApiUrl(qe,he);return yield qe.requestPost(t,e)}())},getIndustry:function(){return t(function*(){let e=yield S.buildApiUrl(qe,ge);return yield qe.requestPost(e)}())},setIndustry:function(e,n){return t(function*(){let t=yield S.buildApiUrl(qe,me),i={industry_id1:e,industry_id2:n};return yield qe.requestPost(t,i)}())},addTemplate:function(e){return t(function*(){let t=yield S.buildApiUrl(qe,_e),n={template_id_short:e};return yield qe.requestPost(t,n)}())},getPrivateTemplates:function(){return t(function*(){let e=yield S.buildApiUrl(qe,ye);return yield qe.requestPost(e)}())},deletePrivateTemplate:function(e){return t(function*(){let t=yield S.buildApiUrl(qe,ke),n={template_id:e};return yield qe.requestPost(t,n)}())}};const Ne="https://api.weixin.qq.com/cgi-bin/qrcode/create",Re="https://mp.weixin.qq.com/cgi-bin/showqrcode";var De;const Ke=function(e){De=e},Ge=function(e,n=null){return t(function*(){((n=parseInt(n))<=0||n>604800)&&(n=604800);let t="";"string"==typeof e?(e={scene_str:e},t="QR_STR_SCENE"):(e={scene_id:e},t="QR_SCENE");let i={expire_seconds:n,action_name:t,action_info:{scene:e}},s=yield De.access_token.getToken(),r=Ne+"?access_token="+s;return yield De.requestPost(r,i)}())},Oe=function(e){return t(function*(){let t="";"string"==typeof e?(e={scene_str:e},t="QR_LIMIT_STR_SCENE"):(e={scene_id:e},t="QR_LIMIT_SCENE");let n={action_name:t,action_info:{scene:e}},i=yield De.access_token.getToken(),s=Ne+"?access_token="+i;return yield De.requestPost(s,n)}())},Qe=function(e){return t(function*(){let t=Re+"?ticket="+e;return yield De.requestFile(t)}())};var He={init:function(e){De=e},temporary:function(e,n=null){return t(function*(){((n=parseInt(n))<=0||n>604800)&&(n=604800);let t="";"string"==typeof e?(e={scene_str:e},t="QR_STR_SCENE"):(e={scene_id:e},t="QR_SCENE");let i={expire_seconds:n,action_name:t,action_info:{scene:e}},s=yield De.access_token.getToken(),r=Ne+"?access_token="+s;return yield De.requestPost(r,i)}())},forever:function(e){return t(function*(){let t="";"string"==typeof e?(e={scene_str:e},t="QR_LIMIT_STR_SCENE"):(e={scene_id:e},t="QR_LIMIT_SCENE");let n={action_name:t,action_info:{scene:e}},i=yield De.access_token.getToken(),s=Ne+"?access_token="+i;return yield De.requestPost(s,n)}())},url:function(e){return t(function*(){let t=Re+"?ticket="+e;return yield De.requestFile(t)}())}};const Fe="https://api.weixin.qq.com/cgi-bin/user/info",Le="https://api.weixin.qq.com/cgi-bin/user/info/batchget",Be="https://api.weixin.qq.com/cgi-bin/user/get",ze="https://api.weixin.qq.com/cgi-bin/user/info/updateremark",Je="https://api.weixin.qq.com/cgi-bin/tags/members/getblacklist",Ve="https://api.weixin.qq.com/cgi-bin/tags/members/batchblacklist",We="https://api.weixin.qq.com/cgi-bin/tags/members/batchunblacklist";class Ye{constructor(){this.id="",this.nickname="",this.name="",this.avatar="",this.original={},this.token={}}}var Xe;const Ze=function(e){Xe=e},et=function(e,n="zh_CN"){return t(function*(){let t=yield Xe.access_token.getToken(),i=Fe+"?access_token="+t+"&openid="+e+"&lang="+n,s=yield Xe.requestGet(i),r=new Ye;return r.id=s.openid,r.nickname=s.nickname,r.name=s.nickname,r.avatar=s.headimgurl,r.original=s,r}())},tt=function(e){return t(function*(){let t={user_list:e},n=yield Xe.access_token.getToken(),i=Le+"?access_token="+n;return yield Xe.requestPost(i,t)}())},nt=function(e=null){return t(function*(){let t=yield Xe.access_token.getToken(),n=Be+"?access_token="+t;return e&&(n+="&next_openid="+e),yield Xe.requestGet(n)}())},it=function(e,n){return t(function*(){let e=yield Xe.access_token.getToken(),t=ze+"?access_token="+e;return yield Xe.requestPost(t)}())},st=function(e){return t(function*(){let t={};e&&(t.begin_openid=e);let n=yield Xe.access_token.getToken(),i=Je+"?access_token="+n;return yield Xe.requestPost(i,t)}())},rt=function(e){return t(function*(){let t={openid_list:e},n=yield Xe.access_token.getToken(),i=Ve+"?access_token="+n;return yield Xe.requestPost(i,t)}())},ot=function(e){return t(function*(){let t={openid_list:e},n=yield Xe.access_token.getToken(),i=We+"?access_token="+n;return yield Xe.requestPost(i,t)}())},ct=function(e){return t(function*(){return yield rt([e])}())},at=function(e){return t(function*(){return yield ot([e])}())};var ut={init:function(e){Xe=e},get:function(e,n="zh_CN"){return t(function*(){let t=yield Xe.access_token.getToken(),i=Fe+"?access_token="+t+"&openid="+e+"&lang="+n,s=yield Xe.requestGet(i),r=new Ye;return r.id=s.openid,r.nickname=s.nickname,r.name=s.nickname,r.avatar=s.headimgurl,r.original=s,r}())},batchGet:function(e){return t(function*(){let t={user_list:e},n=yield Xe.access_token.getToken(),i=Le+"?access_token="+n;return yield Xe.requestPost(i,t)}())},lists:function(e=null){return t(function*(){let t=yield Xe.access_token.getToken(),n=Be+"?access_token="+t;return e&&(n+="&next_openid="+e),yield Xe.requestGet(n)}())},remark:function(e,n){return t(function*(){let e=yield Xe.access_token.getToken(),t=ze+"?access_token="+e;return yield Xe.requestPost(t)}())},blacklist:function(e){return t(function*(){let t={};e&&(t.begin_openid=e);let n=yield Xe.access_token.getToken(),i=Je+"?access_token="+n;return yield Xe.requestPost(i,t)}())},batchBlock:rt,batchUnblock:ot,block:function(e){return t(function*(){return yield rt([e])}())},unblock:function(e){return t(function*(){return yield ot([e])}())}};const lt="https://api.weixin.qq.com/cgi-bin/menu/get",dt="https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info",ft="https://api.weixin.qq.com/cgi-bin/menu/create",pt="https://api.weixin.qq.com/cgi-bin/menu/delete";var ht;const gt=function(e){ht=e},mt=function(){return t(function*(){let e=yield ht.access_token.getToken(),t=lt+"?access_token="+e;return yield ht.requestPost(t)}())},_t=function(){return t(function*(){let e=yield ht.access_token.getToken(),t=dt+"?access_token="+e;return yield ht.requestPost(t)}())},yt=function(e){return t(function*(){let t={button:e},n=yield ht.access_token.getToken(),i=ft+"?access_token="+n;return yield ht.requestPost(i,t)}())},kt=function(){return t(function*(){let e=pt+"?access_token="+accessToken;return yield ht.requestPost(e)}())};var qt={init:function(e){ht=e},all:function(){return t(function*(){let e=yield ht.access_token.getToken(),t=lt+"?access_token="+e;return yield ht.requestPost(t)}())},current:function(){return t(function*(){let e=yield ht.access_token.getToken(),t=dt+"?access_token="+e;return yield ht.requestPost(t)}())},add:function(e){return t(function*(){let t={button:e},n=yield ht.access_token.getToken(),i=ft+"?access_token="+n;return yield ht.requestPost(i,t)}())},destroy:function(){return t(function*(){let e=pt+"?access_token="+accessToken;return yield ht.requestPost(e)}())}};p.registPlugin("oauth",P),p.registPlugin("cache",C),p.registPlugin("access_token",O),p.registPlugin("jssdk",W),p.registPlugin("server",pe),p.registPlugin("notice",Ie),p.registPlugin("qrcode",He),p.registPlugin("user",ut),p.registPlugin("menu",qt);for(let e in se)p[e]=se[e];module.exports=p;