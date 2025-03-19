export type Project = {
    id: string,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    people: Person[],
    products: Product[],
    parties: Party[]
}

export type Person = {
    id: string,
    name: string
}

export type Party = {
    id: string,
    name: string
}

export type Product = {
    id: string,
    title: string,
    url: string
}
