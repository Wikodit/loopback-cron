import {BindingKey} from '@loopback/core';

import {MyCronJob} from './cronJobs/myCronJob';
import {WorkService} from './services';

export namespace WorkServiceBindings {
  export const WORK_SERVICE = BindingKey.create<WorkService>('work.service');
}

export namespace CronJobsBindings {
  export const CRON = BindingKey.create<MyCronJob>('cron.job');
}
