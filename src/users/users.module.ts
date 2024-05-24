import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../graphql/models/user.model';
import { UserSetting } from '../graphql/models/userSettings.model';
import { UserSettingsResolver } from '../graphql/resolvers/userSettings.resolver';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';
import { UserSettingService } from './userSettings.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSetting])],
  providers: [
    UserResolver,
    UserService,
    UserSettingService,
    UserSettingsResolver,
  ],
})
export class UsersModule {}
