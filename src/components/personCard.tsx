/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import {Link} from "react-router";
import logo from "@/assets/golfslag.png";
import {Person} from "@/types/person.ts";
import {JSX} from "react";

type PersonCardProps = {
    person: Person
    picture?: JSX.Element
}

/**
 * Person Card component
 * @param props the person to be turned into the card
 */
const PersonCard = ({
                        person
                    }: PersonCardProps) => {
    return (
        <Link
            key={person.id}
            to={`/people/${person.id}`}
            className="border-border my-2 flex max-h-49 rounded-lg border-2 bg-white px-4 py-4 duration-300 hover:cursor-pointer hover:border-purple-700 hover:shadow-lg hover:shadow-gray-300"
        >
            <div className="mx-4 flex w-1/6 justify-center">
                <img
                    className="max-h-full max-w-full rounded-full object-contain"
                    src={logo}
                    alt="logo"
                />
            </div>
            <div className="mx-2 flex w-full flex-col overflow-y-clip p-2">
                <h2 className="mb-3 text-2xl">{person.name}</h2>
            </div>
        </Link>
    );
};

export default PersonCard;
