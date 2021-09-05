import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // join 메서드에서 __dirname은 현재 폴더의 이름을 의미하고 .. 은 상위폴더를 의미
  app.useStaticAssets(join(__dirname, '..', 'public')); // 자바스크립트, CSS파일을 서빙해주는 역할
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // 템플릿 엔진을 어느 폴더에 넣을것인지
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
