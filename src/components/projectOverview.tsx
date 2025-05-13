/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Edit, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { truncate } from "lodash";
import { Textarea } from "@/components/ui/textarea";

type ProjectOverviewProps = {
  title?: string;
  description?: string;
  onSaveTitle: (title: string) => void;
  onSaveDescription: (description: string) => void;
};

/**
 * Project Overview component
 * @param props title and description to be displayed, and onSave callback
 */
export default function ProjectOverview(props: Readonly<ProjectOverviewProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = useState(false);
  const descriptionTruncateLength = 800;
  const [description, setDescription] = useState<string | undefined>(
    truncate(props.description, {
      length: descriptionTruncateLength,
      separator: /,? +/,
    }),
  );
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [editDescriptionMode, setEditDescriptionMode] = useState(false);
  const [editTitle, setEditTitle] = useState(props.title ?? "");
  const [editDescription, setEditDescription] = useState(
    props.description ?? "",
  );

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const titleTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // Effect to determine whether to show expand button
  useEffect(() => {
    if (descriptionRef.current && props.description) {
      const characterCount = props.description.length ?? 0;
      setShouldShowExpandButton(characterCount > descriptionTruncateLength);
    }
  }, [props.description]);

  // Effect to set edit title
  useEffect(() => {
    if (!editTitleMode) {
      setEditTitle(props.title ?? "");
    }
  }, [props.title, editTitleMode]);

  // Effect to set edit description and to set the displayed description
  useEffect(() => {
    if (!editDescriptionMode) {
      setEditDescription(props.description ?? "");

      // Reset displayed description based on current props and expansion state
      setDescription(
        isExpanded
          ? (props.description ?? "")
          : truncate(props.description, {
              length: descriptionTruncateLength,
              separator: /,? +/,
            }),
      );
    }
  }, [props.description, editDescriptionMode, isExpanded]);

  // Effect to adjust title textarea height
  useEffect(() => {
    if (editTitleMode && titleTextAreaRef.current) {
      const textarea = titleTextAreaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editTitle, editTitleMode]);

  // Effect to adjust description textarea height
  useEffect(() => {
    if (editDescriptionMode && descriptionTextAreaRef.current) {
      const textarea = descriptionTextAreaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editDescription, editDescriptionMode]);

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    let newDescription: string;

    if (newExpandedState) {
      newDescription = editDescriptionMode
        ? editDescription
        : (props.description ?? "");
    } else
      newDescription = truncate(
        editDescriptionMode ? editDescription : (props.description ?? ""),
        {
          length: descriptionTruncateLength,
          separator: /,? +/,
        },
      );

    setDescription(newDescription);
    setIsExpanded(newExpandedState);
  };

  const handleEditTitleClick = () => {
    setEditTitleMode(true);
    setEditTitle(props.title ?? "");
  };

  const handleEditDescriptionClick = () => {
    setEditDescriptionMode(true);
    setEditDescription(props.description ?? "");
  };

  const handleSaveTitle = () => {
    props.onSaveTitle(editTitle);
    setEditTitleMode(false);
  };

  const handleSaveDescription = () => {
    props.onSaveDescription(editDescription);
    setEditDescriptionMode(false);
  };

  const handleCancelTitle = () => {
    setEditTitleMode(false);
  };

  const handleCancelDescription = () => {
    setEditDescriptionMode(false);
    // Reset displayed description to what it was before entering edit mode (based on props)
    setEditDescription(props.description ?? "");
    setDescription(
      isExpanded
        ? (props.description ?? "")
        : truncate(props.description, {
            length: descriptionTruncateLength,
            separator: /,? +/,
          }),
    );
  };

  const handleEditTitleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveTitle();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancelTitle();
    }
  };

  const handleEditDescriptionKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancelDescription();
    }
  };

  return (
    <>
      <CardHeader>
        <div className="flex w-full rounded-lg">
          {!editTitleMode ? (
            <div className="relative flex w-full">
              <CardTitle className="w-full text-3xl/8 font-bold tracking-tight sm:text-4xl/10 md:text-5xl/14">
                {props.title}
              </CardTitle>
              <Button
                className="invisible float-end group-hover/cardHeader:visible"
                variant="outline"
                size="sm"
                onClick={() => handleEditTitleClick()}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
            </div>
          ) : (
            <div className="flex w-full flex-col">
              <Textarea
                ref={titleTextAreaRef}
                rows={1}
                value={editTitle}
                autoFocus
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full resize-none overflow-hidden bg-white font-bold tracking-tight sm:text-4xl/10 md:text-5xl/14"
                placeholder="Enter project title"
                onKeyDown={handleEditTitleKeyDown}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleSaveTitle}
                >
                  <Check size={16} /> Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleCancelTitle}
                >
                  <X size={16} /> Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="group">
        {editDescriptionMode ? (
          <div className="space-y-4">
            <h3 className="pt-1 font-semibold text-gray-700 sm:px-3">
              Primary description
            </h3>
            <Textarea
              ref={descriptionTextAreaRef}
              value={editDescription}
              autoFocus
              onChange={(e) => setEditDescription(e.target.value)}
              className="min-h-[200px] w-full resize-none overflow-hidden text-sm/6 text-gray-700 md:text-base/7"
              placeholder="Enter project description"
              rows={10}
              onKeyDown={handleEditDescriptionKeyDown}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleSaveDescription}
              >
                <Check size={16} /> Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleCancelDescription}
              >
                <X size={16} /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-semibold text-gray-700 sm:px-3">
                Primary description
              </h3>
              <Button
                className="invisible float-end group-hover/cardContent:visible"
                variant="outline"
                size="sm"
                onClick={() => handleEditDescriptionClick()}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
            </div>
            <p
              ref={descriptionRef}
              className="text-start text-sm/6 text-gray-700 sm:px-3 sm:text-base/7"
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
            {isExpanded && shouldShowExpandButton && (
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
        )}
      </CardContent>
    </>
  );
}
