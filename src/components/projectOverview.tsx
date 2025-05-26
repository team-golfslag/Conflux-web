/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Edit, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Textarea } from "@/components/ui/textarea";
import {
  useEditableText,
  useTruncatableText,
} from "@/hooks/useEditableContent";
import { ApiMutation } from "@/components/apiMutation";
import { ApiClient } from "@team-golfslag/conflux-api-client/src/client";

type ProjectOverviewProps = {
  projectId: string;
  title?: string;
  description?: string;
  isAdmin: boolean;
  onProjectUpdate: () => void;
};

/**
 * Project Overview component
 * @param props projectId, title and description to be displayed, and refresh callback
 */
export default function ProjectOverview({
  title,
  description,
  isAdmin,
  onProjectUpdate,
}: Readonly<ProjectOverviewProps>) {
  // Title editing
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [updateTitleSubmit, setUpdateTitleSubmit] = useState<
    (() => void) | null
  >(null);

  const {
    editedText: editTitle,
    handleTextChange: handleTitleChange,
    handleCancel: handleTitleCancel,
    handleKeyDown: handleTitleKeyDown,
  } = useEditableText(title ?? "", title ?? "", editTitleMode, () => {
    // This will be called when saving via the hook's handlers
    if (updateTitleSubmit) updateTitleSubmit();
  });

  // Description editing
  const [editDescriptionMode, setEditDescriptionMode] = useState(false);
  const [updateDescriptionSubmit, setUpdateDescriptionSubmit] = useState<
    (() => void) | null
  >(null);

  // Stable callback functions to prevent infinite re-renders
  const handleTitleInitialize = useCallback((submitFn: () => void) => {
    setUpdateTitleSubmit(() => submitFn);
  }, []);

  const handleDescriptionInitialize = useCallback((submitFn: () => void) => {
    setUpdateDescriptionSubmit(() => submitFn);
  }, []);

  const {
    editedText: editDescription,
    handleTextChange: handleDescriptionChange,
    handleCancel: handleDescriptionCancel,
    handleKeyDown: handleDescriptionKeyDown,
  } = useEditableText(
    description ?? "",
    description ?? "",
    editDescriptionMode,
    () => {
      // This will be called when saving via the hook's handlers
      if (updateDescriptionSubmit) updateDescriptionSubmit();
    },
  );

  // Description truncation
  const descriptionTruncateLength = 800;
  const { isExpanded, shouldShowExpandButton, toggleExpand } =
    useTruncatableText(description ?? "", descriptionTruncateLength);

  // Refs for textarea auto-resize
  const titleTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);

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

  // API mutation handlers for title
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateProjectTitle = async (_apiClient: ApiClient) => {
    // TODO: update project title
  };

  // API mutation handlers for description
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateProjectDescription = async (_apiClient: ApiClient) => {
    // TODO: update project description
  };

  return (
    <>
      <CardHeader>
        <div className="flex w-full rounded-lg">
          {!editTitleMode || !isAdmin ? (
            <div className="relative flex w-full">
              <CardTitle className="w-full text-3xl/8 font-bold tracking-tight sm:text-4xl/10 md:text-5xl/14">
                {title}
              </CardTitle>
              {isAdmin && (
                <Button
                  className="invisible float-end group-hover/cardHeader:visible"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditTitleMode(true)}
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          ) : (
            <div className="flex w-full flex-col">
              <Textarea
                ref={titleTextAreaRef}
                rows={1}
                value={editTitle}
                autoFocus
                onChange={handleTitleChange}
                className="w-full resize-none overflow-hidden bg-white font-bold tracking-tight sm:text-4xl/10 md:text-5xl/14"
                placeholder="Enter project title"
                onKeyDown={handleTitleKeyDown}
              />
              <div className="flex justify-end gap-2 pt-2">
                <ApiMutation
                  mutationFn={updateProjectTitle}
                  data={{}}
                  loadingMessage="Saving title..."
                  mode="component"
                  onInitialize={handleTitleInitialize}
                  onSuccess={() => {
                    setEditTitleMode(false);
                    onProjectUpdate();
                  }}
                >
                  {({ onSubmit, isLoading }) => {
                    return (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={onSubmit}
                        disabled={isLoading}
                      >
                        <Check size={16} /> Save
                      </Button>
                    );
                  }}
                </ApiMutation>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => {
                    handleTitleCancel();
                    setEditTitleMode(false);
                  }}
                >
                  <X size={16} /> Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="group">
        {editDescriptionMode && isAdmin ? (
          <div className="space-y-4">
            <h3 className="pt-1 font-semibold text-gray-700 sm:px-3">
              Primary description
            </h3>
            <Textarea
              ref={descriptionTextAreaRef}
              value={editDescription}
              autoFocus
              onChange={handleDescriptionChange}
              className="min-h-[200px] w-full resize-none overflow-hidden text-sm/6 text-gray-700 md:text-base/7"
              placeholder="Enter project description"
              rows={10}
              onKeyDown={handleDescriptionKeyDown}
            />
            <div className="flex justify-end gap-2">
              <ApiMutation
                mutationFn={updateProjectDescription}
                data={{}}
                loadingMessage="Saving description..."
                mode="component"
                onInitialize={handleDescriptionInitialize}
                onSuccess={() => {
                  setEditDescriptionMode(false);
                  onProjectUpdate();
                }}
              >
                {({ onSubmit, isLoading }) => {
                  return (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={onSubmit}
                      disabled={isLoading}
                    >
                      <Check size={16} /> Save
                    </Button>
                  );
                }}
              </ApiMutation>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  handleDescriptionCancel();
                  setEditDescriptionMode(false);
                }}
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
              {isAdmin && (
                <Button
                  className="invisible float-end group-hover:visible"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditDescriptionMode(true)}
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
            <p className="text-start text-sm/6 text-gray-700 sm:px-3 sm:text-base/7">
              {isExpanded
                ? description
                : description && description.length > descriptionTruncateLength
                  ? description.substring(0, descriptionTruncateLength) + "..."
                  : description}
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
