/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

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
