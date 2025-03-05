/**
 * This is the type definition for a base onClickAction: something which does not expect any parameter inputs and has no return value.
 * This means that the given function should only have side-effects, such as linking to another page.
 * @typedef {clickAction}
 */
type clickAction = () => void


/**
 * This is the primairy button to be used in our application.
 *
 * @param {clickAction} onClickAction 
 * @param {String} displayText 
 * @returns {*} 
 */
const primaryButton = (displayText : String, onClickAction : clickAction = () => null) => 
                        <button className="text-zinc-50 bg-zinc-600 hover:bg-zinc-900
                                           focus:ring-2 focus:ring-blue-900 font-semibold rounded text-sm px-3 py-1 me-2 mb-2 
                                           focus:outline-none" 
                                onClick={onClickAction}>
                                {displayText}
                        </button>


/**
 * This is the secondairy button which also has a blue colour.
 *
 * @param {clickAction} onClickAction 
 * @param {String} displayText 
 * @returns {*} 
 */
const secondaryButton = (displayText : String, onClickAction : clickAction = () => null,) => 
                            <button className="inline-flex items-center px-5 py-2.5 text-sm 
                                            font-medium text-center text-white 
                                            bg-blue-700 rounded-lg 
                                            hover:bg-blue-800 
                                            focus:ring-4 focus:outline-none focus:ring-blue-300"
                                    onClick={onClickAction}>
                                    {displayText}
                            </button>


export {primaryButton, secondaryButton}