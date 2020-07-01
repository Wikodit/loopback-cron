import path from 'path';

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingKey} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {RepositoryMixin, SchemaMigrationOptions} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';

import {MyCronJob} from './cronJobs/myCronJob';
import {CronJobsBindings, WorkServiceBindings} from './keys';
import {MySequence} from './sequence';
import {WorkService} from './services';

export {ApplicationConfig};

const pkg: PackageInfo = require('../package.json');

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

export class LoopbackCronApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(CronComponent);

    this.setUpBindings();

    // If I comment th elione below it is not working
    this.get(CronJobsBindings.CRON).catch(() => {});

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  async migrateSchema(options?: SchemaMigrationOptions): Promise<void> {
    await super.migrateSchema(options);
    await this.start();
    await this.stop();
  }

  setUpBindings(): void {
    // Bind package.json to the application context
    this.bind(PackageKey).to(pkg);
    this.bind(WorkServiceBindings.WORK_SERVICE).toClass(WorkService);
    this.bind(CronJobsBindings.CRON).toClass(MyCronJob);
  }
}
