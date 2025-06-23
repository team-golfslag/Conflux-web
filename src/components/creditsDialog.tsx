/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface CreditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreditsDialog({
  isOpen,
  onOpenChange,
}: CreditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-2xl">Project Credits</h2>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <br />
          <div className="text-gray-600">
            <h3 className="text-xl font-medium">SURF (client):</h3>
            <ul>
              <li>- Eileen Waegemakers</li>
              <li>- Maarten Hoogerwerf</li>
            </ul>
            <br />
            <h3 className="text-xl font-medium">Utrecht University:</h3>
            <ul>
              <li>- Simon van Wageningen (supervisor)</li>
            </ul>
            <br />
            <h3 className="text-xl font-medium">Our Team Golfslag:</h3>
            <ul>
              <li>- Ben Stokmans</li>
              <li>- Geert Haans</li>
              <li>- Lucas Jenkins</li>
              <li>- Max van Gent</li>
              <li>- Max Maes</li>
              <li>- Stefan Herald</li>
              <li>- Dinand Wesdorp</li>
              <li>- Tijmen Vis</li>
            </ul>
            <br />
            <p>
              Special thanks to Luke Bleijenbergh for the logo and the good
              memories.
            </p>
            <p>
              <a
                className="text-gray-500 underline"
                href="https://softwareprojecten.sites.uu.nl/"
              >
                <br />
                More Softwareproject Information
              </a>
            </p>
          </div>
        </DialogDescription>
        <DialogFooter className="flex gap-3 pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
