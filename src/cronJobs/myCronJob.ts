import {inject} from '@loopback/core';
import {CronJob, cronJob} from '@loopback/cron';

import {WorkServiceBindings} from '../keys';
import {WorkService} from '../services';

export {MyCronJob};

@cronJob()
class MyCronJob extends CronJob {
  constructor(
    @inject(WorkServiceBindings.WORK_SERVICE)
    public workService: WorkService,
  ) {
    super({
      cronTime: '*/5 * * * * *', // Every one second
      name: 'getExchangesPrice',
      onTick: () => {
        // do the work
        this.workService.serviceFunction();
      },
      start: true,
    });
  }
}
