/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Edit, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { truncate } from "lodash";

type ProjectOverviewProps = {
  title?: string;
  description?: string;
  onSave: (title: string, description: string) => void;
};

/**
 * Project Overview component
 * @param props title and description to be displayed, and onSave callback
 */
export default function ProjectOverview(props: Readonly<ProjectOverviewProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = useState(false);
  const [description, setDescription] = useState<string | undefined>(
    truncate(props.description, {
      length: 880,
      separator: /,? +/,
    }),
  );
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Check if the description is long enough to need expansion
  useEffect(() => {
    if (descriptionRef.current && props.description) {
      const characterCount = props.description.length ?? 0;

      setShouldShowExpandButton(characterCount > 880);
    }
  }, [props.description]);

  const toggleExpand = () => {

  const handleSave = () => {
    props.onSave(editTitle, editDescription);
    setEditMode(false);
  };
    setDescription(
      !isExpanded
        ? (props.description ?? "")
        : truncate(props.description, {
            length: 880,
            separator: /,? +/,
          }),
    );
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <CardHeader>
        {/* Title */}
        <div className="flex items-baseline rounded-lg pb-4">
          <CardTitle className="text-3xl/8 font-bold tracking-tight sm:text-4xl/10 md:text-5xl/14">
            {props.title}
          </CardTitle>
          <div className="flex items-center justify-center rounded-lg p-2 transition-colors duration-100 hover:bg-gray-500">
            <Edit size={20} color="black" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <p
            ref={descriptionRef}
            className={`text-sm/6 text-gray-700 sm:px-3 sm:text-base/7`}
          >
            {description}
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
