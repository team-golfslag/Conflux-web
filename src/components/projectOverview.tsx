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
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(props.title ?? "");
  const [editDescription, setEditDescription] = useState(
    props.description ?? "",
  );

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const titleTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const [editSource, setEditSource] = useState<"title" | "description" | null>(
    null,
  );

  // Effect to determine whether to show expand button
  useEffect(() => {
    if (descriptionRef.current && props.description) {
      const characterCount = props.description.length ?? 0;
      setShouldShowExpandButton(characterCount > 880);
    }
  }, [props.description]);

  // Effect to set edit title and description and to set the displayed description
  useEffect(() => {
    if (!editMode) {
      setEditTitle(props.title ?? "");
      setEditDescription(props.description ?? "");

      // Reset displayed description based on current props and expansion state
      setDescription(
        isExpanded
          ? (props.description ?? "")
          : truncate(props.description, {
              length: 880,
              separator: /,? +/,
            }),
      );
    }
  }, [props.title, props.description, editMode, isExpanded]);

  // Effect to adjust title textarea height
  useEffect(() => {
    if (editMode && titleTextAreaRef.current) {
      const textarea = titleTextAreaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editTitle, editMode]);

  // Effect to adjust description textarea height
  useEffect(() => {
    if (editMode && descriptionTextAreaRef.current) {
      const textarea = descriptionTextAreaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editDescription, editMode]);

  // Effect to handle focusing the appropriate element when entering edit mode
  useEffect(() => {
    if (editMode) {
      if (editSource === "title" && titleTextAreaRef.current) {
        titleTextAreaRef.current.focus();
      } else if (
        editSource === "description" &&
        descriptionTextAreaRef.current
      ) {
        descriptionTextAreaRef.current.focus();
      }
    }
  }, [editMode, editSource]);

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    let newDescription: string;

    if (newExpandedState) {
      newDescription = editMode ? editDescription : (props.description ?? "");
    } else
      newDescription = truncate(
        editMode ? editDescription : (props.description ?? ""),
        {
          length: 880,
          separator: /,? +/,
        },
      );

    setDescription(newDescription);
    setIsExpanded(newExpandedState);
  };

  const handleEditClick = (source: "title" | "description" = "title") => {
    setEditMode(true);
    setEditTitle(props.title ?? "");
    setEditDescription(props.description ?? "");
    setEditSource(source);
  };

  const handleSave = () => {
    props.onSave(editTitle, editDescription);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset displayed description to what it was before entering edit mode (based on props)
    setEditTitle(props.title ?? "");
    setEditDescription(props.description ?? "");
    setDescription(
      isExpanded
        ? (props.description ?? "")
        : truncate(props.description, {
            length: 880,
            separator: /,? +/,
          }),
    );
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <>
      <CardHeader>
        <div className="flex w-full rounded-lg pb-4">
          {!editMode ? (
            <div className="relative">
              <Button
                className="float-end border border-gray-50 bg-gray-50 hover:border-gray-200"
                variant="ghost"
                size="sm"
                onClick={() => handleEditClick()}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <CardTitle
                onClick={() => handleEditClick()}
                className="text-3xl/8 font-bold tracking-tight hover:bg-blue-100 sm:text-4xl/10 md:text-5xl/14"
              >
                {props.title}
              </CardTitle>
            </div>
          ) : (
            <Textarea
              ref={titleTextAreaRef}
              rows={1}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full resize-none overflow-hidden bg-white font-bold md:text-4xl"
              placeholder="Enter project title"
              onKeyDown={handleEditKeyDown}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editMode ? (
          <div className="space-y-4">
            <Textarea
              ref={descriptionTextAreaRef}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="min-h-[200px] w-full resize-none overflow-hidden text-gray-700 md:text-base/7"
              placeholder="Enter project description"
              onKeyDown={handleEditKeyDown}
              rows={10}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleSave}
              >
                <Check size={16} /> Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleCancel}
              >
                <X size={16} /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <button
              className="hover:bg-blue-100"
              onClick={() => handleEditClick("description")}
              onKeyDown={() => handleEditClick("description")}
            >
              <p
                ref={descriptionRef}
                className="text-start text-sm/6 text-gray-700 sm:px-3 sm:text-base/7"
              >
                {description}
              </p>
            </button>
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
