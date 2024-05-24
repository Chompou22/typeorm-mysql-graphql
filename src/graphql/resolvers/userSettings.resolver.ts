import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSettingService } from '../../users/userSettings.service';
import { UserSetting } from '../models/userSettings.model';
import { CreateUserSettingsInput } from '../types/CreateUserSettingsInput';

@Resolver()
export class UserSettingsResolver {
  constructor(private userSettingsService: UserSettingService) {}

  @Mutation((returns) => UserSetting)
  async createUserSettings(
    @Args('createUserSettingsData')
    createUserSettingsData: CreateUserSettingsInput,
  ) {
    const userSetting = await this.userSettingsService.createUserSettings(
      createUserSettingsData,
    );
    return userSetting;
  }
}
