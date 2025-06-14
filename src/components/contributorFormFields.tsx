/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import {
  ContributorRoleType,
  ContributorPositionType,
} from "@team-golfslag/conflux-api-client/src/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRoleDisplay } from "@/lib/formatters/roleFormatter";
import { getPositionDisplay } from "@/lib/formatters/positionFormatter";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export interface ContributorFormData {
  name?: string;
  email?: string;
  orcidId?: string;
  roles: ContributorRoleType[];
  position?: ContributorPositionType;
  leader: boolean;
  contact: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

// Validation patterns for form fields
const validationPatterns = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    description: "Valid email address (e.g., user@example.com)",
  },
  orcid: {
    pattern:
      /^(?:https?:\/\/)?(?:www\.)?orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]$|^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/,
    description:
      "Valid ORCID ID (e.g., 0000-0000-0000-0000 or https://orcid.org/0000-0000-0000-0000)",
  },
};

function validateField(field: string, value: string): ValidationError | null {
  if (!value || !value.trim()) {
    // Only validate if field has a value (these are optional fields)
    return null;
  }

  switch (field) {
    case "name":
      if (value.length < 2) {
        return { field, message: "Name must be at least 2 characters long" };
      }
      break;

    case "email":
      if (!validationPatterns.email.pattern.test(value)) {
        return {
          field,
          message: `Invalid email format. ${validationPatterns.email.description}`,
        };
      }
      break;

    case "orcidId":
      if (!validationPatterns.orcid.pattern.test(value)) {
        return {
          field,
          message: `Invalid ORCID format. ${validationPatterns.orcid.description}`,
        };
      }
      break;
  }

  return null;
}

interface ContributorFormFieldsProps {
  formData: ContributorFormData;
  onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrcidIdChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (role: ContributorRoleType) => void;
  onPositionChange: (position: ContributorPositionType) => void;
  onLeaderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrcidAutoFill?: () => Promise<boolean>;
  orcidError?: string | null;
  isEdit?: boolean;
  isConfluxUser?: boolean;
}

export default function ContributorFormFields({
  formData,
  onNameChange,
  onEmailChange,
  onOrcidIdChange,
  onRoleChange,
  onPositionChange,
  onLeaderChange,
  onContactChange,
  onOrcidAutoFill,
  orcidError,
  isEdit = false,
  isConfluxUser = false,
}: Readonly<ContributorFormFieldsProps>) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Validate fields when form data changes
  useEffect(() => {
    const errors: ValidationError[] = [];

    if (touched.name && formData.name) {
      const nameError = validateField("name", formData.name);
      if (nameError) errors.push(nameError);
    }

    if (touched.email && formData.email) {
      const emailError = validateField("email", formData.email);
      if (emailError) errors.push(emailError);
    }

    if (touched.orcidId && formData.orcidId) {
      const orcidError = validateField("orcidId", formData.orcidId);
      if (orcidError) errors.push(orcidError);
    }

    setValidationErrors(errors);
  }, [formData, touched]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onNameChange) {
      onNameChange(e);
      setTouched((prev) => ({ ...prev, name: true }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onEmailChange) {
      onEmailChange(e);
      setTouched((prev) => ({ ...prev, email: true }));
    }
  };

  const handleOrcidIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onOrcidIdChange) {
      onOrcidIdChange(e);
      setTouched((prev) => ({ ...prev, orcidId: true }));
    }
  };

  const getFieldError = (field: string) => {
    return validationErrors.find((error) => error.field === field);
  };

  const idPrefix = isEdit ? "edit-" : "";
  return (
    <div className="grid gap-6 py-6">
      {onNameChange && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor={`${idPrefix}name`}
            className="text-right font-semibold text-gray-700"
          >
            Name
          </Label>
          <div className="col-span-3">
            <Input
              id={`${idPrefix}name`}
              name="name"
              className={`${getFieldError("name") ? "border-red-500 focus:border-red-500" : ""}`}
              value={formData.name}
              onChange={handleNameChange}
              disabled={isConfluxUser}
              placeholder="Enter full name"
            />
            {getFieldError("name") && (
              <p className="mt-1 text-sm text-red-500">
                {getFieldError("name")?.message}
              </p>
            )}
            {isConfluxUser && (
              <div className="mt-1 rounded-md bg-amber-50 p-2 text-xs text-amber-600">
                Name cannot be edited for registered Conflux users
              </div>
            )}
          </div>
        </div>
      )}

      {onEmailChange && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor={`${idPrefix}email`}
            className="text-right font-semibold text-gray-700"
          >
            Email
          </Label>
          <div className="col-span-3">
            <Input
              id={`${idPrefix}email`}
              name="email"
              type="email"
              className={`${getFieldError("email") ? "border-red-500 focus:border-red-500" : ""}`}
              value={formData.email}
              onChange={handleEmailChange}
              disabled={isConfluxUser}
              placeholder="user@example.com"
            />
            {getFieldError("email") && (
              <p className="mt-1 text-sm text-red-500">
                {getFieldError("email")?.message}
              </p>
            )}
            {isConfluxUser && (
              <div className="text-muted-foreground mt-1 text-xs">
                Email cannot be edited for registered Conflux users
              </div>
            )}
          </div>
        </div>
      )}

      {onOrcidIdChange && onOrcidAutoFill && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`${idPrefix}orcidId`} className="text-right">
            ORCID ID
          </Label>
          <div className="col-span-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Input
                id={`${idPrefix}orcidId`}
                name="orcidId"
                className={`flex-1 ${orcidError || getFieldError("orcidId") ? "border-red-500 focus:border-red-500" : ""}`}
                value={formData.orcidId}
                onChange={handleOrcidIdChange}
                placeholder="0000-0000-0000-0000"
                aria-invalid={!!(orcidError || getFieldError("orcidId"))}
                disabled={isConfluxUser}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onOrcidAutoFill}
                      disabled={
                        !formData.orcidId || !onOrcidAutoFill || isConfluxUser
                      }
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Autofill details from ORCID</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {(orcidError || getFieldError("orcidId")) && (
              <div className="text-sm text-red-500">
                {orcidError || getFieldError("orcidId")?.message}
              </div>
            )}
            {formData.orcidId && !getFieldError("orcidId") && !orcidError && (
              <p className="text-xs text-gray-500">
                {validationPatterns.orcid.description}
              </p>
            )}
            {isConfluxUser && (
              <div className="text-muted-foreground text-xs">
                ORCID ID cannot be edited for registered Conflux users
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="pt-2 text-right">Positions</Label>
        <div className="col-span-3 flex flex-wrap gap-2">
          {Object.values(ContributorPositionType).map((position) => {
            const positionDisplay = getPositionDisplay(position);
            return (
              <TooltipProvider key={position}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      key={position}
                      variant={
                        formData.position === position ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => onPositionChange(position)}
                    >
                      {positionDisplay.short}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{positionDisplay.long}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="pt-2 text-right">Roles</Label>
        <div className="col-span-3 flex flex-wrap gap-2">
          {Object.values(ContributorRoleType).map((role) => {
            const roleDisplay = getRoleDisplay(role);
            return (
              <TooltipProvider key={role}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      key={role}
                      variant={
                        formData.roles.includes(role) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => onRoleChange(role)}
                    >
                      {roleDisplay.short}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{roleDisplay.long}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}leader`} className="text-right">
          Leader
        </Label>
        <div className="col-span-3 flex items-center space-x-2">
          <Switch
            id={`${idPrefix}leader`}
            checked={formData.leader}
            onCheckedChange={(checked) => {
              const event = {
                target: { checked },
              } as React.ChangeEvent<HTMLInputElement>;
              onLeaderChange(event);
            }}
          />
          <Label
            htmlFor={`${idPrefix}leader`}
            className="text-muted-foreground text-sm"
          >
            Mark as project lead
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}contact`} className="text-right">
          Contact
        </Label>
        <div className="col-span-3 flex items-center space-x-2">
          <Switch
            id={`${idPrefix}contact`}
            checked={formData.contact}
            onCheckedChange={(checked) => {
              const event = {
                target: { checked },
              } as React.ChangeEvent<HTMLInputElement>;
              onContactChange(event);
            }}
          />
          <Label
            htmlFor={`${idPrefix}contact`}
            className="text-muted-foreground text-sm"
          >
            Mark as project contact
          </Label>
        </div>
      </div>
    </div>
  );
}
