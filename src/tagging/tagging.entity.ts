import { Entity, IdEntity, PrimaryKey, Property, ManyToOne, OneToMany } from 'mikro-orm';
import { Tag } from '../tag/tag.entity';
import { User } from '../user/user.entity';
import { Article } from '../article/article.entity';

@Entity()
export class Tagging implements IdEntity<Tagging> {

  @PrimaryKey()
  id: number;

  @ManyToOne(()=>Tag)
  tag: Tag;

  @ManyToOne(()=>User)
  addedBy: User;

  @ManyToOne(()=>Article)
  article: Article;

}
