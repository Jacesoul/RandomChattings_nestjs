import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index') // 여기 인덱스는 views폴더의 index.hbs를 찾아서 랜더링해준다.
  root() {
    // 가장 처음에 들어올 view를 렌더링할 예정이기 때문에 root로 이름을 짓는다.
    return {
      data: {
        title: 'Chatting',
        copyright: 'jace',
      },
    };
  }
}
