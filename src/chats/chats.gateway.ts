import { Socket as SocketModel } from './models/sockets.model';
import { Chatting } from './models/chattings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Model } from 'mongoose';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // OnGatewayInit는 인터페이스인데 해당 클래스에서 반드시 구현해야하는 규약 또는 사양서이다.
  private logger = new Logger();

  constructor(
    // chatting, socket모델을 사용해서 데이터베이스를 핸들링 할수 있도록 의존성 주입을 해준다.
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {
    this.logger.log('constructor'); // constructor가 afterInit 보다 먼저 실행된다.
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`); // nsp는 namespace의 약자이다.
  } // 클라이언트와 connection이 되자마자 실행되는 함수이다.

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.delete();
    }
    this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name}`);
  }

  afterInit() {
    this.logger.log('init'); // 이 gateway가 실행이 될때 가장먼저 실행이 되는 함수
  }

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const exist = await this.socketModel.exists({ username }); // socket모델안에 exist라는 메서드가 있는데 이 메서드는 해당하는 필드에서 이미 있는지 없는지를 true/false로 제공을 해준다.
    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    } else {
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    }
    // username db에 저장
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.socketModel.findOne({ id: socket.id });
    await this.chattingModel.create({
      user: socketObj,
      chat: chat,
    });

    socket.broadcast.emit('new_chat', {
      chat,
      username: socketObj.username,
    });
  }
}
