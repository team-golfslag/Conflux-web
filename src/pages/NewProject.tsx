/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectForm from "@/pageComponents/ProjectForm.tsx";

const NewProject = () => {
  return (
    <ProjectForm
      title="New project"
      initialValue={{
        id: "",
        title: "",
      }}
      onChange={(x) => {
        console.log(x);
      }}
      onSubmit={console.log}
    />
  );
};

export default NewProject;
