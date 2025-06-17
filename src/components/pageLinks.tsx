/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { RefObject } from "react";
import { Link } from "react-router";

// Define the type for each link item
export type PageLink = {
  label: string;
  ref?: RefObject<HTMLElement | null>;
  to?: string;
};

// Define the props interface for the PageLinks component
export type PageLinksProps = {
  links: PageLink[];
  className?: string;
};

/**
 * Creates an event handler function that scrolls the element
 * referenced by the provided ref into view smoothly.
 *
 * @param ref - The React ref object pointing to the target HTML element.
 * @returns An event handler function.
 */
const createScrollHandler = (ref: RefObject<HTMLElement | null>) => {
  return () => {
    // Use optional chaining to safely access current and scrollIntoView
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "center",
    });
  };
};

/**
 * PageLinks component that displays a list of links for navigating to different sections of a page.
 * Each link scrolls to its corresponding section when clicked.
 */
export default function PageLinks({
  links,
  className = "",
}: Readonly<PageLinksProps>) {
  return (
    <ul
      className={`flex w-auto items-baseline gap-3 divide-x divide-gray-400 px-4 py-2 ${className}`}
    >
      {links.map((link, index) => {
        return (
          <li
            key={link.label}
            className={index < links.length - 1 ? "pr-3" : ""}
          >
            {link.to ? (
              <Link
                to={link.to}
                className="block w-full cursor-pointer font-semibold text-gray-500 decoration-gray-500 hover:underline"
              >
                {link.label}
              </Link>
            ) : link.ref ? (
              <button
                onClick={createScrollHandler(link.ref)}
                onKeyDown={createScrollHandler(link.ref)}
                className="block w-full cursor-pointer font-semibold text-gray-500 decoration-gray-500 hover:underline"
              >
                {link.label}
              </button>
            ) : (
              <span className="block w-full font-semibold text-gray-500">
                {link.label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
