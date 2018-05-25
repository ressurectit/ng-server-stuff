import {NgModule, ModuleWithProviders, FactoryProvider} from '@angular/core';
import {BEFORE_APP_SERIALIZED} from '@angular/platform-server';
import {DOCUMENT} from '@angular/common';

import {ssrProgressIndicatorFactory} from '../misc/ssrProgressIndicator.factory';

/**
 * Module containing all standard server providers
 */
@NgModule(
{
    imports: [],
    providers: []
})
export class ServerProvidersModule
{
    //######################### public methods #########################
    
    /**
     * Returns module with all server providers
     */
    public static forRoot(): ModuleWithProviders 
    {
        return {
            ngModule: ServerProvidersModule,
            providers: 
            [
                <FactoryProvider>
                {
                    provide: BEFORE_APP_SERIALIZED,
                    useFactory: ssrProgressIndicatorFactory,
                    deps: [DOCUMENT],
                    multi: true
                }
            ]
        };
    }
}