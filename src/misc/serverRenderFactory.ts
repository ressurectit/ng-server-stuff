import { Provider, NgModuleRef, ApplicationRef, ValueProvider, RendererFactory2, ViewEncapsulation } from "@angular/core";
import {renderModule, renderModuleFactory, INITIAL_CONFIG, platformServer, platformDynamicServer, PlatformState} from "@angular/platform-server";
import {Utils, StatusCodeService} from '@anglr/common';
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
export function serverRenderFactory<TAdditionalData>(aot: boolean, mainModule: any, getProvidersCallback?: (additionalData: TAdditionalData) => Provider[], progressLoader?: boolean, extraProviders?: Provider[]): (index: string, url: string, additionalData: TAdditionalData, callback: (error: string, result?: {html: string, statusCode?: number}) => void) => void
{
    extraProviders = extraProviders || [];
    progressLoader = progressLoader || false;
    getProvidersCallback = getProvidersCallback || ((additionalData: TAdditionalData) => []);

    /**
     * Renders application
     */
    return function serverRender(indexPath: string, url: string, additionalData: TAdditionalData, callback: (error: string, result?: {html: string, statusCode?: number}) => void)
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

                if(progressLoader)
                {
                    let mainComponent = (moduleRef.injector.get(ApplicationRef) as ApplicationRef).components[0];
                    let factory = moduleRef.injector.get(RendererFactory2) as RendererFactory2;
                    let renderer = factory.createRenderer(mainComponent.location.nativeElement, 
                    {
                        id: 'loaderRenderer',
                        encapsulation: ViewEncapsulation.None,
                        styles: [],
                        data: {}
                    });

                    let div = renderer.createElement("div");
                    let innerDiv = renderer.createElement("div");
                    renderer.addClass(div, "loading-indicator");
                    renderer.appendChild(div, innerDiv);
                    renderer.appendChild(mainComponent.location.nativeElement, div);
                }

                let statusCodeService = moduleRef.injector.get(StatusCodeService);
                let statusCode: number | null = null;

                if(statusCodeService)
                {
                    statusCode = statusCodeService.statusCode;
                }

                callback(null, {html: moduleRef.injector.get(PlatformState).renderToString(), statusCode});
                moduleRef.destroy();
            });
        } 
        catch (e) 
        {
            callback(e);
        }
    }
}