/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  Edit,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useEditableText,
  useTruncatableText,
} from "@/hooks/useEditableContent";
import { ApiMutation } from "@/components/apiMutation";
import {
  ApiClient,
  DescriptionType,
  Language,
  ProjectDescriptionRequestDTO,
  ProjectDescriptionResponseDTO,
  ProjectTitleRequestDTO,
  ProjectTitleResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type ProjectOverviewProps = {
  projectId: string;
  title?: ProjectTitleResponseDTO;
  descriptions?: ProjectDescriptionResponseDTO[];
  isAdmin?: boolean;
  onProjectUpdate: () => void;
};

/**
 * Project Overview component
 * @param props projectId, title and descriptions to be displayed, and refresh callback
 */
export default function ProjectOverview({
  projectId,
  title,
  descriptions = [],
  isAdmin = false,
  onProjectUpdate,
}: Readonly<ProjectOverviewProps>) {
  // State for selected description type and language
  const [selectedDescriptionType, setSelectedDescriptionType] =
    useState<DescriptionType>(DescriptionType.Primary);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("default");

  // State for creating new description types
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newDescriptionType, setNewDescriptionType] = useState<DescriptionType>(
    DescriptionType.Primary,
  );
  const [newLanguage, setNewLanguage] = useState<string>("default");

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Helper function to find description by type and language
  const findDescription = (type: DescriptionType, language?: string) => {
    return descriptions.find(
      (desc) =>
        desc.type === type &&
        (desc.language?.id || "default") === (language || "default"),
    );
  };

  // Get available description types that don't exist yet for the selected language
  const availableNewTypes = Object.values(DescriptionType).filter((type) => {
    return !descriptions.some(
      (desc) =>
        desc.type === type &&
        (desc.language?.id || "default") === (newLanguage || "default"),
    );
  });

  // Get current description based on selected type and language
  const currentDescription =
    findDescription(selectedDescriptionType, selectedLanguage)?.text || "";

  // Get available languages for the selected description type
  const availableLanguagesForType = descriptions
    .filter((desc) => desc.type === selectedDescriptionType)
    .map((desc) => desc.language?.id || "default")
    .filter((lang, index, arr) => arr.indexOf(lang) === index); // Remove duplicates

  // Effect to update selected language when changing description type
  useEffect(() => {
    const languagesForType = descriptions
      .filter((desc) => desc.type === selectedDescriptionType)
      .map((desc) => desc.language?.id || "default");

    if (
      languagesForType.length > 0 &&
      !languagesForType.includes(selectedLanguage || "default")
    ) {
      setSelectedLanguage(languagesForType[0]);
    }
  }, [selectedDescriptionType, descriptions, selectedLanguage]);

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
  } = useEditableText(
    title?.text ?? "",
    title?.text ?? "",
    editTitleMode,
    () => {
      // This will be called when saving via the hook's handlers
      if (updateTitleSubmit) updateTitleSubmit();
    },
  );

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
    currentDescription ?? "",
    currentDescription ?? "",
    editDescriptionMode,
    () => {
      // This will be called when saving via the hook's handlers
      if (updateDescriptionSubmit) updateDescriptionSubmit();
    },
  );

  // Description truncation
  const descriptionTruncateLength = 800;
  const { isExpanded, shouldShowExpandButton, toggleExpand } =
    useTruncatableText(currentDescription ?? "", descriptionTruncateLength);

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
  const updateProjectTitle = async (apiClient: ApiClient) => {
    if (!title) {
      throw new Error("No title available to update");
    }
    await apiClient.projectTitles_UpdateTitle(
      projectId,
      title.id,
      new ProjectTitleRequestDTO({
        type: title.type,
        text: editTitle,
      }),
    );
  };

  // API mutation handlers for description
  const updateProjectDescription = async (
    apiClient: ApiClient,
    descriptionData: {
      type: DescriptionType;
      language: string;
      text: string;
    },
  ) => {
    const { type, language, text } = descriptionData;
    // Find the description to update
    const description = findDescription(type, language);
    if (!description) {
      throw new Error(
        `Description type ${type} with language ${language} not found for project ${projectId}`,
      );
    }
    await apiClient.projectDescriptions_UpdateDescription(
      projectId,
      description.id,
      new ProjectDescriptionRequestDTO({
        type: type,
        text: text,
        language:
          language === "default" ? undefined : new Language({ id: language }),
      }),
    );
  };

  const deleteDescription = async (
    apiClient: ApiClient,
    deleteData: {
      type: DescriptionType;
      language: string;
    },
  ) => {
    const { type, language } = deleteData;
    // Find the description to delete
    const description = findDescription(type, language);
    if (!description) {
      throw new Error(
        `Description type ${type} with language ${language} not found for project ${projectId}`,
      );
    }
    await apiClient.projectDescriptions_DeleteDescription(
      projectId,
      description.id,
    );

    // After deletion, switch to another available description or reset selection
    const remainingDescriptions = descriptions.filter(
      (desc) =>
        !(desc.type === type && (desc.language?.id || "default") === language),
    );

    if (remainingDescriptions.length > 0) {
      // Switch to the first remaining description
      const firstRemaining = remainingDescriptions[0];
      setSelectedDescriptionType(firstRemaining.type);
      setSelectedLanguage(firstRemaining.language?.id || "default");
    } else {
      // No descriptions left, reset to default
      setSelectedDescriptionType(DescriptionType.Primary);
      setSelectedLanguage("default");
    }

    onProjectUpdate();
  };

  // Create new description handler
  const createNewDescription = async (
    apiClient: ApiClient,
    newDescriptionData: {
      type: DescriptionType;
      language: string;
      text: string;
    },
  ) => {
    const { type, language, text } = newDescriptionData;
    await apiClient.projectDescriptions_CreateDescription(
      projectId,
      new ProjectDescriptionRequestDTO({
        type: type,
        text: text,
        language:
          language === "default" ? undefined : new Language({ id: language }),
      }),
    );
    // Update the selected type and language to the new ones
    setSelectedDescriptionType(type);
    setSelectedLanguage(language);
    // Reset the form
    setNewDescriptionType(DescriptionType.Primary);
    setNewLanguage("default");
    handleDescriptionChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLTextAreaElement>);
    // Close the dialog
    setIsCreatingNew(false);
    onProjectUpdate();
  };

  return (
    <>
      {/* Add Type Dialog */}
      <ApiMutation
        mutationFn={createNewDescription}
        data={{
          type: newDescriptionType,
          language: newLanguage,
          text: editDescription,
        }}
        loadingMessage="Creating description..."
        mode="component"
        onSuccess={() => {
          setIsCreatingNew(false);
          onProjectUpdate();
        }}
      >
        {({ onSubmit, isLoading }) => (
          <Dialog open={isCreatingNew} onOpenChange={setIsCreatingNew}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Description</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description Type
                  </label>
                  <Select
                    value={newDescriptionType}
                    onValueChange={(value) =>
                      setNewDescriptionType(value as DescriptionType)
                    }
                  >
                    <SelectTrigger className="h-9 w-full border-gray-200 bg-gray-50 text-sm hover:bg-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableNewTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() +
                            type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Language (leave "default" for no specific language)
                  </label>
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="default, en, nl, de, fr..."
                    className="h-9 border-gray-200 bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description Text
                  </label>
                  <Textarea
                    className="min-h-[100px]"
                    placeholder="Enter description text..."
                    value={editDescription}
                    onChange={handleDescriptionChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingNew(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={onSubmit}
                  disabled={
                    isLoading ||
                    !editDescription.trim() ||
                    !newDescriptionType ||
                    !newLanguage.trim()
                  }
                >
                  <Plus size={16} /> Add Description
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </ApiMutation>

      {/* Delete Confirmation Dialog */}
      <ApiMutation
        mutationFn={deleteDescription}
        data={{
          type: selectedDescriptionType,
          language: selectedLanguage,
        }}
        loadingMessage="Deleting description..."
        mode="component"
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          setEditDescriptionMode(false);
          onProjectUpdate();
        }}
      >
        {({ onSubmit, isLoading }) => (
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Description</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this description? This action
                  cannot be undone.
                </p>
                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                  <p className="text-sm">
                    <span className="font-medium">Type:</span>{" "}
                    {selectedDescriptionType.charAt(0).toUpperCase() +
                      selectedDescriptionType.slice(1).toLowerCase()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Language:</span>{" "}
                    {selectedLanguage === "default"
                      ? "Default"
                      : selectedLanguage.toUpperCase()}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={onSubmit}
                  disabled={isLoading}
                >
                  <Trash2 size={16} /> Delete Description
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </ApiMutation>

      <CardHeader>
        <div className="flex w-full rounded-lg">
          {!editTitleMode || !isAdmin ? (
            <div className="relative flex w-full">
              <CardTitle className="w-full text-3xl/8 font-bold tracking-tight sm:text-4xl/10 md:text-5xl/14">
                {title?.text ?? "No title available"}
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
      <CardContent className="group" data-cy="description-section">
        {editDescriptionMode && isAdmin ? (
          <ApiMutation
            mutationFn={updateProjectDescription}
            data={{
              type: selectedDescriptionType,
              language: selectedLanguage,
              text: editDescription,
            }}
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
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 pt-1 sm:px-3">
                    <h3 className="font-semibold text-gray-700">
                      Description:
                    </h3>
                    <Select
                      value={selectedDescriptionType}
                      onValueChange={(value) =>
                        setSelectedDescriptionType(value as DescriptionType)
                      }
                    >
                      <SelectTrigger className="h-8 w-[180px] border-gray-200 bg-gray-50 text-sm hover:bg-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(DescriptionType).map(
                          (type: DescriptionType) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() +
                                type.slice(1).toLowerCase()}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Lang:
                      </label>
                      <Input
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        placeholder="default, en, nl..."
                        className="h-8 w-28 border-gray-200 bg-gray-50 text-sm"
                      />
                    </div>
                  </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={onSubmit}
                      disabled={isLoading}
                    >
                      <Check size={16} /> Save
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      <Trash2 size={16} /> Delete
                    </Button>

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
              );
            }}
          </ApiMutation>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-between pb-2">
              <div className="flex flex-wrap items-center gap-3 sm:px-3">
                <h3 className="font-semibold text-gray-700">Description:</h3>
                <Select
                  value={selectedDescriptionType}
                  onValueChange={(value) =>
                    setSelectedDescriptionType(value as DescriptionType)
                  }
                >
                  <SelectTrigger className="h-8 w-[180px] border-gray-100 bg-white/70 text-sm shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DescriptionType)
                      .filter((type) =>
                        descriptions.some((desc) => desc.type === type),
                      )
                      .map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() +
                            type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {availableLanguagesForType.length > 1 && (
                  <>
                    <span className="text-sm text-gray-600">Lang:</span>
                    <Select
                      value={selectedLanguage}
                      onValueChange={(value) => setSelectedLanguage(value)}
                    >
                      <SelectTrigger className="h-8 w-[100px] border-gray-100 bg-white/70 text-sm shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLanguagesForType.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang === "default"
                              ? "Default"
                              : lang.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  {availableNewTypes.length > 0 && (
                    <Button
                      className="invisible group-hover:visible"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCreatingNew(true)}
                      data-cy="add-description-type-btn"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Type
                    </Button>
                  )}
                  <Button
                    className="invisible group-hover:visible"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditDescriptionMode(true)}
                    data-cy="edit-description-btn"
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
            <p className="text-start text-sm/6 text-gray-700 sm:px-3 sm:text-base/7">
              {isExpanded
                ? currentDescription
                : currentDescription &&
                    currentDescription.length > descriptionTruncateLength
                  ? currentDescription.substring(0, descriptionTruncateLength) +
                    "..."
                  : currentDescription}
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
