import {NgModule, ValueProvider} from '@angular/core';
import {HotkeysService} from 'angular2-hotkeys';

/**
 * Hotkeys module for server side rendering
 */
@NgModule(
{
    providers:
    [
        <ValueProvider>
        {
            provide: HotkeysService,
            useValue: {}
        }
    ]
})
export class ServerHotkeysModule
{
}