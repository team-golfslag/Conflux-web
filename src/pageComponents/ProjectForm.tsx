import Project from "@/types/Project.ts";
import LabeledInput from "@/pageComponents/LabeledInput.tsx";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import LabeledTextarea from "@/pageComponents/LabeledTextarea.tsx";
import LabeledDatePicker from "@/pageComponents/LabeledDatePicker.tsx";

type ProjectFormProps = {
    title: string
    initialValue?: Project
    onChange?: (newProject: Project) => void
    onSubmit: (newProject: Project) => void
}


const ProjectForm = ({title, initialValue, onChange, onSubmit}: ProjectFormProps) => {

    const [currentProject, setCurrentProject] = useState<Project>(initialValue ? initialValue : {
        id: "",
        title: ""
    })

    useEffect(() => {
        if (onChange)
            onChange(currentProject)

    }, [currentProject, onChange])

    return <>
        <div className="w-screen h-20 bg-primary">
            <h2 className="w-[639px] h-20 justify-center text-accent text-4xl font-bold font-['Work_Sans'] text-center">{title}</h2>
        </div>

        <div className="w-1/2 my-4 bg-Item-Background m-auto min-h-screen">
            <form
                className="space-y-4"
                action={() => onSubmit(currentProject)}>
                <LabeledInput label="Title:"
                              placeholder="Project title..."
                              value={currentProject.title}
                              onChange={(e) => {
                                  setCurrentProject(old => ({...old, title: e.target.value}))
                              }}
                />

                <LabeledTextarea
                    label="Description:"
                    placeholder="Project Description..."
                    value={currentProject.description}
                    onChange={(e) => {
                        setCurrentProject(old => ({...old, description: e.target.value}))
                    }}
                />

                <div className="flex flex-row w-full flex-wrap gap-y-4">
                    <div className="min-w-1/2">
                        <LabeledDatePicker
                            label="Start date:"
                            value={currentProject.startDate}
                            onChange={(startDate) => {
                                setCurrentProject((old) => ({...old, startDate}))
                            }}
                        />
                    </div>
                    <div className="min-w-1/2">
                        <LabeledDatePicker
                            label="End date:"
                            value={currentProject.endDate}
                            onChange={(endDate) => {
                                setCurrentProject((old) => ({...old, endDate}))
                            }}
                        />
                    </div>
                </div>


                <Button>Submit</Button>
            </form>

        </div>
    </>
}

export default ProjectForm