import {Party, Person, Product, Project} from "@/types/models.ts";

export function parseProject(data: Project): Project {
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        // If you want to work with dates as Date objects, you can convert them:
        startDate: data.startDate, // or new Date(data.startDate) if you update the type accordingly
        endDate: data.endDate,     // or new Date(data.endDate)
        people: data.people.map((person: Person): Person => ({
            id: person.id,
            name: person.name,
        })),
        products: data.products.map((product: Product): Product => ({
            id: product.id,
            url: product.url,
            title: product.title,
        })),
        parties: data.parties.map((party: Party): Party => ({
            id: party.id,
            name: party.name,
        })),
    };
}