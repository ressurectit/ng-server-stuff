import {NgModuleRef, ApplicationRef, ValueProvider, RendererFactory2, ViewEncapsulation, StaticProvider} from "@angular/core";
import {INITIAL_CONFIG, PlatformState} from "@angular/platform-server";
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
 * @param getModuleRef Callback used for obtaining bootstrapped ngModuleRef
 * @param getProvidersCallback Callback called when trying to build server providers
 * @param progressLoader Indication whether render progress loader when module is loaded
 * @param extraProviders Extra providers used within mainModule
 */
export function serverRenderFactory<TAdditionalData>(getModuleRef: (extraProviders: StaticProvider[]) => Promise<NgModuleRef<{}>>, getProvidersCallback?: (additionalData: TAdditionalData) => StaticProvider[], progressLoader?: boolean, extraProviders?: StaticProvider[]): (index: string, url: string, additionalData: TAdditionalData, callback: (error: string, result?: {html: string, statusCode?: number}) => void) => void
{
    extraProviders = extraProviders || [];
    progressLoader = progressLoader || false;
    getProvidersCallback = getProvidersCallback || (() => []);

    /**
     * Renders application
     */
    return function serverRender(indexPath: string, url: string, additionalData: TAdditionalData, callback: (error: string, result?: {html: string, statusCode?: number}) => void): void
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

            const moduleRefPromise = getModuleRef(extraProviders);

            Utils.common.runWhenModuleStable(moduleRefPromise, (moduleRef: NgModuleRef<{}>) =>
            {
                const bootstrap = (moduleRef.instance as any)['ngOnBootstrap'];
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