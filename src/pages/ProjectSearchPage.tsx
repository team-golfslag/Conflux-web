import Project from "../typing/Project.ts";
import ProjectCard from "../pageComponents/ProjectCard.tsx";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ProjectSearchBar = () => {

    const pro: Project = {
        title: "Hoi",
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Libero tempus sollicitudin ridiculus, cubilia pellentesque vestibulum arcu. Aliquet habitasse curabitur id tincidunt mus a malesuada porta. Dapibus torquent sodales aliquam leo egestas felis. Efficitur montes pellentesque parturient non suspendisse molestie netus magna mus. Ornare convallis pellentesque egestas sem ultrices erat lacinia integer.\n" +
            "\n" +
            "Neque erat posuere maximus suspendisse; amet erat. Montes libero porttitor facilisis porttitor elementum hendrerit non. Interdum vivamus a mus varius adipiscing in lacinia. Ligula id maecenas non; placerat rhoncus dignissim. Rutrum commodo nascetur id consequat litora pharetra vestibulum. Libero quisque in turpis lacinia dolor mattis egestas. Lacinia nascetur magna nibh magnis felis ante. Leo curabitur pharetra feugiat eleifend arcu habitant curabitur efficitur natoque. Iaculis magnis suscipit urna scelerisque blandit conubia felis.\n" +
            "\n" +
            "Ornare venenatis euismod gravida cubilia leo finibus convallis. Lacinia aliquet mattis bibendum ornare fusce maecenas facilisis metus. Condimentum laoreet tincidunt class potenti ex quis, sapien fusce. Proin nisi ante eget volutpat montes nunc. Litora phasellus fames lectus, sociosqu vestibulum ornare odio. Taciti elementum sociosqu curae condimentum efficitur sed per primis. Potenti iaculis urna maecenas natoque morbi suspendisse suscipit porttitor. Nascetur malesuada turpis eros eget ut nullam sodales pulvinar.\n" +
            "\n" +
            "Luctus metus curabitur iaculis ac bibendum varius nascetur. Ridiculus habitant volutpat neque orci sodales venenatis integer massa. Consectetur maximus libero morbi vitae, nec vel. Taciti tincidunt ultricies class tellus dictum arcu; senectus cursus. Amet gravida donec lacinia curae cursus est nulla felis. Facilisi odio enim at ex luctus interdum. Libero nibh libero volutpat ligula quisque duis maximus. Torquent consequat magna inceptos netus hac efficitur aliquet eget. Eros nascetur cubilia posuere libero auctor, euismod odio elit. Pulvinar ultrices imperdiet augue facilisis nulla blandit morbi erat.\n" +
            "\n" +
            "Dapibus cras eu tristique diam suspendisse. Efficitur venenatis donec tincidunt varius faucibus dis sapien blandit tincidunt. Cras quis leo aliquet sed phasellus tincidunt. Nunc ultrices tempus ornare egestas; habitant pellentesque? Torquent suscipit est nibh luctus lacus scelerisque conubia nascetur. Sapien id iaculis praesent hac massa pharetra; eleifend pharetra. Quam faucibus enim netus lobortis; magnis porta felis elit. Faucibus euismod mattis donec nostra aptent.\n" +
            "\n" +
            "Pharetra sem justo eleifend sit sem purus maximus nulla porta. Proin proin vel volutpat aenean, velit eros. Euismod porttitor rutrum fusce justo pellentesque nam. Nullam felis sem lorem himenaeos feugiat per vivamus. Aenean enim facilisi non lacus inceptos laoreet proin nostra. Quisque nunc purus et pellentesque leo phasellus vitae. Fusce libero magna eleifend dis nullam parturient et nibh. Gravida auctor tellus curabitur natoque maximus vulputate integer. Nibh lacinia mus vel vitae est varius venenatis blandit id. Sit aliquam at libero iaculis vel sollicitudin pellentesque luctus.\n" +
            "\n" +
            "Primis turpis turpis velit proin lectus curabitur felis. Ridiculus curabitur risus sit sed consectetur metus. Fringilla pulvinar convallis dictumst; penatibus hendrerit nec. Imperdiet ac lectus lacinia semper volutpat sem fermentum. Porta varius venenatis primis sodales venenatis ultrices facilisis accumsan amet. Justo lacinia turpis natoque; penatibus ligula lacus. Integer dolor dapibus luctus maximus fringilla enim scelerisque consequat magna. Dictum pulvinar inceptos ligula mollis libero. Enim fringilla vulputate cras lectus lobortis eu etiam libero scelerisque. Sed sapien ornare diam platea curabitur facilisi interdum.\n" +
            "\n" +
            "Conubia cubilia lobortis dui montes, leo dis. Cubilia efficitur tempor volutpat; ullamcorper orci fusce. Nec nullam blandit inceptos gravida proin, mollis non vulputate. Suscipit aliquet per auctor sem suscipit dui quisque. Ridiculus molestie volutpat venenatis vitae bibendum felis ipsum neque. Nisi lectus nascetur mus sed netus ornare! Habitant viverra vehicula felis orci sem sit conubia. Convallis mattis metus eleifend elementum tortor egestas.\n" +
            "\n" +
            "Congue metus aliquet pellentesque; auctor curae elit imperdiet turpis. Tristique laoreet senectus morbi venenatis nam? Sollicitudin vehicula habitasse elementum blandit lacinia litora cras. Proin pulvinar molestie lobortis litora malesuada. Id nam sagittis augue habitant dolor. Orci porta libero fames nisl ridiculus. Scelerisque finibus class dapibus ac mus lacus. Dui ultricies nisl purus egestas nibh. Hendrerit laoreet gravida suspendisse convallis penatibus habitasse urna. Auctor netus bibendum praesent tincidunt quam velit vitae.\n" +
            "\n" +
            "Amet vehicula aliquam torquent imperdiet tellus. Pharetra sed in et gravida senectus. Accumsan fringilla montes vitae nec libero. Cubilia scelerisque non auctor nostra molestie est. Mauris facilisi cursus varius tristique vehicula placerat enim. Sociosqu aliquet lobortis tempor adipiscing varius nullam ullamcorper aliquam sagittis. Facilisis velit parturient etiam augue commodo lacus. Amet cubilia a quis conubia parturient mus dolor integer.\n" +
            "\n" +
            "Euismod scelerisque aenean torquent neque ipsum nunc auctor. Class quis dolor himenaeos fermentum lacus. Semper hac tempor potenti hac vivamus eleifend egestas. Nisl aliquam cras nostra euismod sapien turpis platea eu. Erat quis scelerisque mollis; vulputate venenatis mauris accumsan mauris mus. Consequat suscipit volutpat a diam mus varius parturient vivamus. Convallis lacinia amet sodales vitae nostra id metus, feugiat duis? Sociosqu quisque ridiculus diam phasellus praesent vehicula. Pellentesque ipsum accumsan nam integer, nibh viverra donec. Mattis consequat laoreet dolor blandit malesuada per aliquam turpis?\n" +
            "\n" +
            "Dui commodo consectetur tristique consequat nisl consequat malesuada facilisi. Viverra vestibulum viverra phasellus aenean habitant mi. Curabitur vehicula ad auctor tristique nunc volutpat hendrerit suspendisse sapien. Aliquet odio vivamus posuere maximus semper facilisis arcu. Diam finibus dui sagittis lacinia rhoncus ad sit arcu eget. Pharetra tortor bibendum faucibus ligula, mollis sollicitudin. Faucibus aenean porta consectetur class mus turpis phasellus turpis. Mus sociosqu ex nostra cras pellentesque. Torquent conubia hendrerit pellentesque convallis nostra aliquet diam.\n" +
            "\n" +
            "Praesent nostra aptent semper, nisl sollicitudin pharetra praesent. Sit nostra aliquam ridiculus iaculis nullam. Maecenas neque mollis ornare fringilla; mauris non. Varius vel potenti habitant dolor; ornare tempus sagittis. Aliquet laoreet leo quisque inceptos laoreet odio eros blandit. Ullamcorper nunc elementum faucibus convallis a fames ullamcorper.\n" +
            "\n" +
            "Euismod faucibus habitant torquent gravida tristique cursus. Suscipit feugiat viverra, sodales elementum at sollicitudin at. Quisque cursus litora dictum curabitur imperdiet ex in dui cras. Ullamcorper dis nunc sed vehicula volutpat interdum. Natoque tellus maximus fames laoreet eget, dictum lacus maximus auctor. Enim vulputate sapien, potenti gravida nullam venenatis dapibus. Eget cubilia ipsum tempor conubia consequat integer. Blandit penatibus efficitur blandit commodo eleifend mi. Lobortis curabitur augue nec porta ac urna ultricies quis.\n" +
            "\n" +
            "Erat pulvinar penatibus litora; blandit ante ex. Aliquam finibus magna odio odio ullamcorper tincidunt. Vitae suspendisse facilisis ad ultricies porttitor. Vehicula suscipit taciti blandit integer sit eleifend. Risus a cras volutpat adipiscing mollis facilisi. Lorem sodales semper leo neque vehicula commodo. Fermentum neque condimentum tempor dapibus non urna pretium enim. Dis id pellentesque maecenas ac ut. Sodales curabitur vestibulum molestie neque rutrum lacinia mauris integer.",
        id: "09897836754",
        startDate: new Date(2025, 2, 1),
        endDate: new Date(2225, 2, 1)
    }

    return <>
        <div className="flex mb-15">
            <Input className = "w-9/10"type="text" placeholder="Search for any project.." />
            <Button type="submit">Search</Button>
        </div>
        <div>
            <h2 className= "mb-15 text-left text-2xl font-bold">Results:</h2>
            <ProjectCard project={pro}/>
        </div>

    </>
}

export default ProjectSearchBar