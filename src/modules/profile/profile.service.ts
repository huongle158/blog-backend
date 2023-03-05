import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { DataSource, DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { FollowEntity } from './follow.entity';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: profileUsername },
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    //  Người đang follow user này
    const listFollowerCheck = await this.followRepository.find({
      where: { followingId: user.id },
    });
    const userIds = listFollowerCheck.map((follow) => follow.followerId);
    const followerUsers = await this.userRepository
      .createQueryBuilder('user')
      .whereInIds(userIds)
      .getMany();

    //   List Người này follow
    const listFollowingCheck = await this.followRepository.find({
      where: { followerId: user.id },
    });
    const followingIds = listFollowingCheck.map((follow) => follow.followingId);
    const followingUsers = await this.userRepository
      .createQueryBuilder('user')
      .whereInIds(followingIds)
      .getMany();
    return {
      ...user,
      following: Boolean(follow),
      listFollower: followerUsers,
      listFollowing: followingUsers,
    };
  }

  async followProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: {
        username: profileUsername,
      },
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    //   Ng follow va following ko dc trung
    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and Following can be the same',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });
    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }

    return { ...user, following: true };
  }

  async unfollowProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: {
        username: profileUsername,
      },
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    //   Ng follow va following ko dc trung
    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and Following can be equal',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id,
    });

    return { ...user, following: false };
  }

  buildProfileesponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }
}
