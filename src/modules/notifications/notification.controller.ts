import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/guards/auth.guard';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get(':userId')
  @UseGuards(AuthGuard)
  async getNotifications(@Param('userId') userId: number) {
    const notifications = await this.notificationService.getNotifications(
      userId,
    );
    return { notifications };
  }
}
