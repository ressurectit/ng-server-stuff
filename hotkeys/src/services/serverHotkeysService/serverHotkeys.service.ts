import {Hotkey} from 'angular2-hotkeys';
import {Subject} from 'rxjs';

/**
 * Server hotkeys service
 */
export class ServerHotkeysService
{
    public hotkeys: Hotkey[] = [];
    public pausedHotkeys: Hotkey[] = [];
    public cheatSheetToggle: Subject<unknown> = new Subject();

    /**
     * @inheritdoc
     */
    public add(): Hotkey|Hotkey[]
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public remove(): Hotkey|Hotkey[]
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public get(): Hotkey|Hotkey[]
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public pause(): Hotkey|Hotkey[]
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public unpause(): Hotkey|Hotkey[]
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public reset(): void
    {
    }
}
