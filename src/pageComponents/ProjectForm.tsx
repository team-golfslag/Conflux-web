/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import LabeledInput from "@/pageComponents/LabeledInput.tsx";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import LabeledTextarea from "@/pageComponents/LabeledTextarea.tsx";
import LabeledDatePicker from "@/pageComponents/LabeledDatePicker.tsx";
import { Project } from "@team-golfslag/conflux-api-client/src/client";

type ProjectFormProps = {
  initialValue?: Project;
  onChange?: (newProject: Project) => void;
  onSubmit: (newProject: Project) => void;
  disabled?: boolean;
};

const ProjectForm = ({
  initialValue,
  onChange,
  onSubmit,
  disabled,
}: ProjectFormProps) => {
  const [currentProject, setCurrentProject] = useState<Project>(
    initialValue || new Project(),
  );

  useEffect(() => {
    if (initialValue) setCurrentProject(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (onChange) onChange(currentProject);
  }, [currentProject, onChange]);

  return (
    <div className="bg-Item-Background m-auto my-4 min-h-screen w-1/2">
      <form className="space-y-4" action={() => onSubmit(currentProject)}>
        <LabeledInput
          label="Title:"
          placeholder="Project title..."
          value={currentProject.title}
          onChange={(e) => {
            setCurrentProject(
              (old: Project) =>
                new Project({
                  ...old,
                  title: e.target.value,
                }),
            );
          }}
          disabled={disabled}
        />

        <LabeledTextarea
          label="Description:"
          placeholder="Project Description..."
          value={currentProject.description}
          onChange={(e) => {
            setCurrentProject(
              (old: Project) =>
                new Project({
                  ...old,
                  description: e.target.value,
                }),
            );
          }}
          disabled={disabled}
        />

        <div className="flex w-full flex-row flex-wrap gap-y-4">
          <div className="min-w-1/2">
            <LabeledDatePicker
              label="Start date:"
              value={currentProject.start_date}
              onChange={(startDate) => {
                setCurrentProject(
                  (old: Project) =>
                    new Project({
                      ...old,
                      start_date: startDate,
                    }),
                );
              }}
              disabled={disabled}
            />
          </div>
          <div className="min-w-1/2">
            <LabeledDatePicker
              label="End date:"
              value={currentProject.end_date}
              onChange={(endDate) => {
                setCurrentProject(
                  (old: Project) =>
                    new Project({
                      ...old,
                      end_date: endDate,
                    }),
                );
              }}
              disabled={disabled}
            />
          </div>
        </div>

        <Button disabled={disabled}>Submit</Button>
      </form>
    </div>
  );
};

export default ProjectForm;
