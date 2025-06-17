/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, ChevronDown, FileText, Database } from "lucide-react";

interface ExportDropdownProps {
  onCsvExport: () => void;
  onJsonExport: () => void;
  isDownloading?: boolean;
  disabled?: boolean;
}

export default function ExportDropdown({
  onCsvExport,
  onJsonExport,
  isDownloading = false,
  disabled = false,
}: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="flex items-center gap-2"
          disabled={disabled || isDownloading}
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "Downloading..." : "Export"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={onCsvExport}
          disabled={isDownloading}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onJsonExport}
          disabled={isDownloading}
          className="flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
