"use client";

import { Loader, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/app/_components/ui/button";
import { DottedSeparator } from "@/app/_components/dotted-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import Header, {
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  HeaderTitle,
} from "@/app/_components/header";

type View = "table" | "kanban" | "calendar";

export const TaskViewSwitcher = () => {
  const [view, setView] = useState<View>("table");
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  
  const open = () => {
    // Implement open functionality
    console.log("Open new task");
  };

  return (

    <div className="w-full space-y-8 overflow-auto rounded-lg bg-background p-8">
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Gestão de Vendas</HeaderSubtitle>
          <HeaderTitle>Vendas</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <Button
            onClick={open}
            size="sm"
            className="w-full lg:w-auto"
          >
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </HeaderRight>
      </Header>
      <Tabs
      defaultValue={view}
      onValueChange={(value) => setView(value as View)}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger
              className="h-8 w-full lg:w-auto"
              value="table"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full lg:w-auto"
              value="kanban"
            >
              Kanban
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full lg:w-auto"
              value="calendar"
            >
              Calendar
            </TabsTrigger>
          </TabsList>
        </div>
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              {/* Add table content */}
            </TabsContent>  
            <TabsContent value="kanban" className="mt-0">
              {/* Add kanban content */}
            </TabsContent>  
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              {/* Add calendar content */}
            </TabsContent>  
          </>
        )}
      </div>
    </Tabs>
    </div>
    
  );
};

export default TaskViewSwitcher;