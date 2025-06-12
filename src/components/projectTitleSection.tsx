import { useState, useEffect, useRef } from "react";
import { Edit, Check, X, Plus, Trash2, AlertTriangle } from "lucide-react";
import {
  ProjectTitleRequestDTO,
  ProjectTitleResponseDTO,
  TitleType,
  Language,
} from "@team-golfslag/conflux-api-client/src/client";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useEditableText } from "@/hooks/useEditableContent";
import { LanguageInput } from "@/components/languageInput";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

type ProjectTitleSectionProps = {
  projectId: string;
  titles?: ProjectTitleResponseDTO[];
  isAdmin?: boolean;
  onProjectUpdate: () => void;
};

export default function ProjectTitleSection({
  projectId,
  titles = [],
  isAdmin = false,
  onProjectUpdate,
}: Readonly<ProjectTitleSectionProps>) {
  // Language context for validation and name lookup
  const { getLanguageName, getLanguageValidationError } = useLanguage();

  // State for selection and editing
  const [selectedType, setSelectedType] = useState<TitleType>(
    TitleType.Primary,
  );
  const [editMode, setEditMode] = useState(false);
  const [editLanguage, setEditLanguage] = useState("");
  const [langError, setLangError] = useState<string | null>(null);

  // State for dialogs
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // Find the currently active title for the selected type
  const currentTitle = titles.find(
    (t) => t.type === selectedType && !t.end_date,
  );

  const {
    editedText: editText,
    handleTextChange,
    handleCancel,
  } = useEditableText(
    currentTitle?.text ?? "",
    currentTitle?.text ?? "",
    editMode,
    () => handleSave(),
  );

  // API Mutations using our custom hook
  const { mutate: updateTitle, isLoading: isUpdating } = useApiMutation(
    (apiClient, data: { dto: ProjectTitleRequestDTO }) =>
      apiClient.projectTitles_UpdateTitle(projectId, data.dto),
    {
      onSuccess: () => {
        setEditMode(false);
        onProjectUpdate();
      },
    },
  );

  const { mutate: deleteTitle, isLoading: isDeleting } = useApiMutation(
    (apiClient, data: { id: string }) =>
      apiClient.projectTitles_DeleteTitle(projectId, data.id),
    {
      onSuccess: () => {
        setDeleteOpen(false);
        setEditMode(false);
        // Switch to another available title
        const remaining = titles.filter((t) => t.id !== currentTitle?.id);
        setSelectedType(remaining[0]?.type ?? TitleType.Primary);
        onProjectUpdate();
      },
    },
  );

  // Handlers
  const handleSave = () => {
    const error = getLanguageValidationError(editLanguage);
    if (error) {
      setLangError(error);
      return;
    }
    updateTitle({
      dto: new ProjectTitleRequestDTO({
        type: selectedType,
        text: editText,
        language:
          editLanguage === "" ? undefined : new Language({ id: editLanguage }),
      }),
    });
  };

  const handleDelete = () => {
    if (currentTitle) {
      deleteTitle({ id: currentTitle.id });
    }
  };

  // Effects
  useEffect(() => {
    if (editMode && currentTitle) {
      setEditLanguage(currentTitle.language?.id || "");
    }
  }, [editMode, currentTitle]);

  useEffect(() => {
    setLangError(getLanguageValidationError(editLanguage));
  }, [editLanguage, getLanguageValidationError]);

  // Auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (editMode && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editText, editMode]);

  const isLoading = isUpdating || isDeleting;

  // Render logic
  if (!isAdmin || !editMode) {
    return (
      <div className="group/cardHeader relative flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col">
          <CardTitle className="text-3xl/8 font-bold tracking-tight sm:text-4xl/10 md:text-5xl/14">
            {currentTitle?.text ?? "No Title Available"}
          </CardTitle>
          {titles.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Select
                value={selectedType}
                onValueChange={(v) => setSelectedType(v as TitleType)}
              >
                <SelectTrigger className="h-8 w-[120px] border-gray-100 bg-white/70 text-sm shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TitleType)
                    .filter((type) =>
                      titles.some((t) => t.type === type && !t.end_date),
                    )
                    .map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {currentTitle?.language?.id && (
                <span className="inline-block max-w-[200px] truncate rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">
                  Lang:{" "}
                  {getLanguageName(currentTitle.language.id.toLowerCase()) ||
                    currentTitle.language.id.toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>
        {isAdmin && (
          <div className="flex flex-shrink-0 gap-2">
            <Button
              className="invisible group-hover/cardHeader:visible"
              variant="outline"
              size="sm"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" /> Add New
            </Button>
            <Button
              className="invisible group-hover/cardHeader:visible"
              variant="outline"
              size="sm"
              onClick={() => setEditMode(true)}
            >
              <Edit className="mr-1 h-4 w-4" /> Edit
            </Button>
          </div>
        )}
        <CreateTitleDialog
          isOpen={isCreateOpen}
          setOpen={setCreateOpen}
          projectId={projectId}
          existingTitles={titles}
          onProjectUpdate={onProjectUpdate}
          onSuccess={(newType) => setSelectedType(newType)}
        />
      </div>
    );
  }

  // Edit Mode View
  return (
    <div className="flex w-full flex-col">
      <Textarea
        ref={textareaRef}
        rows={1}
        value={editText}
        autoFocus
        onChange={handleTextChange}
        className="w-full resize-none overflow-hidden bg-white font-bold tracking-tight sm:text-4xl/10 md:text-5xl/14"
        placeholder="Enter project title"
      />
      <div className="mt-2 flex items-start gap-2">
        <label className="min-w-fit pt-2 text-sm font-medium text-gray-700">
          Language:
        </label>
        <div className="max-w-xs flex-1">
          <LanguageInput
            value={editLanguage}
            onChange={setEditLanguage}
            error={langError}
            className="h-8 w-full"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isLoading || !!langError}
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
          }}
          disabled={isLoading}
        >
          <X size={16} className="mr-1" /> Cancel
        </Button>
      </div>
      <DeleteTitleDialog
        isOpen={isDeleteOpen}
        setOpen={setDeleteOpen}
        title={currentTitle}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}

// Sub-component for the Create Title Dialog
function CreateTitleDialog({
  isOpen,
  setOpen,
  projectId,
  existingTitles,
  onProjectUpdate,
  onSuccess,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  projectId: string;
  existingTitles: ProjectTitleResponseDTO[];
  onProjectUpdate: () => void;
  onSuccess: (newType: TitleType) => void;
}) {
  // Language context for validation
  const { getLanguageValidationError } = useLanguage();

  const [type, setType] = useState<TitleType>(TitleType.Primary);
  const [language, setLanguage] = useState("");
  const [text, setText] = useState("");
  const [langError, setLangError] = useState<string | null>(null);

  const availableTypes = Object.values(TitleType).filter(
    (t) => !existingTitles.some((et) => et.type === t && !et.end_date),
  );

  const { mutate: createTitle, isLoading } = useApiMutation(
    (apiClient, data: { dto: ProjectTitleRequestDTO }) =>
      apiClient.projectTitles_UpdateTitle(projectId, data.dto),
    {
      onSuccess: () => {
        setOpen(false);
        onProjectUpdate();
        onSuccess(type);
        // Reset form
        setText("");
        setLanguage("");
      },
    },
  );

  const handleCreate = () => {
    const error = getLanguageValidationError(language);
    if (error) {
      setLangError(error);
      return;
    }
    createTitle({
      dto: new ProjectTitleRequestDTO({
        type,
        text,
        language: language === "" ? undefined : new Language({ id: language }),
      }),
    });
  };

  useEffect(() => {
    setLangError(getLanguageValidationError(language));
  }, [language, getLanguageValidationError]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Title</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Title Type</label>
            <Select value={type} onValueChange={(v) => setType(v as TitleType)}>
              <SelectTrigger>
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
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Title Text</label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the title text..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isLoading || !text.trim() || !!langError}
          >
            <Plus size={16} className="mr-1" /> Add Title
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Sub-component for the Delete Title Dialog
function DeleteTitleDialog({
  isOpen,
  setOpen,
  title,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  title?: ProjectTitleResponseDTO;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  if (!title) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-6 w-6" />
            Delete Title
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete this title? This action is
            irreversible.
          </p>
          <div className="bg-muted mt-4 rounded-lg border p-3 text-sm">
            <p>
              <strong>Type:</strong> {title.type}
            </p>
            <p>
              <strong>Text:</strong> "{title.text}"
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
