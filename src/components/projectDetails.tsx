/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { ProjectDTO } from "@team-golfslag/conflux-api-client/src/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";
import { useState } from "react";
import { EditButton } from "@/components/ui/editButton.tsx";
import { DatePicker } from "@/components/ui/datepicker.tsx";

type ProjectDetailsProps = {
  project: ProjectDTO;
  onSave: (newStartDate?: Date, newEndDate?: Date) => void;
};

const determineStatus = (
  startDate: Date | undefined,
  endDate: Date | undefined,
) => {
  const now = new Date();
  if (!startDate || startDate > now) {
    return "Not started";
  } else if (endDate && endDate < now) {
    return "Ended";
  } else {
    return "Active";
  }
};

export default function ProjectDetails({
  project,
  onSave,
}: Readonly<ProjectDetailsProps>) {
  const [editMode, setEditMode] = useState(false);
  const [editStartDate, setEditStartDate] = useState<Date | undefined>();
  const [editEndDate, setEditEndDate] = useState<Date | undefined>();

  function handleEditClick() {
    setEditMode(true);
  }

  function handleCancelClick() {
    setEditMode(false);
  }

  function handleSaveClick() {
    onSave(editStartDate, editEndDate);
    setEditMode(false);
  }

  return (
    <Card className="">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Project Details</CardTitle>
        {editMode ? (
          <div className="flex gap-1">
            <EditButton handleEditClick={handleSaveClick} editOrSave={"save"} />
            <EditButton
              handleEditClick={handleCancelClick}
              editOrSave={"cancel"}
            />
          </div>
        ) : (
          <EditButton handleEditClick={handleEditClick} />
        )}
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-semibold">Status</h3>
          <p className="text-gray-700">
            {determineStatus(project.start_date, project.end_date)}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Project Lead</h3>
          {/* TODO: make this the actual project lead*/}
          <p className="text-gray-700">Dr. J. Doe</p>
        </div>
        <div>
          <h3 className="font-semibold">Dates</h3>
          <button
            className={editMode ? `` : `hover:bg-blue-100`}
            onClick={handleEditClick}
          >
            <div className="mb-1 flex items-center text-gray-700">
              <span className="w-12 text-start font-medium">Start:</span>
              {editMode ? (
                <DatePicker
                  initialDate={project.start_date}
                  onDateChange={setEditStartDate}
                />
              ) : (
                format(project.start_date ?? "N/A", "d MMMM yyyy")
              )}
            </div>
            <div className="flex items-center text-gray-700">
              <span className="w-12 text-start font-medium">End:</span>
              {editMode ? (
                <DatePicker
                  initialDate={project.end_date}
                  onDateChange={setEditEndDate}
                />
              ) : (
                format(project.end_date ?? "N/A", "d MMMM yyyy")
              )}
            </div>
          </button>
        </div>
        <div>
          <h3 className="font-semibold">Lead Organisation</h3>
          <p className="text-gray-700">
            {/*TODO: make this the actual lead organisation*/}
            {project.organisations.length > 0
              ? project.organisations[0].name
              : "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
