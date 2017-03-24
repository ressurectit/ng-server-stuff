import {Provider, NgModuleRef, ApplicationRef, ValueProvider} from "@angular/core";
import {renderModule, renderModuleFactory, INITIAL_CONFIG, platformServer, platformDynamicServer, PlatformState} from "@angular/platform-server";
import {Utils} from '@anglr/common';
import * as fs from 'fs';

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
 * @param aot Indication that it is aot build
 * @param mainModule Main module to be bootstrapped
 * @param getProvidersCallback Callback called when trying to build server providers
 * @param progressLoader Indication whether render progress loader when module is loaded
 * @param extraProviders Extra providers used within mainModule
 */
export function serverRenderFactory<TAdditionalData>(aot: boolean, mainModule: any, getProvidersCallback?: (additionalData: TAdditionalData) => Provider[], angularProfiler?: boolean, extraProviders?: Provider[]): (index: string, url: string, additionalData: TAdditionalData, callback: (error: string, result?: string) => void) => void
{
    extraProviders = extraProviders || [];
    angularProfiler = angularProfiler || false;
    getProvidersCallback = getProvidersCallback || ((additionalData: TAdditionalData) => []);

    /**
     * Renders application
     */
    return function serverRender(indexPath: string, url: string, additionalData: TAdditionalData, callback: (error: string, result?: string) => void)
    {
        try 
        {
            extraProviders = extraProviders.concat(
            [
                <ValueProvider>
                {
                    provide: INITIAL_CONFIG,
                    useValue: 
                    {
                        document: getDocument(indexPath),
                        url: url
                    }
                }
            ]).concat(getProvidersCallback(additionalData));

            const moduleRefPromise = aot ? platformServer(extraProviders).bootstrapModuleFactory(mainModule) : platformDynamicServer(extraProviders).bootstrapModule(mainModule);

            Utils.common.runWhenModuleStable(moduleRefPromise, (moduleRef: NgModuleRef<{}>) => 
            {
                const bootstrap = moduleRef.instance['ngOnBootstrap'];
                bootstrap && bootstrap();

                callback(null, moduleRef.injector.get(PlatformState).renderToString());
                moduleRef.destroy();
            });
        } 
        catch (e) 
        {
            callback(e);
        }
    }
}