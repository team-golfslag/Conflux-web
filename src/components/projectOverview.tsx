/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Edit, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";

type ProjectOverviewProps = { title?: string; description?: string };

/**
 * Project Overview component
 * @param props the description to be displayed
 */
export default function ProjectOverview(props: Readonly<ProjectOverviewProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Check if the description is long enough to need expansion
  useEffect(() => {
    if (descriptionRef.current && props.description) {
      // Create a clone of the description element to measure its height
      const clone = descriptionRef.current.cloneNode(true) as HTMLElement;
      // Remove the line clamp so we can measure the full height
      clone.classList.remove("line-clamp-10");
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.height = "auto";
      document.body.appendChild(clone);

      // Get the line height in pixels
      const computedStyle = window.getComputedStyle(descriptionRef.current);
      const lineHeight =
        parseFloat(computedStyle.lineHeight) ||
        1.5 * parseFloat(computedStyle.fontSize);

      // Calculate how many lines the text would take
      const fullHeight = clone.offsetHeight;
      const lineCount = Math.round(fullHeight / lineHeight);

      // Clean up the clone
      document.body.removeChild(clone);

      // Show expand button if there are more than 10 lines
      setShouldShowExpandButton(lineCount > 10);
    }
  }, [props.description]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <CardHeader>
        {/* Title */}
        <div className="flex items-baseline rounded-lg pb-4">
          <CardTitle className="text-5xl/14 font-bold tracking-tight">
            {props.title}
          </CardTitle>
          <div className="flex items-center justify-center rounded-lg p-2 transition-colors duration-100 hover:bg-gray-500">
            <Edit size={20} color="white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <p
            ref={descriptionRef}
            className={`px-3 leading-7 text-gray-700 ${isExpanded ? "" : "line-clamp-10"}`}
          >
            {props.description}
          </p>

          {shouldShowExpandButton && !isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 flex items-center justify-center text-gray-600 hover:text-gray-800"
              onClick={toggleExpand}
            >
              <span>Show more</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          )}

          {isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 flex items-center justify-center text-gray-600 hover:text-gray-800"
              onClick={toggleExpand}
            >
              <span>Show less</span>
              <ChevronUp className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );
}
