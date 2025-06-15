/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { RefObject } from "react";

// Define the type for each link item
export type PageLink = {
  label: string;
  ref: RefObject<HTMLElement | null>;
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
        const scrollHandler = createScrollHandler(link.ref);

        return (
          <li
            key={link.label}
            className={index < links.length - 1 ? "pr-3" : ""}
          >
            <button
              onClick={scrollHandler}
              onKeyDown={scrollHandler}
              className="block w-full cursor-pointer font-semibold text-gray-500 decoration-gray-500 hover:underline"
            >
              {link.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
