/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { DashboardCardProps } from "@/components/dashboardCard";
import { JSX } from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";

interface DashboardListViewProps {
  data?: DashboardCardProps[];
}

const DashboardListView = ({ data }: DashboardListViewProps): JSX.Element => {
  return (
    <div className="items-center">
      <Accordion type="single" collapsible className="w-full">
        {data?.map((rowProps) => (
        <AccordionItem value={rowProps.project.id}>
          <AccordionTrigger>{rowProps.project.title}</AccordionTrigger>
          <AccordionContent>
            <div className="flex h-5 items-center space-x-10 ml-3 text-sm">
                <h3 className="font-semibold">Roles</h3>
                <p>{rowProps.role}</p>
            </div>
              <div className="flex h-5 items-center space-x-4 mt-2 text-sm ml-3">
                  <h3 className="font-semibold">Start Date</h3>
                  <p>{rowProps.project.start_date?.toDateString()}</p>
                  <h3 className="font-semibold">End Date</h3>
                  <p>{rowProps.project.end_date?.toDateString()}</p>
              </div>
          </AccordionContent>
        </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
};

export default DashboardListView;
