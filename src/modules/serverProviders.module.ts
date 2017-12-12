import {NgModule, ModuleWithProviders} from '@angular/core';

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
            ]
        };
    }

}