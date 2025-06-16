/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

interface CsvExportOptions {
  include_title?: boolean;
  include_description?: boolean;
  include_start_date?: boolean;
  include_end_date?: boolean;
  include_lectorate?: boolean;
  include_owner_organisation?: boolean;
  include_users?: boolean;
  include_contributors?: boolean;
  include_products?: boolean;
  include_organisations?: boolean;
}

interface CsvExportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (options: CsvExportOptions) => void;
  isDownloading?: boolean;
}

const defaultOptions: CsvExportOptions = {
  include_title: true,
  include_description: true,
  include_start_date: true,
  include_end_date: true,
  include_lectorate: false,
  include_owner_organisation: false,
  include_users: false,
  include_contributors: false,
  include_products: false,
  include_organisations: false,
};

const exportOptions = [
  {
    key: "include_title",
    label: "Project Title",
    description: "The main title of the project",
  },
  {
    key: "include_description",
    label: "Description",
    description: "Project description and summary",
  },
  {
    key: "include_start_date",
    label: "Start Date",
    description: "When the project began",
  },
  {
    key: "include_end_date",
    label: "End Date",
    description: "When the project ends/ended",
  },
  {
    key: "include_lectorate",
    label: "Lectorate",
    description: "Associated research group",
  },
  {
    key: "include_owner_organisation",
    label: "Owner Organization",
    description: "Organization that owns the project",
  },
  {
    key: "include_users",
    label: "Users",
    description: "System users associated with the project",
  },
  {
    key: "include_contributors",
    label: "Contributors",
    description: "People who contributed to the project",
  },
  {
    key: "include_products",
    label: "Products",
    description: "Research outputs and deliverables",
  },
  {
    key: "include_organisations",
    label: "All Organizations",
    description: "All organizations involved in the project",
  },
] as const;

export default function CsvExportDialog({
  isOpen,
  onOpenChange,
  onExport,
  isDownloading = false,
}: CsvExportDialogProps) {
  const [options, setOptions] = useState<CsvExportOptions>(defaultOptions);

  const handleOptionToggle = (
    key: keyof CsvExportOptions,
    checked: boolean,
  ) => {
    setOptions((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSelectAll = () => {
    const allSelected = exportOptions.every((option) => options[option.key]);
    const newState = allSelected
      ? {}
      : Object.fromEntries(exportOptions.map((option) => [option.key, true]));
    setOptions(newState as CsvExportOptions);
  };

  const handleExport = () => {
    onExport(options);
  };

  const selectedCount = Object.values(options).filter(Boolean).length;
  const allSelected = exportOptions.every((option) => options[option.key]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Download className="h-5 w-5 text-blue-600" />
            </div>
            Export Projects to CSV
          </DialogTitle>
          <DialogDescription>
            Choose which data fields to include in your CSV export. You can
            customize the export to include only the information you need.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Select All Toggle */}
          <div className="flex items-center space-x-3 border-b border-gray-100 pt-3 pb-4">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
            />
            <Label
              htmlFor="select-all"
              className="mt-1 font-medium text-gray-900"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </Label>
            <span className="text-sm text-gray-500">
              ({selectedCount} of {exportOptions.length} selected)
            </span>
          </div>

          {/* Export Options */}
          <div className="grid gap-4 md:grid-cols-2">
            {exportOptions.map((option) => (
              <div
                key={option.key}
                onClick={() =>
                  handleOptionToggle(option.key, !options[option.key])
                }
                className="flex items-start space-x-3 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <Checkbox
                  id={option.key}
                  checked={options[option.key] || false}
                  onCheckedChange={(checked) =>
                    handleOptionToggle(option.key, checked as boolean)
                  }
                  className="mt-0.5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                />
                <div className="min-w-0 flex-1">
                  <Label
                    htmlFor={option.key}
                    className="cursor-pointer font-medium text-gray-900"
                  >
                    {option.label}
                  </Label>
                  <p className="mt-1 text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {selectedCount === 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                Please select at least one field to include in the export.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDownloading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedCount === 0 || isDownloading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isDownloading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export CSV ({selectedCount} fields)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
