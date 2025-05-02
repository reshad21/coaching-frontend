import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputFieldProps {
  value: string;
  onChange: (searchTerm: string) => void;
  onSearch: (searchTerm: string) => void;
}

export default function SearchInputField({
  value,
  onChange,
  onSearch,
}: SearchInputFieldProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full items-center space-x-0"
    >
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Searching here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-r-none border-r-0 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <Button
        type="submit"
        variant="outline"
        size="icon"
        className="rounded-l-none border-l-0 bg-transparent hover:bg-gray-50"
      >
        <Search className="h-4 w-4 text-gray-500" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
