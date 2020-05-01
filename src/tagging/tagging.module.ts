import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TaggingController } from './tagging.controller';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import { Tagging } from './tagging.entity';
import { Tag } from '../tag/tag.entity';
import { Article } from '../article/article.entity';
import { User } from '../user/user.entity';

@Module({
  controllers: [
    TaggingController,
  ],
  exports: [],
  imports: [MikroOrmModule.forFeature({ entities: [Tagging, Tag, Article, User] }), UserModule],
})
export class TaggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
