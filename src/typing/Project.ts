import {Guid} from "./common.ts";

type Project = {
    id: Guid
    title: string
    description?: string
    startDate?: Date
    endDate?: Date
}

export default Project