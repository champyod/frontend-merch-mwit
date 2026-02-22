"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { cn } from "@/lib/utils"; // Assuming this utility exists for tailwind-merge
import { Button } from "@/components/ui/primitives"; // Using our primitive Button
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // Assuming these exist
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Assuming these exist

interface SelectOption {
  value: string | number;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  noResultsText?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  noResultsText = "No option found.",
  searchPlaceholder = "Search options...",
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const t = useIntlayer("admin"); // Using admin locale for generic texts

  // Find the selected option's label
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3 py-2 text-sm border-white/10 text-white"
          disabled={disabled}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-[#0a2735] border border-white/10 text-white">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{noResultsText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // Use label for searchability
                  onSelect={(currentLabel) => {
                    // Find the original value by label
                    const selectedOption = options.find(opt => opt.label.toLowerCase() === currentLabel.toLowerCase());
                    onValueChange(selectedOption ? selectedOption.value : "");
                    setOpen(false);
                  }}
                  className="aria-selected:bg-white/10 hover:bg-white/5 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
