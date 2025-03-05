

/**
 * This is a template for a projectTextBlock. It has a header and a descriptive text. 
 * It has a zinc background, with a zoom in on hover. On click/focus actions have yet to be added
 *
 * @param {String} headerText 
 * @param {String} descriptiveText 
 * @returns {*} 
 */
const projectTextBlock = (headerText : String, descriptiveText : String) => 
                    <a className="block max-w-sm p-6 bg-zinc-100 
                                    border border-zinc-200 rounded-lg shadow-sm 
                                    hover:bg-zinc-200 hover:scale-110 hover:duration-500
                                    focus:ring-2 focus:ring-blue-700">
                        <h5 className="mb-2 text-2xl font-Merriweather tracking-tight text-black">
                       {headerText}</h5>
                        <p className="font-OpenSans text-zinc-500">
                       {descriptiveText}</p>
                    </a>

export {projectTextBlock}