import { Controller, Get, Inject, Param, Query, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiUseTags,
} from '@nestjs/swagger';
import { InjectRepository } from 'nestjs-mikro-orm';
import { EntityRepository, EntityManager, wrap } from 'mikro-orm';
import { Tagging } from './tagging.entity';
import { Article } from '../article/article.entity';
import { User } from '../user/user.entity';
import { Tag } from '../tag/tag.entity';

@Controller('tagging')
export class TaggingController {

  constructor(
    @InjectRepository(Article) private articleRepository: EntityRepository<Article>,
    @InjectRepository(Tag) private tagRepository: EntityRepository<Tag>,
    @InjectRepository(User) private userRepository: EntityRepository<User>,
    @InjectRepository(Tagging) private taggingRepository: EntityRepository<Tagging>,
    private entityManager: EntityManager){}
    
  @Post('tag')
  async tag(@Query('tag') tagId: number, @Query('user') userId: number, @Query('article') articleId: number, @Query('findArticleFirst') findArticleFirst: boolean = false) {
    await this.taggingRepository.remove({addedBy: userId})
    await this.taggingRepository.flush()

    const tagging = new Tagging()
    wrap(tagging).assign({
      tag: tagId,
      addedBy: userId,
      article: articleId
    }, {em: this.entityManager})
    await this.taggingRepository.persistAndFlush(tagging)

    if (findArticleFirst){
      await this.articleRepository.findOne(articleId)
    }

    const taggings = await this.taggingRepository.find({article: articleId}, {populate: ['article']})
    return {taggings}
  }

  @Post('setup')
  async setup() {
    await this.taggingRepository.createQueryBuilder()
      .delete()
      .execute()

    await this.articleRepository.createQueryBuilder()
      .delete()
      .execute()
    
    await this.tagRepository.createQueryBuilder()
    .delete()
    .execute()

    await this.userRepository.createQueryBuilder()
    .delete()
    .execute()

    //Need to flush as we go or we won't get ids set on our entities
    const user = new User("user", "email", "password")
    this.userRepository.persist(user)

    const article = new Article(user, "Title", "description", "body")
    this.articleRepository.persist(article)

    const tag = new Tag()
    tag.tag = "stuff"
    this.tagRepository.persist(tag)

    await this.entityManager.flush()

    const user2 = await this.userRepository.findOne({username: "user"})
    const userId = (await this.userRepository.findOne({username: "user"})).id
    const articleId = (await this.articleRepository.findOne({title: "Title"})).id
    const tagId = (await this.tagRepository.findOne({tag: "stuff"})).id

    return {userId, articleId, tagId}
  }
}
