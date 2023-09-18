import {ClassProvider, EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {HotkeysService} from 'angular2-hotkeys';

import {ServerHotkeysService} from '../services';

/**
 * Provides server hotkeys service
 */
export function provideServerHotkeysService(): EnvironmentProviders
{
    return makeEnvironmentProviders(
    [
        <ClassProvider>
        {
            provide: HotkeysService,
            useClass: ServerHotkeysService,
        },
    ]);
}