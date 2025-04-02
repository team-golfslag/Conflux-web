import ProjectForm from "@/pageComponents/ProjectForm.tsx";

const NewProject = () => {

    return <ProjectForm title="New project"
                        initialValue={{
                            id: "",
                            title: ""
                        }}
                        onChange={(x) => {console.log(x)}}
                        onSubmit={console.log}
    />
}

export default NewProject