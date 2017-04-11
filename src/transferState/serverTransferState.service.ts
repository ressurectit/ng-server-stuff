import {Injectable, RendererFactory2, ViewEncapsulation} from '@angular/core';
import {TransferStateService, TRANSFER_STATE_NAME} from '@anglr/rest';
import {PlatformState} from '@angular/platform-server';

@Injectable()
export class ServerTransferStateService extends TransferStateService
{
    //######################### constructors #########################
    constructor(private state: PlatformState, 
                private rendererFactory: RendererFactory2)
    {
        super();
    }

    //######################### public methods #########################
    /**
     * Inject the State into the bottom of the <head>
     */
    public inject()
    {
        try
        {
            const document: any = this.state.getDocument();

            let transferStateString;

            try
            {
                transferStateString = JSON.stringify(this.toJson());
            }
            catch(e)
            {
                console.warn(`WARNING: '${e.message}' trasfer data will not be used!`);
                transferStateString = "";
            }

            const renderer = this.rendererFactory.createRenderer(document,
            {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });

            let tag = document.children[0];

            if(tag.type == 'directive')
            {
                tag = document.children[1];
            }

            if(tag.type == 'tag' && tag.name == 'html')
            {
                tag = tag.children[0];
            }

            const head = tag;

            if (head.name !== 'head')
            {
                throw new Error('Please have <head> as the first element in your document');
            }

            const script = renderer.createElement('script');
            renderer.setValue(script, `window['${TRANSFER_STATE_NAME}'] = ${transferStateString}`);
            renderer.appendChild(head, script);
        }
        catch (e)
        {
            console.error(e);
        }
    }
}