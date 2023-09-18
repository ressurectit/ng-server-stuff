import {inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';

/**
 * Factory method that creates method which appends loading progress indicator into html
 */
export function ssrProgressIndicatorFactory(): () => void
{
    const document: Document = inject(DOCUMENT);

    return (): void =>
    {
        const div = document.createElement('div');
        const innerDiv = document.createElement('div');

        div.id = 'ssrloadingindicator';
        div.className = 'loading-indicator';
        div.appendChild(innerDiv);
        document.body.appendChild(div);
    };
}