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
import { useState, useRef, useEffect, useContext } from "react";
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
import { LoadingWrapper } from "@/components/loadingWrapper";
import {
  DescriptionType,
  Language,
  ProjectDescriptionRequestDTO,
  ProjectDescriptionResponseDTO,
  ProjectTitleRequestDTO,
  ProjectTitleResponseDTO,
  TitleType,
  SwaggerException,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Language validation function
const validateLanguage = (language: string): boolean => {
  return (
    language === "default" ||
    (language.length === 3 && /^[a-zA-Z]{3}$/.test(language))
  );
};

// Helper function to get language validation error message
const getLanguageValidationError = (language: string): string | null => {
  if (!language.trim()) {
    return "Language is required";
  }
  if (!validateLanguage(language)) {
    return "Language must be 'default' or exactly 3 letters (e.g., 'eng', 'nld')";
  }
  return null;
};

type ProjectOverviewProps = {
  projectId: string;
  titles?: ProjectTitleResponseDTO[];
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
  titles,
  descriptions = [],
  isAdmin = false,
  onProjectUpdate,
}: Readonly<ProjectOverviewProps>) {
  // State for selected description type and language
  const [selectedDescriptionType, setSelectedDescriptionType] =
    useState<DescriptionType>(DescriptionType.Primary);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("default");

  // State for selected title type
  const [selectedTitleType, setSelectedTitleType] = useState<TitleType>(
    TitleType.Primary,
  );

  // State for creating new description types
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newDescriptionType, setNewDescriptionType] = useState<DescriptionType>(
    DescriptionType.Primary,
  );
  const [newLanguage, setNewLanguage] = useState<string>("default");

  // State for creating new title types
  const [isCreatingNewTitle, setIsCreatingNewTitle] = useState(false);
  const [newTitleType, setNewTitleType] = useState<TitleType>(
    TitleType.Primary,
  );
  const [newTitleLanguage, setNewTitleLanguage] = useState<string>("default");
  const [newTitleText, setNewTitleText] = useState<string>("");

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteTitleModalOpen, setIsDeleteTitleModalOpen] = useState(false);

  // State for language validation
  const [languageErrors, setLanguageErrors] = useState<{
    editTitle: string | null;
    newTitle: string | null;
    selectedDescription: string | null;
    newDescription: string | null;
  }>({
    editTitle: null,
    newTitle: null,
    selectedDescription: null,
    newDescription: null,
  });

  const [languageTouched, setLanguageTouched] = useState<{
    editTitle: boolean;
    newTitle: boolean;
    selectedDescription: boolean;
    newDescription: boolean;
  }>({
    editTitle: false,
    newTitle: false,
    selectedDescription: false,
    newDescription: false,
  });

  // Helper function to find description by type and language
  const findDescription = (type: DescriptionType, language?: string) => {
    return descriptions.find(
      (desc) =>
        desc.type === type &&
        (desc.language?.id || "default") === (language || "default"),
    );
  };

  // Helper function to find title by type (only active titles with null/undefined end_date)
  const findTitle = (type: TitleType) => {
    return titles?.find((title) => title.type === type && !title.end_date);
  };

  // Get available description types that don't exist yet for the selected language
  const availableNewTypes = Object.values(DescriptionType).filter((type) => {
    return !descriptions.some(
      (desc) =>
        desc.type === type &&
        (desc.language?.id || "default") === (newLanguage || "default"),
    );
  });

  // Get available title types that don't exist yet (only for active titles)
  const availableNewTitleTypes = Object.values(TitleType).filter((type) => {
    // Check if there are any active titles of this type
    const hasActiveTitleOfType = titles?.some(
      (title) => title.type === type && !title.end_date,
    );

    // If no active title of this type exists, it's available for creation
    return !hasActiveTitleOfType;
  });

  // Get current description based on selected type and language
  const currentDescription =
    findDescription(selectedDescriptionType, selectedLanguage)?.text || "";

  // Get current title based on selected type
  const currentTitle = findTitle(selectedTitleType);

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
  const [editTitleLanguage, setEditTitleLanguage] = useState<string>("");

  const {
    editedText: editTitle,
    handleTextChange: handleTitleChange,
    handleCancel: handleTitleCancel,
    handleKeyDown: handleTitleKeyDown,
  } = useEditableText(
    currentTitle?.text ?? "",
    currentTitle?.text ?? "",
    editTitleMode,
    () => {
      // Handle save via button click
    },
  );

  // Update edit language when title changes or edit mode is entered
  useEffect(() => {
    if (editTitleMode && currentTitle) {
      setEditTitleLanguage(currentTitle.language?.id || "default");
    }
  }, [editTitleMode, currentTitle]);

  // Validation effect for language fields
  useEffect(() => {
    setLanguageErrors((prevErrors) => {
      const errors = { ...prevErrors };

      if (languageTouched.editTitle) {
        errors.editTitle = getLanguageValidationError(editTitleLanguage);
      }
      if (languageTouched.newTitle) {
        errors.newTitle = getLanguageValidationError(newTitleLanguage);
      }
      if (languageTouched.selectedDescription) {
        errors.selectedDescription =
          getLanguageValidationError(selectedLanguage);
      }
      if (languageTouched.newDescription) {
        errors.newDescription = getLanguageValidationError(newLanguage);
      }

      return errors;
    });
  }, [
    editTitleLanguage,
    newTitleLanguage,
    selectedLanguage,
    newLanguage,
    languageTouched,
  ]);

  // Helper functions for handling language input changes
  const handleEditTitleLanguageChange = (value: string) => {
    setEditTitleLanguage(value);
    setLanguageTouched((prev) => ({ ...prev, editTitle: true }));
  };

  const handleNewTitleLanguageChange = (value: string) => {
    setNewTitleLanguage(value);
    setLanguageTouched((prev) => ({ ...prev, newTitle: true }));
  };

  const handleSelectedLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setLanguageTouched((prev) => ({ ...prev, selectedDescription: true }));
  };

  const handleNewLanguageChange = (value: string) => {
    setNewLanguage(value);
    setLanguageTouched((prev) => ({ ...prev, newDescription: true }));
  };

  // Description editing
  const [editDescriptionMode, setEditDescriptionMode] = useState(false);

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
      // Handle save via button click
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

  // Centralized API handlers with direct API calls
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SwaggerException | null>(null);

  const apiClient = useContext(ApiClientContext);

  const executeApiOperation = async (operation: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    try {
      await operation();
    } catch (err) {
      setError(
        err instanceof SwaggerException
          ? err
          : new SwaggerException(
              "An error occurred",
              0,
              JSON.stringify(err),
              {},
              err,
            ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTitle = async () => {
    // Validate language before proceeding
    const langError = getLanguageValidationError(editTitleLanguage);
    if (langError) {
      setLanguageErrors((prev) => ({ ...prev, editTitle: langError }));
      setLanguageTouched((prev) => ({ ...prev, editTitle: true }));
      return;
    }

    await executeApiOperation(async () => {
      await apiClient.projectTitles_UpdateTitle(
        projectId,
        new ProjectTitleRequestDTO({
          type: selectedTitleType,
          text: editTitle,
          language:
            editTitleLanguage === "default"
              ? undefined
              : new Language({ id: editTitleLanguage }),
        }),
      );
      setEditTitleMode(false);
      onProjectUpdate();
    });
  };

  const handleDeleteTitle = async () => {
    await executeApiOperation(async () => {
      const title = findTitle(selectedTitleType);
      if (!title) {
        throw new Error(
          `Title type ${selectedTitleType} not found for project ${projectId}`,
        );
      }
      await apiClient.projectTitles_DeleteTitle(projectId, title.id);

      // After deletion, switch to another available title or reset selection
      const remainingTitles = titles?.filter(
        (title) => !(title.type === selectedTitleType),
      );

      if (remainingTitles && remainingTitles.length > 0) {
        const firstRemaining = remainingTitles[0];
        setSelectedTitleType(firstRemaining.type);
      } else {
        setSelectedTitleType(TitleType.Primary);
      }

      setIsDeleteTitleModalOpen(false);
      setEditTitleMode(false);
      onProjectUpdate();
    });
  };

  const handleCreateTitle = async () => {
    // Validate language before proceeding
    const langError = getLanguageValidationError(newTitleLanguage);
    if (langError) {
      setLanguageErrors((prev) => ({ ...prev, newTitle: langError }));
      setLanguageTouched((prev) => ({ ...prev, newTitle: true }));
      return;
    }

    await executeApiOperation(async () => {
      await apiClient.projectTitles_UpdateTitle(
        projectId,
        new ProjectTitleRequestDTO({
          type: newTitleType,
          text: newTitleText,
          language:
            newTitleLanguage === "default"
              ? undefined
              : new Language({ id: newTitleLanguage }),
        }),
      );
      setSelectedTitleType(newTitleType);
      setNewTitleType(TitleType.Primary);
      setNewTitleLanguage("default");
      setNewTitleText("");
      setIsCreatingNewTitle(false);
      onProjectUpdate();
    });
  };

  const handleUpdateDescription = async () => {
    // Validate language before proceeding
    const langError = getLanguageValidationError(selectedLanguage);
    if (langError) {
      setLanguageErrors((prev) => ({
        ...prev,
        selectedDescription: langError,
      }));
      setLanguageTouched((prev) => ({ ...prev, selectedDescription: true }));
      return;
    }

    await executeApiOperation(async () => {
      const description = findDescription(
        selectedDescriptionType,
        selectedLanguage,
      );
      if (!description) {
        throw new Error(
          `Description type ${selectedDescriptionType} with language ${selectedLanguage} not found for project ${projectId}`,
        );
      }
      await apiClient.projectDescriptions_UpdateDescription(
        projectId,
        description.id,
        new ProjectDescriptionRequestDTO({
          type: selectedDescriptionType,
          text: editDescription,
          language:
            selectedLanguage === "default"
              ? undefined
              : new Language({ id: selectedLanguage }),
        }),
      );
      setEditDescriptionMode(false);
      onProjectUpdate();
    });
  };

  const handleDeleteDescription = async () => {
    await executeApiOperation(async () => {
      const description = findDescription(
        selectedDescriptionType,
        selectedLanguage,
      );
      if (!description) {
        throw new Error(
          `Description type ${selectedDescriptionType} with language ${selectedLanguage} not found for project ${projectId}`,
        );
      }
      await apiClient.projectDescriptions_DeleteDescription(
        projectId,
        description.id,
      );

      const remainingDescriptions = descriptions.filter(
        (desc) =>
          !(
            desc.type === selectedDescriptionType &&
            (desc.language?.id || "default") === selectedLanguage
          ),
      );

      if (remainingDescriptions.length > 0) {
        const firstRemaining = remainingDescriptions[0];
        setSelectedDescriptionType(firstRemaining.type);
        setSelectedLanguage(firstRemaining.language?.id || "default");
      } else {
        setSelectedDescriptionType(DescriptionType.Primary);
        setSelectedLanguage("default");
      }

      setIsDeleteModalOpen(false);
      setEditDescriptionMode(false);
      onProjectUpdate();
    });
  };

  const handleCreateDescription = async () => {
    // Validate language before proceeding
    const langError = getLanguageValidationError(newLanguage);
    if (langError) {
      setLanguageErrors((prev) => ({ ...prev, newDescription: langError }));
      setLanguageTouched((prev) => ({ ...prev, newDescription: true }));
      return;
    }

    await executeApiOperation(async () => {
      await apiClient.projectDescriptions_CreateDescription(
        projectId,
        new ProjectDescriptionRequestDTO({
          type: newDescriptionType,
          text: editDescription,
          language:
            newLanguage === "default"
              ? undefined
              : new Language({ id: newLanguage }),
        }),
      );
      setSelectedDescriptionType(newDescriptionType);
      setSelectedLanguage(newLanguage);
      setNewDescriptionType(DescriptionType.Primary);
      setNewLanguage("default");
      handleDescriptionChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLTextAreaElement>);
      setIsCreatingNew(false);
      onProjectUpdate();
    });
  };

  return (
    <LoadingWrapper isLoading={isLoading} error={error}>
      {/* Add Title Type Dialog */}
      <Dialog open={isCreatingNewTitle} onOpenChange={setIsCreatingNewTitle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Title Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title Type
              </label>
              <Select
                value={newTitleType}
                onValueChange={(value) => setNewTitleType(value as TitleType)}
              >
                <SelectTrigger className="h-9 w-full border-gray-200 bg-gray-50 text-sm hover:bg-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableNewTitleTypes.map((type) => (
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
                value={newTitleLanguage}
                onChange={(e) => handleNewTitleLanguageChange(e.target.value)}
                placeholder="default, eng, nld..."
                className={`h-9 border-gray-200 bg-gray-50 text-sm ${
                  languageErrors.newTitle
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
              />
              {languageErrors.newTitle && (
                <p className="mt-1 text-sm text-red-500">
                  {languageErrors.newTitle}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title Text
              </label>
              <Input
                value={newTitleText}
                onChange={(e) => setNewTitleText(e.target.value)}
                placeholder="Enter the title text..."
                className="h-9 border-gray-200 bg-gray-50 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreatingNewTitle(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleCreateTitle}
              disabled={
                isLoading ||
                !newTitleType ||
                !newTitleLanguage.trim() ||
                !newTitleText.trim() ||
                !!languageErrors.newTitle
              }
            >
              <Plus size={16} /> Add Title Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Title Confirmation Dialog */}
      <Dialog
        open={isDeleteTitleModalOpen}
        onOpenChange={setIsDeleteTitleModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Title</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this title? This action cannot be
              undone.
            </p>
            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="text-sm">
                <span className="font-medium">Type:</span>{" "}
                {selectedTitleType.charAt(0).toUpperCase() +
                  selectedTitleType.slice(1).toLowerCase()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Language:</span>{" "}
                {currentTitle?.language?.id === undefined ||
                currentTitle?.language?.id === "default"
                  ? "Default"
                  : currentTitle?.language?.id.toUpperCase()}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteTitleModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleDeleteTitle}
              disabled={isLoading}
            >
              <Trash2 size={16} /> Delete Title
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Description Type Dialog */}
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
                onChange={(e) => handleNewLanguageChange(e.target.value)}
                placeholder="default, eng, nld..."
                className={`h-9 border-gray-200 bg-gray-50 text-sm ${
                  languageErrors.newDescription
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
              />
              {languageErrors.newDescription && (
                <p className="mt-1 text-sm text-red-500">
                  {languageErrors.newDescription}
                </p>
              )}
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
              onClick={handleCreateDescription}
              disabled={
                isLoading ||
                !editDescription.trim() ||
                !newDescriptionType ||
                !newLanguage.trim() ||
                !!languageErrors.newDescription
              }
            >
              <Plus size={16} /> Add Description
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Description Confirmation Dialog */}
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
              onClick={handleDeleteDescription}
              disabled={isLoading}
            >
              <Trash2 size={16} /> Delete Description
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardHeader>
        <div className="group/cardHeader flex w-full rounded-lg">
          {!editTitleMode || !isAdmin ? (
            <div className="relative flex w-full">
              <div className="flex w-full items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 flex-col">
                  <CardTitle className="text-3xl/8 font-bold tracking-tight sm:text-4xl/10 md:text-5xl/14">
                    {currentTitle?.text ?? "No title available"}
                  </CardTitle>
                  {titles && titles.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <Select
                        value={selectedTitleType}
                        onValueChange={(value) =>
                          setSelectedTitleType(value as TitleType)
                        }
                      >
                        <SelectTrigger className="h-8 w-[120px] border-gray-100 bg-white/70 text-sm shadow-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(TitleType)
                            .filter((type) =>
                              titles.some(
                                (title) =>
                                  title.type === type && !title.end_date,
                              ),
                            )
                            .map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() +
                                  type.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {currentTitle?.language?.id &&
                        currentTitle?.language?.id !== "default" && (
                          <span className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">
                            Lang: {currentTitle.language.id.toUpperCase()}
                          </span>
                        )}
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex flex-shrink-0 gap-2">
                    {availableNewTitleTypes.length > 0 && (
                      <Button
                        className="invisible group-hover/cardHeader:visible"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCreatingNewTitle(true)}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Type
                      </Button>
                    )}
                    <Button
                      className="invisible group-hover/cardHeader:visible"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditTitleMode(true)}
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
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
              <div className="mt-2 flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Language:
                </label>
                <div className="flex flex-col">
                  <Input
                    value={editTitleLanguage}
                    onChange={(e) =>
                      handleEditTitleLanguageChange(e.target.value)
                    }
                    placeholder="default, eng, nld..."
                    className={`h-8 w-32 border-gray-200 bg-gray-50 text-sm ${
                      languageErrors.editTitle
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {languageErrors.editTitle && (
                    <p className="mt-1 text-xs text-red-500">
                      {languageErrors.editTitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleUpdateTitle}
                  disabled={isLoading || !!languageErrors.editTitle}
                >
                  <Check size={16} /> Save
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsDeleteTitleModalOpen(true)}
                >
                  <Trash2 size={16} /> Delete
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => {
                    handleTitleCancel();
                    setEditTitleMode(false);
                    setEditTitleLanguage(
                      currentTitle?.language?.id || "default",
                    );
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
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 pt-1 sm:px-3">
              <h3 className="font-semibold text-gray-700">Description:</h3>
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
                <div className="flex flex-col">
                  <Input
                    value={selectedLanguage}
                    onChange={(e) =>
                      handleSelectedLanguageChange(e.target.value)
                    }
                    placeholder="default, eng, nld..."
                    className={`h-8 w-28 border-gray-200 bg-gray-50 text-sm ${
                      languageErrors.selectedDescription
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {languageErrors.selectedDescription && (
                    <p className="mt-1 text-xs text-red-500">
                      {languageErrors.selectedDescription}
                    </p>
                  )}
                </div>
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
                onClick={handleUpdateDescription}
                disabled={isLoading || !!languageErrors.selectedDescription}
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
            <div
              className={`transition-max-height overflow-hidden duration-300 ${
                isExpanded ? "max-h-[1000px]" : "max-h-[280px]"
              }`}
            >
              <p className="overflow-wrap-anywhere text-start text-sm/6 break-words break-all text-gray-700 sm:px-3 sm:text-base/7">
                {!isExpanded &&
                currentDescription &&
                currentDescription.length > descriptionTruncateLength
                  ? currentDescription.substring(0, descriptionTruncateLength) +
                    "..."
                  : currentDescription}
              </p>
            </div>
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
    </LoadingWrapper>
  );
}
