import { useState, useEffect, useRef } from "react";
import {
  Edit,
  Check,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import {
  ProjectDescriptionRequestDTO,
  ProjectDescriptionResponseDTO,
  DescriptionType,
  Language,
  ApiClient,
} from "@team-golfslag/conflux-api-client/src/client";
import { useApiMutation } from "@/hooks/useApiMutation";
import {
  useEditableText,
  useTruncatableText,
} from "@/hooks/useEditableContent";
import { LanguageInput } from "@/components/languageInput";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// API call functions
const createDescriptionApi = (
  apiClient: ApiClient,
  { projectId, dto }: { projectId: string; dto: ProjectDescriptionRequestDTO },
) => apiClient.projectDescriptions_CreateDescription(projectId, dto);

const updateDescriptionApi = (
  apiClient: ApiClient,
  {
    projectId,
    id,
    dto,
  }: { projectId: string; id: string; dto: ProjectDescriptionRequestDTO },
) => apiClient.projectDescriptions_UpdateDescription(projectId, id, dto);

const deleteDescriptionApi = (
  apiClient: ApiClient,
  { projectId, id }: { projectId: string; id: string },
) => apiClient.projectDescriptions_DeleteDescription(projectId, id);

type ProjectDescriptionSectionProps = {
  projectId: string;
  descriptions?: ProjectDescriptionResponseDTO[];
  isAdmin?: boolean;
  onProjectUpdate: () => void;
};

export default function ProjectDescriptionSection({
  projectId,
  descriptions = [],
  isAdmin = false,
  onProjectUpdate,
}: Readonly<ProjectDescriptionSectionProps>) {
  // Language context for validation and name lookup
  const { getLanguageName, getLanguageValidationError } = useLanguage();

  const [selectedType, setSelectedType] = useState<DescriptionType>(
    DescriptionType.Primary,
  );
  const [selectedLang, setSelectedLang] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editLanguage, setEditLanguage] = useState("");
  const [langError, setLangError] = useState<string | null>(null);
  const [editComboError, setEditComboError] = useState<string | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const currentDescription = descriptions.find(
    (d) => d.type === selectedType && (d.language?.id ?? "") === selectedLang,
  );
  const availableTypes = [...new Set(descriptions.map((d) => d.type))].sort();
  const availableLangs = descriptions
    .filter((d) => d.type === selectedType)
    .map((d) => d.language?.id ?? "");

  useEffect(() => {
    if (!availableLangs.includes(selectedLang)) {
      setSelectedLang(availableLangs[0] ?? "");
    }
  }, [selectedType, availableLangs, selectedLang]);

  // Initialize edit state when entering edit mode
  useEffect(() => {
    if (editMode && currentDescription) {
      setEditLanguage(currentDescription.language?.id ?? "");
    }
  }, [editMode, currentDescription]);

  // Validate language in edit mode
  useEffect(() => {
    if (!editMode) return;

    // 1. Validate language format
    const formatError = getLanguageValidationError(editLanguage);
    setLangError(formatError);

    // 2. Validate type/language combination uniqueness, excluding the current item
    const comboExists = descriptions.some(
      (d) =>
        d.type === selectedType &&
        (d.language?.id ?? "") === editLanguage &&
        d.id !== currentDescription?.id,
    );

    // 3. Check for multiple primary descriptions (only one primary description is allowed)
    const primaryExists =
      selectedType === DescriptionType.Primary &&
      descriptions.some(
        (d) =>
          d.type === DescriptionType.Primary && d.id !== currentDescription?.id,
      );

    if (comboExists) {
      setEditComboError("This type and language combination already exists.");
    } else if (primaryExists) {
      setEditComboError("Only one primary description is allowed per project.");
    } else {
      setEditComboError(null);
    }
  }, [
    editLanguage,
    selectedType,
    descriptions,
    currentDescription,
    editMode,
    getLanguageValidationError,
  ]);

  const {
    editedText: editText,
    handleTextChange,
    handleCancel,
  } = useEditableText(
    currentDescription?.text ?? "",
    currentDescription?.text ?? "",
    editMode,
    () => handleSave(),
  );

  const { isExpanded, toggleExpand, shouldShowExpandButton } =
    useTruncatableText(currentDescription?.text ?? "", 800);

  const { mutate: updateDescription, isLoading: isUpdating } = useApiMutation(
    updateDescriptionApi,
    {
      onSuccess: () => {
        setEditMode(false);
        onProjectUpdate();
      },
    },
  );

  const { mutate: deleteDescription, isLoading: isDeleting } = useApiMutation(
    deleteDescriptionApi,
    {
      onSuccess: () => {
        setDeleteOpen(false);
        setEditMode(false);
        const remaining = descriptions.filter(
          (d) => d.id !== currentDescription?.id,
        );
        if (remaining.length > 0) {
          setSelectedType(remaining[0].type);
          setSelectedLang(remaining[0].language?.id ?? "");
        }
        onProjectUpdate();
      },
    },
  );

  const handleSave = () => {
    if (getLanguageValidationError(editLanguage) || editComboError) {
      return;
    }
    if (currentDescription) {
      updateDescription({
        projectId,
        id: currentDescription.id,
        dto: new ProjectDescriptionRequestDTO({
          type: selectedType,
          text: editText,
          language:
            editLanguage === ""
              ? undefined
              : new Language({ id: editLanguage }),
        }),
      });
    }
  };

  const handleDelete = () => {
    if (currentDescription) {
      deleteDescription({ projectId, id: currentDescription.id });
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (editMode && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editText, editMode]);

  const isLoading = isUpdating || isDeleting;

  if (!isAdmin || !editMode) {
    return (
      <div className="group relative">
        <div className="flex items-center justify-between pb-2">
          <div className="flex flex-wrap items-center gap-3 sm:px-3">
            <h3 className="font-semibold text-gray-700">Description:</h3>
            <Select
              value={selectedType}
              onValueChange={(v) => setSelectedType(v as DescriptionType)}
            >
              <SelectTrigger className="h-8 w-[180px] border-gray-100 bg-white/70 text-sm shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableLangs.length > 1 && (
              <Select
                value={selectedLang}
                onValueChange={(value) => setSelectedLang(value)}
              >
                <SelectTrigger className="h-8 w-[140px] border-gray-100 bg-white/70 text-sm shadow-sm">
                  <SelectValue>
                    {selectedLang === ""
                      ? "Default"
                      : (() => {
                          const langName =
                            getLanguageName(selectedLang.toLowerCase()) ||
                            selectedLang.toUpperCase();
                          return langName.length > 10
                            ? langName.substring(0, 10) + "..."
                            : langName;
                        })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableLangs.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang === ""
                        ? "Default"
                        : getLanguageName(lang.toLowerCase()) ||
                          lang.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                className="invisible group-hover:visible"
                variant="outline"
                size="sm"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="mr-1 h-4 w-4" /> Add New
              </Button>
              <Button
                className="invisible group-hover:visible"
                variant="outline"
                size="sm"
                onClick={() => setEditMode(true)}
                disabled={!currentDescription}
              >
                <Edit className="mr-1 h-4 w-4" /> Edit
              </Button>
            </div>
          )}
        </div>
        <div
          className={`transition-max-height overflow-hidden duration-300 ${
            isExpanded ? "max-h-[1000px]" : "max-h-[280px]"
          }`}
        >
          <p className="overflow-wrap-anywhere text-start text-sm/6 break-words text-gray-700 sm:px-3 sm:text-base/7">
            {isExpanded
              ? currentDescription?.text
              : (currentDescription?.text ?? "").substring(0, 800) +
                (shouldShowExpandButton ? "..." : "")}
          </p>
        </div>
        {shouldShowExpandButton && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 flex w-full items-center justify-center text-gray-600"
            onClick={toggleExpand}
          >
            <span>Show {isExpanded ? "less" : "more"}</span>
            {isExpanded ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        )}
        <CreateDescriptionDialog
          isOpen={isCreateOpen}
          setOpen={setCreateOpen}
          projectId={projectId}
          existingDescriptions={descriptions}
          onProjectUpdate={onProjectUpdate}
          onSuccess={(newType, newLang) => {
            setSelectedType(newType);
            setSelectedLang(newLang);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="pt-1 sm:px-3">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Description Type:
          </label>
          <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
            {selectedType.charAt(0).toUpperCase() +
              selectedType.slice(1).toLowerCase()}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <label className="min-w-fit pt-2 text-sm font-medium text-gray-700">
            Language:
          </label>
          <div className="max-w-xs flex-1">
            <LanguageInput
              value={editLanguage}
              onChange={setEditLanguage}
              error={langError || editComboError}
              className="h-8 w-full"
            />
          </div>
        </div>
      </div>
      <div className="sm:px-3">
        <Textarea
          ref={textareaRef}
          value={editText}
          autoFocus
          onChange={handleTextChange}
          className="min-h-[200px] w-full resize-none overflow-hidden text-sm/6"
          placeholder="Enter project description"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isLoading || !!langError || !!editComboError}
        >
          <Check size={16} className="mr-1" /> Save
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          disabled={isLoading}
        >
          <Trash2 size={16} className="mr-1" /> Delete
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            handleCancel();
            setEditMode(false);
            setLangError(null);
            setEditComboError(null);
          }}
          disabled={isLoading}
        >
          <X size={16} className="mr-1" /> Cancel
        </Button>
      </div>
      <DeleteDescriptionDialog
        isOpen={isDeleteOpen}
        setOpen={setDeleteOpen}
        description={currentDescription}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}

function CreateDescriptionDialog({
  isOpen,
  setOpen,
  projectId,
  existingDescriptions,
  onProjectUpdate,
  onSuccess,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  projectId: string;
  existingDescriptions: ProjectDescriptionResponseDTO[];
  onProjectUpdate: () => void;
  onSuccess: (newType: DescriptionType, newLang: string) => void;
}) {
  // Language context for validation
  const { getLanguageValidationError } = useLanguage();

  // Filter out Primary type if it already exists
  const availableTypes = Object.values(DescriptionType).filter((t) => {
    if (t === DescriptionType.Primary) {
      return !existingDescriptions.some(
        (d) => d.type === DescriptionType.Primary,
      );
    }
    return true;
  });

  const [type, setType] = useState<DescriptionType>(
    availableTypes.includes(DescriptionType.Primary)
      ? DescriptionType.Primary
      : availableTypes[0] || DescriptionType.Brief,
  );
  const [language, setLanguage] = useState("");
  const [text, setText] = useState("");
  const [langError, setLangError] = useState<string | null>(null);
  const [comboError, setComboError] = useState<string | null>(null);

  const { mutate: createDescription, isLoading } = useApiMutation(
    createDescriptionApi,
    {
      onSuccess: () => {
        setOpen(false);
        onProjectUpdate();
        onSuccess(type, language);
        setText("");
        setLanguage("");
      },
    },
  );

  useEffect(() => {
    const langErr = getLanguageValidationError(language);
    setLangError(langErr);

    // Check for exact type/language combination
    const comboExists = existingDescriptions.some(
      (d) => d.type === type && (d.language?.id ?? "") === language,
    );

    if (comboExists) {
      setComboError("This type and language combination already exists.");
    } else {
      setComboError(null);
    }
  }, [type, language, existingDescriptions, getLanguageValidationError]);

  // Update selected type if current type is no longer available
  useEffect(() => {
    if (!availableTypes.includes(type)) {
      setType(availableTypes[0] || DescriptionType.Brief);
    }
  }, [availableTypes, type]);

  const handleCreate = () => {
    if (langError || comboError) return;
    createDescription({
      projectId,
      dto: new ProjectDescriptionRequestDTO({
        type,
        text,
        language: language === "" ? undefined : new Language({ id: language }),
      }),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Description</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Description Type
            </label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as DescriptionType)}
            >
              <SelectTrigger className={comboError ? "border-red-500" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Language</label>
            <LanguageInput
              value={language}
              onChange={setLanguage}
              error={langError}
            />
            {comboError && (
              <p className="mt-1 text-xs text-red-500">{comboError}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Description Text
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the description text..."
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isLoading || !text.trim() || !!langError || !!comboError}
          >
            <Plus size={16} className="mr-1" /> Add Description
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDescriptionDialog({
  isOpen,
  setOpen,
  description,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  description?: ProjectDescriptionResponseDTO;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  const { getLanguageName } = useLanguage();

  if (!description) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-6 w-6" />
            Delete Description
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete this description? This action is
            irreversible.
          </p>
          <div className="bg-muted mt-4 rounded-lg border p-3 text-sm">
            <p>
              <strong>Type:</strong> {description.type}
            </p>
            <p>
              <strong>Language:</strong>{" "}
              {getLanguageName(description.language?.id ?? "")}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
