import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateTagDto } from './dto/createTag.dto';
import { TagEntity } from './tag.entity';
import { TagResponseInterface } from './types/tagResponse.interface';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }

  async createTag(createTagDto: CreateTagDto): Promise<TagEntity> {
    const tagByName = await this.tagRepository.findOne({
      where: { name: createTagDto.name },
    });
    if (tagByName) {
      throw new HttpException(
        'Tag name are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newTag = new TagEntity();
    Object.assign(newTag, createTagDto);
    return await this.tagRepository.save(newTag);
  }

  async deleteTag(name: string): Promise<DeleteResult> {
    const tag = await this.tagRepository.findOne({
      where: { name: name },
    });
    if (!tag) {
      throw new HttpException('Tag name does not exist', HttpStatus.NOT_FOUND);
    }
    return await this.tagRepository.delete({ name });
  }

  buildtagResponse(tag: TagEntity): TagResponseInterface {
    return {
      tag,
    };
  }
}
