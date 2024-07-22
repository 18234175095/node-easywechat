'use strict';

import ServerRequestInterface from '../Core/Http/Contracts/ServerRequestInterface';
import Encryptor from '../Core/Encryptor';
import ServerInterface from '../Core/Contracts/ServerInterface';
import Response from '../Core/Http/Response';
import Message from './Message';
import { ServerEventType, ServerHandlerClosure, ServerMessageType } from '../Types/global';

class Server extends ServerInterface
{
  constructor(
    protected encryptor: Encryptor,
    protected request: ServerRequestInterface = null,
  ) {
    super();
  }

  /**
   * 服务端消息处理
   * @returns
   */
  async serve(): Promise<Response> {
    let query = this.request.getQueryParams();
    if (!!query['echostr']) {
      let echostr = this.encryptor.decrypt(
        query['echostr'],
        query['msg_signature'] ?? '',
        query['nonce'] ?? '',
        query['timestamp'] ?? ''
      );
      return new Response(200, { 'Content-Type': 'text/html' }, echostr);
    }

    let message = await this.getRequestMessage(this.request);

    if (this.encryptor && query['msg_signature']) {
      this.prepend(this.decryptRequestMessage(query));
    }

    let response = await this.handle(new Response(200, {}, 'SUCCESS'), message);

    if (!(response instanceof Response)) {
      response = await this.transformToReply(response, message, this.encryptor)
    }

    return response;
  }

  /**
   * 设置联系人变化的消息处理器
   * @param handler
   */
  handleContactChanged(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.Event === 'change_contact' ? handler(message, next) : next(message);
    });
  }

  /**
   * 设置用户标签变化的消息处理器
   * @param handler
   */
  handleUserTagUpdated(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.Event === 'change_contact' && message.ChangeType === 'update_tag' ? handler(message, next) : next(message);
    });
  }

  /**
   * 设置用户创建的消息处理器
   * @param handler
   */
  handleUserCreated(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.Event === 'change_contact' && message.ChangeType === 'create_user' ? handler(message, next) : next(message);
    });
  }

  /**
   * 设置用户更新的消息处理器
   * @param handler
   */
  handleUserUpdated(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.Event === 'change_contact' && message.ChangeType === 'update_user' ? handler(message, next) : next(message);
    });
  }

  /**
   * 设置用户删除的消息处理器
   * @param handler
   */
  handleUserDeleted(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.Event === 'change_contact' && message.ChangeType === 'delete_user' ? handler(message, next) : next(message);
    });
  }

  /**
   * 设置部门创建的消息处理器
   * @param handler
   */
  handlePartyCreated(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.Event === 'change_contact' && message.ChangeType === 'create_party' ? handler(message, next) : next(message);
    });
  }

  /**
   * 设置部门更新的消息处理器
   * @param handler
   */
  handlePartyUpdated(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.Event === 'change_contact' && message.ChangeType === 'update_party' ? handler(message, next) : next(message);
    });
  }

  /**
   * 设置部门删除的消息处理器
   * @param handler
   */
  handlePartyDeleted(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.Event === 'change_contact' && message.ChangeType === 'delete_party' ? handler(message, next) : next(message);
    });
  }

  /**
   * 设置异步任务完成的消息处理器
   * @param handler
   */
  handleBatchJobsFinished(handler: ServerHandlerClosure): this {
    return this.with(async function (message: Message, next: ServerHandlerClosure) {
      return message.Event === 'batch_job_result' ? handler(message, next) : next(message);
    });
  }

  /**
   * 添加普通消息处理器
   * @param type
   * @param handler
   * @returns
   */
  addMessageListener(type: ServerMessageType, handler: ServerHandlerClosure): this {
    return this.withHandler(async function (message: Message, next: ServerHandlerClosure) {
      return message.MsgType === type ? handler(message, next) : next(message);
    })
  }

  /**
   * 添加事件消息处理器
   * @param event
   * @param handler
   * @returns
   */
  addEventListener(event: ServerEventType, handler: ServerHandlerClosure): this {
    return this.withHandler(async function (message: Message, next: ServerHandlerClosure) {
      return message.Event === event ? handler(message, next) : next(message);
    })
  }

  /**
   * 获取来自微信服务器的推送消息
   * @param request 未设置该参数时，则从当前服务端收到的请求中获取
   * @returns
   */
  getRequestMessage(request: ServerRequestInterface = null): Promise<Message> {
    return Message.createFromRequest(request ?? this.request);
  }

  protected validateUrl() {
    return async (message: Message, next: ServerHandlerClosure) => {
      let query = this.request.getQueryParams();
      if (!this.encryptor) return null;
      let echostr = this.encryptor.decrypt(
        query['echostr'],
        query['msg_signature'] ?? '',
        query['timestamp'] ?? '',
        query['nonce'] ?? ''
      );

      return new Response(200, { 'Content-Type': 'text/html' }, echostr);
    };
  }

  protected decryptRequestMessage(query: Record<string, any>): ServerHandlerClosure {
    return async (message: Message, next: ServerHandlerClosure) => {
      message = await this.decryptMessage(
        message,
        this.encryptor,
        query['msg_signature'] ?? '',
        query['timestamp'] ?? '',
        query['nonce'] ?? ''
      );

      return next(message);
    };
  }

  /**
   * 获取解密后的消息
   * @param request 未设置该参数时，则从当前服务端收到的请求中获取
   * @returns
   */
  async getDecryptedMessage(request: ServerRequestInterface = null) {
    request = request ?? this.request;
    let message = await this.getRequestMessage(request);
    let query = request.getQueryParams();

    if (!this.encryptor || !query['msg_signature']) {
      return message;
    }

    return await this.decryptMessage(
      message,
      this.encryptor,
      query['msg_signature'] ?? '',
      query['timestamp'] ?? '',
      query['nonce'] ?? ''
    );
  }

};

interface Server {
  with(next: ServerHandlerClosure<Message>): this;
  withHandler(next: ServerHandlerClosure<Message>): this;
  prepend(next: ServerHandlerClosure<Message>): this;
  prependHandler(next: ServerHandlerClosure<Message>): this;
  without(next: ServerHandlerClosure<Message>): this;
  withoutHandler(next: ServerHandlerClosure<Message>): this;
}

export = Server;
