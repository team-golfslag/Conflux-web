/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Project } from "@/types/project.ts";
import LabeledInput from "@/pageComponents/LabeledInput.tsx";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import LabeledTextarea from "@/pageComponents/LabeledTextarea.tsx";
import LabeledDatePicker from "@/pageComponents/LabeledDatePicker.tsx";
import PersonCard from "@/components/personCard.tsx";
import { PersonSelect } from "@/components/personSelect.tsx";

type ProjectFormProps = {
  initialValue?: Project;
  onChange?: (newProject: Project) => void;
  onSubmit: (newProject: Project) => void;
  disabled?: boolean;
  title?: string;
};

const ProjectForm = ({
  initialValue,
  onChange,
  onSubmit,
  disabled,
}: ProjectFormProps) => {
  const [currentProject, setCurrentProject] = useState<Project>(
    initialValue || {
      id: "",
      title: "",
    },
  );

  useEffect(() => {
    if (initialValue) setCurrentProject(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (onChange) onChange(currentProject);
  }, [currentProject, onChange]);

  return (
    <div className="flex justify-between">
      <div className="bg-Item-Background my-4 flex min-h-screen w-1/2 flex-col">
        <form className="space-y-4" action={() => onSubmit(currentProject)}>
          <LabeledInput
            label="Title:"
            placeholder="Project title..."
            value={currentProject.title}
            onChange={(e) => {
              setCurrentProject((old: Project) => ({
                ...old,
                title: e.target.value,
              }));
            }}
            disabled={disabled}
          />

          <LabeledTextarea
            label="Description:"
            placeholder="Project Description..."
            value={currentProject.description}
            onChange={(e) => {
              setCurrentProject((old: Project) => ({
                ...old,
                description: e.target.value,
              }));
            }}
            disabled={disabled}
          />

          <div className="flex w-full flex-row flex-wrap gap-y-4">
            <div className="min-w-1/2">
              <LabeledDatePicker
                label="Start date:"
                value={currentProject.start_date}
                onChange={(startDate) => {
                  setCurrentProject((old: Project) => ({
                    ...old,
                    start_date: startDate,
                  }));
                }}
                disabled={disabled}
              />
            </div>
            <div className="min-w-1/2">
              <LabeledDatePicker
                label="End date:"
                value={currentProject.end_date}
                onChange={(endDate) => {
                  setCurrentProject((old: Project) => ({
                    ...old,
                    end_date: endDate,
                  }));
                }}
                disabled={disabled}
              />
            </div>
          </div>

          <Button disabled={disabled}>Submit</Button>
        </form>
      </div>
      <div
        id="contributor-container"
        className="border-borderpx-4 m-2 flex h-100 w-1/5 flex-col overflow-y-scroll rounded-lg border-2 bg-white p-4 py-4"
      >
        {currentProject.people?.map((person) => <PersonCard person={person} />)}
        <PersonSelect />
      </div>
    </div>
  );
};

export default ProjectForm;
