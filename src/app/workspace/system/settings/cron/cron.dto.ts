export interface CronDailyConfig {
  time: string;
}

export interface CronWeeklyDayConfig {
  enabled: boolean;
  time: string;
}

export interface CronWeeklyConfig {
  monday: CronWeeklyDayConfig;
  tuesday: CronWeeklyDayConfig;
  wednesday: CronWeeklyDayConfig;
  thursday: CronWeeklyDayConfig;
  friday: CronWeeklyDayConfig;
  saturday: CronWeeklyDayConfig;
  sunday: CronWeeklyDayConfig;
}

export interface CronMonthlyConfig {
  day: number;
  time: string;
}

export interface CronYearlyConfig {
  month: number;
  day: number;
  time: string;
}

export interface CronScheduleConfig {
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  daily?: CronDailyConfig;
  weekly?: CronWeeklyConfig;
  monthly?: CronMonthlyConfig;
  yearly?: CronYearlyConfig;
}

export interface BaseCronSetting {
  id: string;
  task_code: string;
  name: string;
  dependencia?: string | null;
  is_active: boolean;
  timezone: string;
  schedule_config: CronScheduleConfig;
  created_at?: string;
  updated_at?: string;
  institution_id?: string;
}

export type CreateCronSettingPayload = Omit<BaseCronSetting, 'id' | 'created_at' | 'updated_at' | 'institution_id'>;
export type UpdateCronSettingPayload = Partial<CreateCronSettingPayload>;

export class CronSettingDTO implements BaseCronSetting {
  id!: string;
  task_code!: string;
  name!: string;
  dependencia?: string | null;
  is_active!: boolean;
  timezone!: string;
  schedule_config!: CronScheduleConfig;
  created_at?: string;
  updated_at?: string;
  institution_id?: string;

  constructor(data?: Partial<BaseCronSetting>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toPayload(): CreateCronSettingPayload {
    const { id, created_at, updated_at, institution_id, ...payload } = this;
    return payload;
  }
}
