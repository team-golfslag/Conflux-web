/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { JSX, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { ProjectDTO } from "@team-golfslag/conflux-api-client/src/client";
import ProjectCard from "@/components/projectCard.tsx";
import { CalendarIcon, UsersIcon } from "lucide-react";

export interface DashboardCardProps {
  project: ProjectDTO;
  role: string;
}
interface DashboardListViewProps {
  data?: DashboardCardProps[];
  listView: boolean;
}

const DashboardListView = ({
  data,
  listView,
}: DashboardListViewProps): JSX.Element => {
  const [count, setCount] = useState(0);
  if (data) {
    const maxCards = 20;
    const maxPagin: number = data.length / maxCards - 1;
    const increment = () => {
      if (count < maxPagin) {
        setCount(count + 1);
      }
    };
    const decrement = () => {
      if (count > 0) {
        setCount(count - 1);
      }
    };
    return (
      <div className="items-center">
        {listView ? (
          <Accordion type="single" collapsible className="w-full">
            {data
              ?.slice(count * maxCards, count * maxCards + maxCards)
              .map((rowProps) => (
                <AccordionItem value={rowProps.project.id}>
                  <AccordionTrigger>
                    {rowProps.project.primary_title.text}
                  </AccordionTrigger>
                  <AccordionContent className="flex w-full flex-row text-right">
                    <div className="flex w-full flex-col">
                      <div className="ml-3 flex h-5 items-center space-x-10 text-sm">
                        <UsersIcon
                          size={14}
                          className="mr-2 text-gray-400 group-hover:text-blue-800"
                        />
                        <span className={"text-gray-400"}>
                          {rowProps.project.contributors.length} contributor
                          {rowProps.project.contributors.length !== 1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                      <div className="mt-2 ml-3 flex h-5 items-center space-x-4 text-sm">
                        <CalendarIcon
                          size={14}
                          className="mr-2 text-gray-400 group-hover:text-blue-800"
                        />
                        <span className={"text-gray-400"}>
                          {rowProps.project.start_date.toLocaleDateString()}{" "}
                          {rowProps.project.end_date.toLocaleDateString() !==
                          "Ongoing"
                            ? `- ${rowProps.project.end_date.toLocaleDateString()}`
                            : ": Ongoing"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 text-right">
                      <Link
                        to={`/projects/${rowProps.project.id}`}
                        className="mr-4"
                      >
                        <Button className="bg-primary right-0 font-semibold">
                          See more
                        </Button>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((cardProps, index) => (
              <ProjectCard key={cardProps.project.id || index} {...cardProps} />
            ))}
          </div>
        )}

        <Pagination className="mt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={decrement}
                className={turnOff(count, 0)}
              />
            </PaginationItem>
            <PaginationItem className="pointer-events-none">
              <PaginationLink>
                {count + 1} of {maxPagin + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={increment}
                className={turnOff(count, maxPagin)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  } else {
    return (
      <div>
        <h1>You don't have any projects yet</h1>
      </div>
    );
  }
};

const turnOff = (count: number, turnOffValue: number) => {
  if (count === turnOffValue) {
    return "text-gray-400 pointer-events-none";
  } else {
    return "";
  }
};

export default DashboardListView;
