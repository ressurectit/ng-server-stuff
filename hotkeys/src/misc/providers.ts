import {ClassProvider, EnvironmentProviders, ValueProvider, makeEnvironmentProviders} from '@angular/core';
import {HotkeyOptions, HotkeysService, IHotkeyOptions} from 'angular2-hotkeys';

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
        <ValueProvider>
        {
            provide: HotkeyOptions,
            useValue: <IHotkeyOptions>
            {
            }
        }
    ]);
}