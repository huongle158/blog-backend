import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { join } from 'path';
import { unlink } from 'fs';
import { promisify } from 'util';

@Injectable()
export class CommentService {}
