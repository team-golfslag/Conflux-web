/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { DashboardCardProps } from "@/components/dashboardCard";
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

interface DashboardListViewProps {
  data?: DashboardCardProps[];
}

const DashboardListView = ({ data }: DashboardListViewProps): JSX.Element => {
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
        <Accordion type="single" collapsible className="w-full">
          {data
            ?.slice(count * maxCards, count * maxCards + maxCards)
            .map((rowProps) => (
              <AccordionItem value={rowProps.project.id}>
                <AccordionTrigger>{rowProps.project.title}</AccordionTrigger>
                <AccordionContent className="w-full text-right">
                  <div className="ml-3 flex h-5 items-center space-x-10 text-sm">
                    <h3 className="font-semibold">Roles</h3>
                    <p>{rowProps.role}</p>
                  </div>
                  <div className="mt-2 ml-3 flex h-5 items-center space-x-4 text-sm">
                    <h3 className="font-semibold">Start Date</h3>
                    <p>{rowProps.project.start_date?.toDateString()}</p>
                    <h3 className="font-semibold">End Date</h3>
                    <p>{rowProps.project.end_date?.toDateString()}</p>
                  </div>
                  <Link
                    to={`/projects/${rowProps.project.id}`}
                    className="mr-4"
                  >
                    <Button className="bg-primary right-0 font-semibold">
                      See more
                    </Button>
                  </Link>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
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
