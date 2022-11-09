'use strict';

import ServerRequestInterface from '../Core/Http/Contracts/ServerRequestInterface';
import Encryptor from '../Core/Encryptor';
import ServerInterface from '../Core/Contracts/ServerInterface';
import Response from '../Core/Http/Response';
import Message from './Message';
import { ServerHandlerClosure } from '../Types/global';

class Server extends ServerInterface
{
  protected defaultVerifyTicketHandler: ServerHandlerClosure = null;

  constructor(
    protected encryptor: Encryptor,
    protected request: ServerRequestInterface = null
  ) {
    super();
  }

  /**
   * 服务端消息处理
   * @returns
   */
  async serve(): Promise<Response> {
    let echostr: string = this.request.getQueryParams()['echostr'] || '';
    if (!!echostr) {
      return new Response(200, { 'Content-Type': 'text/html' }, echostr);
    }

    let message = await this.getRequestMessage(this.request);
    this.prepend(this.decryptRequestMessage());

    let response = await this.handle(new Response(200, {}, 'success'), message);

    if (!(response instanceof Response)) {
      response = await this.transformToReply(response, message, this.encryptor)
    }

    return response;
  }

  /**
   * 处理授权成功通知
   * @param handler
   * @returns
   */
  handleAuthorized(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.InfoType === 'authorized' ? handler(message, next) : next(message);
    })
  }

  /**
   * 处理取消授权通知
   * @param handler
   * @returns
   */
  handleUnauthorized(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.InfoType === 'unauthorized' ? handler(message, next) : next(message);
    })
  }

  /**
   * 处理授权更新通知
   * @param handler
   * @returns
   */
  handleAuthorizeUpdated(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.InfoType === 'updateauthorized' ? handler(message, next) : next(message);
    })
  }

  /**
   * 设置默认的验证票据通知处理回调
   * @param handler
   * @returns
   */
  withDefaultVerifyTicketHandler(handler: ServerHandlerClosure) {
    this.defaultVerifyTicketHandler = () => {
      return handler.call(this, arguments);
    };
    this.handleVerifyTicketRefreshed(this.defaultVerifyTicketHandler);
  }

  /**
   * 处理验证票据通知
   * @param handler
   * @returns
   */
  handleVerifyTicketRefreshed(handler: ServerHandlerClosure): this {
    if (this.defaultVerifyTicketHandler) {
      this.withoutHandler(this.defaultVerifyTicketHandler);
    }

    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.InfoType === 'component_verify_ticket' ? handler(message, next) : next(message);
    })
  }

  protected decryptRequestMessage(): ServerHandlerClosure {
    let query = this.request.getQueryParams();
    return async (message: Message, next: ServerHandlerClosure) => {
      await this.decryptMessage(
        message,
        this.encryptor,
        query['msg_signature'] || '',
        query['timestamp'] || '',
        query['nonce'] || ''
      );

      return next(message);
    };
  }

  /**
   * 获取来自微信服务器的推送消息
   * @param request 未设置该参数时，则从当前服务端收到的请求中获取
   * @returns
   */
  getRequestMessage(request: ServerRequestInterface = null): Promise<Message> {
    return Message.createFromRequest(request || this.request);
  }

  /**
   * 获取来自微信服务器的推送消息（解密后）
   * @param request 未设置该参数时，则从当前服务端收到的请求中获取
   * @returns
   */
  async getDecryptedMessage(request: ServerRequestInterface = null): Promise<Message> {
    if (!request) request = this.request;
    let message = await Message.createFromRequest(request);
    let query = request.getQueryParams();

    return this.decryptMessage(
      message,
      this.encryptor,
      query['msg_signature'] || '',
      query['timestamp'] || '',
      query['nonce'] || ''
    );
  }

};

export = Server;
