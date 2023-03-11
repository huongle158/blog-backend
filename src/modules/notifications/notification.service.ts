import { ArticleEntity } from '@app/modules/article/article.entity';
import { NotificationEntity } from './notification.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepository: Repository<NotificationEntity>,
    ) { }
    
    async createNotification(
        article: ArticleEntity,
        user: UserEntity,
        message: string,
    ): Promise<NotificationEntity> {
        const notification = {
            author: article.author,
            article: article,
            message: user.fullname + message + article.title,
        }
        return await this.notificationRepository.save(notification)
    }

    async getNotifications(userId: number): Promise<NotificationEntity[]> {
        const notifications = await this.notificationRepository.find({
            where: { author: { id: userId } },
            relations: ['author', 'article'],
            order: { createdAt: 'DESC' },
        });
        return notifications;
    }
}