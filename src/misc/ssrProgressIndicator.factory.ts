/**
 * Factory method that creates method which appends loading progress indicator into html
 * @param document - Html document that will have loading indicator inserted into
 */
export function ssrProgressIndicatorFactory(document: HTMLDocument)
{
    return () =>
    {
        let div = document.createElement('div');
        let innerDiv = document.createElement('div');

        div.id = "ssrloadingindicator";
        div.className = "loading-indicator";
        div.appendChild(innerDiv);
        document.body.appendChild(div);
    }
}