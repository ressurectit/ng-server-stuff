import {EnvironmentProviders, FactoryProvider, makeEnvironmentProviders} from '@angular/core';
import {BEFORE_APP_SERIALIZED} from '@angular/platform-server';

import {ssrProgressIndicatorFactory} from './ssrProgressIndicator.factory';

/**
 * Provides Server side progress indicator
 */
export function provideSsrProgressIndicator(): EnvironmentProviders
{
    return makeEnvironmentProviders(
    [
        <FactoryProvider>
        {
            provide: BEFORE_APP_SERIALIZED,
            useFactory: ssrProgressIndicatorFactory,
            multi: true,
        },
    ]);
}
