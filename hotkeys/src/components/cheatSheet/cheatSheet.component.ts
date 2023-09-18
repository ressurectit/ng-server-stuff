import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, PLATFORM_ID, inject} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';

/**
 * Component used for displaying current active hotkeys as cheat cheet
 */
@Component(
{
    selector: 'hotkeys-cheatsheet',
    templateUrl: 'cheatSheet.component.html',
    styleUrls: ['cheatSheet.component.css'],
    imports:
    [
        CommonModule,
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotkeysCheatsheetSAComponent implements OnInit, OnDestroy 
{
    //######################### private fields #########################

    /**
     * Indication whether is running in browser
     */
    private _isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

    //######################### public properties #########################

    public helpVisible$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public subscription: Subscription|undefined|null;
    public hotkeys: Hotkey[]|undefined|null;

    //######################### public properties - inputs #########################

    /**
     * Title displayed in header of cheat sheet
     */
    @Input() 
    public title: string = 'Keyboard Shortcuts:';

    //######################### constructor #########################
    constructor(private _hotkeysService: HotkeysService) 
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit(): void 
    {
        if(!this._isBrowser)
        {
            return;
        }

        this.subscription = this._hotkeysService.cheatSheetToggle.subscribe((isOpen) => 
        {
            if (isOpen !== false) 
            {
                this.hotkeys = this._hotkeysService.hotkeys.filter(hotkey => hotkey.description);
            }

            if (isOpen === false) 
            {
                this.helpVisible$.next(false);
            }
            else
            {
                this.toggleCheatSheet();
            }
        });
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void 
    {
        if (this.subscription) 
        {
            this.subscription.unsubscribe();
        }
    }

    //######################### public methods #########################

    /**
     * Toggles cheatsheet visibility
     */
    public toggleCheatSheet(): void 
    {
        this.helpVisible$.next(!this.helpVisible$.value);
    }
}