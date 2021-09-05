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
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // OnGatewayInit는 인터페이스인데 해당 클래스에서 반드시 구현해야하는 규약 또는 사양서이다.
  private logger = new Logger();

  constructor() {
    this.logger.log('constructor'); // constructor가 afterInit 보다 먼저 실행된다.
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`); // nsp는 namespace의 약자이다.
  } // 클라이언트와 connection이 되자마자 실행되는 함수이다.

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name}`);
  }

  afterInit() {
    this.logger.log('init'); // 이 gateway가 실행이 될때 가장먼저 실행이 되는 함수
  }

  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket.id); // n_Fq4nb3ifaYIz_HAAAD, jace | Yo6GSJD9wwJgnZw3AAAF, good
    console.log(username);
    socket.emit('hello_user', 'hello' + username);
    return 'hello World'; // return을 해주면 클라이언트 쪽 'new_user'로 emit한 곳의 data로 전달된다.
  }
}
