import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { Chatting, ChattingSchema } from './models/chattings.model';
import { Socket as SocketModel, SocketSchema } from './models/sockets.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
      { name: SocketModel.name, schema: SocketSchema }, // Socket이라고 하지 않고 SocketModel이라고 한 이유는 socket.io와 헷가릴수 있어서이다.
    ]),
  ],
  providers: [ChatsGateway],
})
export class ChatsModule {}
