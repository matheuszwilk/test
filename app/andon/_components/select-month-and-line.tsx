'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../_components/ui/select"

interface SelectMonthProps {
  initialMonth: string;
  initialLine: string;
}

const SelectMonthAndLine: React.FC<SelectMonthProps> = ({ initialMonth, initialLine }) => {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedLine, setSelectedLine] = useState(initialLine);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSelectedMonth(initialMonth);
    setSelectedLine(initialLine);
  }, [initialMonth, initialLine]);

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
    const params = new URLSearchParams(searchParams);
    params.set('month', newMonth);
    params.set('line', selectedLine);
    router.push(`/andon?${params.toString()}`);
  };

  const handleLineChange = (newLine: string) => {
    setSelectedLine(newLine);
    const params = new URLSearchParams(searchParams);
    params.set('month', selectedMonth);
    params.set('line', newLine);
    router.push(`/andon?${params.toString()}`);
  };

  const generateMonthOptions = () => {
    const options = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed, add 1 to get the correct month number
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    for (let year = 2023; year <= currentYear; year++) {
      for (let month = 1; month <= (year === currentYear ? currentMonth : 12); month++) {
        const monthString = month.toString().padStart(2, '0');
        const value = `${year}-${monthString}`;
        const label = value;
        options.push({ value, label });
      }
    }

    return options.reverse();
  };

  const lines = [
    { value: "All", label: "All Lines" },
    { value: "[AC1] AZ_CAC01", label: "[AC1] AZ_CAC01" },
    { value: "[AA1] AZ_RAC01", label: "[AA1] AZ_RAC01" },
  ];

  return (
    <>
      <Select onValueChange={handleMonthChange} defaultValue={selectedMonth}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a month" />
        </SelectTrigger>
        <SelectContent>
          {generateMonthOptions().map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={handleLineChange} value={selectedLine}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a line" />
        </SelectTrigger>
        <SelectContent>
          {lines.map((line) => (
            <SelectItem key={line.value} value={line.value}>
              {line.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectMonthAndLine;
