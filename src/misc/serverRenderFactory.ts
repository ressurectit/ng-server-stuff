import {StaticProvider, FactoryProvider, Injector} from "@angular/core";
import {BEFORE_APP_SERIALIZED} from "@angular/platform-server";
import {StatusCodeService} from '@anglr/common';
import * as fs from 'fs';

/**
 * Interface describing options for server render
 */
export interface ServerRenderOptions
{
    /**
     * Html document that should be rendered
     */
    document?: string;

    /**
     * Url that is being rendered
     */
    url?: string;

    /**
     * Extra providers
     */
    extraProviders?: StaticProvider[];
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
 * @param extraProviders - Extra providers used within mainModule
 */
export function serverRenderFactory<TAdditionalData>(getRenderPromise: (options: ServerRenderOptions) => Promise<string>,
                                                     getProvidersCallback?: (additionalData: TAdditionalData) => StaticProvider[],
                                                     extraProviders?: StaticProvider[]): (index: string, url: string, additionalData: TAdditionalData, callback: (error: string|null, result?: {html: string, statusCode?: number|null|undefined}) => void) => void
{
    extraProviders = extraProviders || [];
    getProvidersCallback = getProvidersCallback || (() => []);

    /**
     * Renders application
     */
    return function serverRender(indexPath: string, url: string, additionalData: TAdditionalData, callback: (error: string|null, result?: {html: string, statusCode?: number|null|undefined}) => void): void
    {
        let statusCode: number|null|undefined = null;

        try
        {
            extraProviders = extraProviders!
                .concat(
                [
                    <FactoryProvider>
                    {
                        provide: BEFORE_APP_SERIALIZED,
                        useFactory: (injector: Injector) =>
                        {
                            return () =>
                            {
                                let statusCodeService = injector.get(StatusCodeService);
                                
                                if(statusCodeService)
                                {
                                    statusCode = statusCodeService.statusCode;
                                }
                            };
                        },
                        deps: [Injector],
                        multi: true
                    }
                ])
                .concat(getProvidersCallback!(additionalData));

            getRenderPromise({
                                 document: getDocument(indexPath),
                                 url,
                                 extraProviders
                             })
                .catch(rejection =>
                {
                    callback(rejection);
                })
                .then((html: string) =>
                {
                    callback(null,
                             {
                                 html: html,
                                 statusCode: statusCode
                             });
                });
        }
        catch (e)
        {
            callback(e);
        }
    }
}