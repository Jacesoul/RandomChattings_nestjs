import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsGateway } from './chats/chats.gateway';
import { ChatsModule } from './chats/chats.module';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // isGlobal이라는 옵션을 주게되면 다른 모듈에서 config모듈을 가져올 필요가 없다.
    }),
    // 몽구스를 연결하는 것은 첫번재 인자에 두고 두번재 인자에는 셋팅을 해야한다. (기본적으로 mongoDB와 node.js를 연결할때 셋팅할것을 두번째 인자에 넣는다.)
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParse: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // 몽고디비에서 인덱싱을 하겠다는 의미
      useFindAndModify: false,
    }),
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatsGateway],
})
export class AppModule implements NestModule {
  // 몽고디비 디버깅
  configure() {
    const DEBUG = process.env.MODE === 'dev' ? true : false;
    mongoose.set('debug', DEBUG);
    // 몽고디비가 연결이 되었는지와 쿼리를 체크할수 있다.
  }
}
