"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

interface SelectMonthProps {
  initialMonth: string;
  initialLine: string;
}

interface Option {
  value: string;
  label: string;
}

const INITIAL_YEAR = 2023;
const LINES: Option[] = [
  { value: "All", label: "All Lines" },
  { value: "[AC1] AZ_CAC01", label: "[AC1] AZ_CAC01" },
  { value: "[AA1] AZ_RAC01", label: "[AA1] AZ_RAC01" },
];

const SelectMonthAndLine: React.FC<SelectMonthProps> = ({
  initialMonth,
  initialLine,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedLine, setSelectedLine] = useState(initialLine);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSelectedMonth(initialMonth);
    setSelectedLine(initialLine);
  }, [initialMonth, initialLine]);

  const updateUrlParams = (month: string, line: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", month);
    params.set("line", line);
    router.push(`/?${params.toString()}`);
  };

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
    updateUrlParams(newMonth, selectedLine);
  };

  const handleLineChange = (newLine: string) => {
    setSelectedLine(newLine);
    updateUrlParams(selectedMonth, newLine);
  };

  const monthOptions = useMemo(() => {
    const options: Option[] = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    for (let year = INITIAL_YEAR; year <= currentYear; year++) {
      const monthLimit = year === currentYear ? currentMonth : 12;
      
      for (let month = 1; month <= monthLimit; month++) {
        const monthString = month.toString().padStart(2, "0");
        const value = `${year}-${monthString}`;
        options.push({ value, label: value });
      }
    }

    return options.reverse();
  }, []);

  return (
    <>
      <Select onValueChange={handleMonthChange} defaultValue={selectedMonth}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a month" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={handleLineChange} value={selectedLine}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a line" />
        </SelectTrigger>
        <SelectContent>
          {LINES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectMonthAndLine;
