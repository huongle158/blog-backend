import { NotificationEntity } from './notification.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlesService } from '../article/article.service';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly articlesService: ArticlesService,
    private readonly userService: UserService,
  ) {}

  async createNotification(
    slug: string,
    userId: number,
    message: string,
  ): Promise<NotificationEntity> {
    const user = await this.userService.findById(userId);
    const article = await this.articlesService.findBySlug(slug);

    const notification = {
      user: user,
      article: article,
      message: user.fullname + message + article.title,
    };
    return await this.notificationRepository.save(notification);
  }

  async getNotifications(userId: number): Promise<NotificationEntity[]> {
    const notifications = await this.notificationRepository.find({
      where: { article: { author: { id: userId } } },
      relations: ['user', 'article'],
      order: { createdAt: 'DESC' },
    });
    return notifications;
  }
}
