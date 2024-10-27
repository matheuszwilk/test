'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select"

interface SelectMonthProps {
  initialMonth: string;
}

const SelectMonth: React.FC<SelectMonthProps> = ({ initialMonth }) => {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const router = useRouter();

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
    router.push(`/products?month=${newMonth}`);
  };

  const generateMonthOptions = () => {
    const options = [];
    const years = [2023, 2024, 2025];
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    for (const year of years) {
      for (const month of months) {
        const value = `${year}-${month}`;
        const label = value;
        options.push({ value, label });
      }
    }

    return options.reverse();
  };

  return (
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
  );
};

export default SelectMonth;
