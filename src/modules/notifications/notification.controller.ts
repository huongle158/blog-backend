import { Controller, Get, Param } from "@nestjs/common";
import { NotificationService } from "./notification.service";

@Controller('notifications')
export class NotificationController {
    constructor(
        private notificationService: NotificationService
    ) { }
    
    @Get(':userId')
    async getNotifications(@Param('userId') userId: number) {
        const notifications = await this.notificationService.getNotifications(userId);
        return { notifications };
    }
}