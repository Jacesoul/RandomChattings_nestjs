import { IsNotEmpty, IsString } from 'class-validator';
import { SchemaOptions, Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Socket as SocketModel } from './sockets.model';

const options: SchemaOptions = {
  id: false, // 보통 몽구스에서 id를 만들때 _id라는 이름의로 ObjectId타입으로 unique한 키를 자동으로 만들어준다. 만약 그냥 id:true라고 설정을 한다면 _id와 id가 같도록 만들어진다. 그렇지만 id에 socket의 id를 넣을것이기 때문에 false라고 설정
  collection: 'chattings', // 콜렉션의 이름 설정
  timestamps: true, // created_at과 updated_at을 자동으로 찍어줌
};

@Schema(options)
export class Chatting extends Document {
  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'sockets' }, // ref: 'sockets'는 sockets.model의 스키마이다. Types.ObjectId는 Socket모델에서 자동으로 생성되는 _id이다.
      id: { type: String },
      username: { type: String, required: true },
    },
  })
  @IsNotEmpty()
  user: SocketModel;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  chat: string;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);
