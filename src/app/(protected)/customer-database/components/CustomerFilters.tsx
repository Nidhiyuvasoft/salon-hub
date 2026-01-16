"use client";

import { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import { CustomerFilters as FilterType } from "../types";

interface CustomerFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onExport: () => void;
  totalCustomers: number;
  customerTags: {
    _id: string;
    name: string;
  }[];
}

const CustomerFilters = ({
  filters,
  onFiltersChange,
  onExport,
  totalCustomers,
  customerTags,
}: CustomerFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleTagToggle = (tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter((id) => id !== tagId)
      : [...filters.tags, tagId];

    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleGenderChange = (value: string) => {
    onFiltersChange({ ...filters, gender: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      searchQuery: "",
      tags: [],
      gender: "",
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    filters.tags.length +
    (filters.gender ? 1 : 0);

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search by name or phone number..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            iconName="Filter"
            iconPosition="left"
            onClick={() => setShowAdvanced((p) => !p)}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Tags */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Customer Tags
              </label>

              {customerTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tags available
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {customerTags.map((tag) => (
                    <label
                      key={tag._id}
                      className="flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-muted transition-smooth cursor-pointer"
                    >
                      <Checkbox
                        checked={filters.tags.includes(tag._id)}
                        onChange={() => handleTagToggle(tag._id)}
                      />
                      <span className="text-sm text-foreground">
                        {tag.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <Select
                label="Gender"
                options={[
                  { value: "", label: "All Genders" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                value={filters.gender}
                onChange={handleGenderChange}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {totalCustomers} customer
              {totalCustomers !== 1 ? "s" : ""}
            </div>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                iconName="X"
                iconPosition="left"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerFilters;
