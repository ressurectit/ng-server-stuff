import {CommonModule} from '@angular/common';
import {Http, XHRBackend, RequestOptions} from '@angular/http';
import {NgModule, FactoryProvider, ModuleWithProviders, Provider} from '@angular/core';
import {HttpInterceptor, InterceptableHttp, HTTP_INTERCEPTORS} from '@anglr/http-extensions';
import {ZoneMacroTaskBackend} from '@angular/platform-server/src/http';

/**
 * Factory method that is used for creating InterceptableHttp for server
 */
export function httpFactory(interceptors: HttpInterceptor[], backend: XHRBackend, defaultOptions: RequestOptions)
{
    const macroBackend = new ZoneMacroTaskBackend(backend);
    
    return new InterceptableHttp(interceptors, macroBackend, defaultOptions);
}

/**
 * InterceptableHttp module for server side
 */
@NgModule(
{
    imports: [CommonModule]
})
export class ServerInterceptableHttpModule
{
    //######################### public methods #########################

    /**
     * Returns module with HttpInterceptor providers and custom Http provider that supports InterceptableHttp for server side
     */
    public static forRoot(): ModuleWithProviders
    {
        return {
            ngModule: ServerInterceptableHttpModule,
            providers:
            [
                <FactoryProvider>
                {
                    provide: Http,
                    useFactory: httpFactory,
                    deps: [HTTP_INTERCEPTORS, XHRBackend, RequestOptions]
                }
            ]
        };
    }
}