import {Hotkey, HotkeysService} from 'angular2-hotkeys';

/**
 * Server hotkeys service
 */
export class ServerHotkeysService extends HotkeysService
{
    /**
     * @inheritdoc
     */
    public override add(): Hotkey|Hotkey[]
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public override remove(): Hotkey|Hotkey[]
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public override get(): Hotkey|Hotkey[]
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public override pause(): Hotkey|Hotkey[]
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public override unpause(): Hotkey|Hotkey[]
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public override reset(): void
    {
    }
}