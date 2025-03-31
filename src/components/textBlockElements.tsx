/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/


type projectTextBlockProps = { headerText: string, descriptiveText: string }

/**
 * This is a template for a projectTextBlock. It has a header and a descriptive text.
 * It has a zinc background, with a zoom in on hover. On click/focus actions have yet to be added
 *
 * @param {string} headerText
 * @param {string} descriptiveText
 * @returns {*}
 */
const ProjectTextBlock = ({headerText, descriptiveText}: projectTextBlockProps) =>
    <a className="block max-w-sm p-6 bg-zinc-100
                                    border border-zinc-200 rounded-lg shadow-sm 
                                    hover:bg-zinc-200 hover:scale-110 hover:duration-500
                                    focus:ring-2 focus:ring-blue-700">
        <h5 className="mb-2 text-2xl font-Merriweather tracking-tight text-black">
            {headerText}</h5>
        <p className="font-OpenSans text-zinc-500">
            {descriptiveText}</p>
    </a>

export {ProjectTextBlock}