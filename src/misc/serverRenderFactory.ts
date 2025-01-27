import {StaticProvider, FactoryProvider, Injector, Provider, EnvironmentProviders} from '@angular/core';
import {BEFORE_APP_SERIALIZED} from '@angular/platform-server';
import {StatusCodeService} from '@anglr/common';
import fs from 'fs';

/**
 * Providers for server side rendered app
 */
export interface ServerRenderProviders
{
    /**
     * Additional platform providers
     */
    platformProviders?: StaticProvider[];

    /**
     * Additional app providers
     */
    appProviders?: (Provider|EnvironmentProviders)[];
}

/**
 * Interface describing options for server render
 */
export interface ServerRenderOptions extends ServerRenderProviders
{
    /**
     * Html document that should be rendered
     */
    document?: string;

    /**
     * Url that is being rendered
     */
    url?: string;
}

/**
 * This holds a cached version of each index used.
 */
const templateCache: {[key: string]: string} = {};

/**
 * Get the document at the file path
 */
function getDocument(filePath: string): string
{
    return templateCache[filePath] = templateCache[filePath] || fs.readFileSync(filePath).toString();
}

/**
 * Returns function used for rendering app on server
 * @param getRenderPromise - Callback used for promise for rendered app into string
 * @param getProvidersCallback - Callback called when trying to build server providers
 */
export function serverRenderFactory<TAdditionalData>(getRenderPromise: (options: ServerRenderOptions) => Promise<string>,
                                                     getProvidersCallback?: (additionalData: TAdditionalData) => ServerRenderProviders): (index: string, url: string, additionalData: TAdditionalData, callback: (error: string|null, result?: {html: string, statusCode?: number|null|undefined}) => void) => void
{
    /**
     * Renders application
     */
    return function serverRender(indexPath: string, url: string, additionalData: TAdditionalData, callback: (error: string|null, result?: {html: string, statusCode?: number|null|undefined}) => void): void
    {
        let statusCode: number|null|undefined = null;

        try
        {
            const appProviders: (Provider|EnvironmentProviders)[] =
            [
                <FactoryProvider>
                {
                    provide: BEFORE_APP_SERIALIZED,
                    useFactory: (injector: Injector) =>
                    {
                        return () =>
                        {
                            const statusCodeService = injector.get(StatusCodeService);

                            if(statusCodeService)
                            {
                                statusCode = statusCodeService.statusCode;
                            }
                        };
                    },
                    deps: [Injector],
                    multi: true
                }
            ];

            const additionalProviders = getProvidersCallback?.(additionalData) ??
            {
                appProviders: [],
                platformProviders: [],
            };

            additionalProviders.appProviders?.push(...appProviders);

            getRenderPromise({
                                 document: getDocument(indexPath),
                                 url,
                                 appProviders: additionalProviders.appProviders,
                                 platformProviders: additionalProviders.platformProviders,
                             })
                .catch(rejection =>
                {
                    callback(rejection);
                })
                .then((html: string|void) =>
                {
                    callback(null,
                             {
                                 html: html ?? '',
                                 statusCode: statusCode,
                             });
                });
        }
        catch (e)
        {
            callback(`${e}`);
        }
    };
}
