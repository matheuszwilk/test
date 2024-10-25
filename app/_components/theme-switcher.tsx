"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { CheckIcon, Moon, Palette, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  const isActive = (themeName: string) => {
    return theme === themeName && <CheckIcon className="ml-2 h-6 w-4" />;
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex items-center justify-center rounded-full border-none"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[99998]">
        <DropdownMenuLabel className="text-center">
          Theme Selection
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="border-dotted" />
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && <CheckIcon className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {isActive("dark")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
