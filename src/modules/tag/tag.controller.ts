import { CreateTagDto } from './dto/createTag.dto';
import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { TagService } from '@app/modules/tag/tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createTag(@Body('tag') createTagDto: CreateTagDto) {
    const newTag = await this.tagService.createTag(createTagDto);
    return this.tagService.buildtagResponse(newTag);
  }

  @Delete(':name')
  async deleteTag(@Param('name') name: string) {
    return await this.tagService.deleteTag(name);
  }
}
