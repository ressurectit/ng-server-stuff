/**
 * Factory method that creates method which appends loading progress indicator into html
 * @param document - Html document that will have loading indicator inserted into
 */
export function ssrProgressIndicatorFactory(document: Document)
{
    return () =>
    {
        const div = document.createElement('div');
        const innerDiv = document.createElement('div');

        div.id = 'ssrloadingindicator';
        div.className = 'loading-indicator';
        div.appendChild(innerDiv);
        document.body.appendChild(div);
    };
}