/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { useState, useEffect } from "react";

/**
 * Custom hook to manage text editing with auto-resize functionality
 * @param initialValue The initial text value
 * @param currentValue The current text value from props (to sync with)
 * @param isEditMode Whether the field is in edit mode
 * @param onSave Callback to save the edited text
 */
export function useEditableText(
  initialValue: string,
  currentValue: string,
  isEditMode: boolean,
  onSave: (value: string) => void,
) {
  const [editedText, setEditedText] = useState(initialValue);

  // Reset text when leaving edit mode or when current value changes
  useEffect(() => {
    if (!isEditMode) {
      setEditedText(currentValue);
    }
  }, [currentValue, isEditMode]);

  // Handlers
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
  };

  const handleSave = () => {
    onSave(editedText);
  };

  const handleCancel = () => {
    // Reset to current value
    setEditedText(currentValue);
    return currentValue;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return {
    editedText,
    setEditedText,
    handleTextChange,
    handleSave,
    handleCancel,
    handleKeyDown,
  };
}

/**
 * Custom hook to handle text truncation and expansion
 * @param text The full text
 * @param truncateLength The length at which to truncate
 */
export function useTruncatableText(text: string = "", truncateLength: number) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = useState(false);

  // Determine if we need the expand button
  useEffect(() => {
    const characterCount = text.length;
    setShouldShowExpandButton(characterCount > truncateLength);
  }, [text, truncateLength]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return {
    isExpanded,
    shouldShowExpandButton,
    toggleExpand,
  };
}
