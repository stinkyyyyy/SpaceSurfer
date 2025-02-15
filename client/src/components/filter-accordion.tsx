import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SpaceFilters } from "@shared/schema";

interface FilterAccordionProps {
  filters: SpaceFilters;
  onChange: (filters: SpaceFilters) => void;
}

export function FilterAccordion({ filters, onChange }: FilterAccordionProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="filters">
        <AccordionTrigger>Filters</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SDK Type</label>
              <Select
                value={filters.sdkType}
                onValueChange={(value) => onChange({ ...filters, sdkType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SDK" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gradio">Gradio</SelectItem>
                  <SelectItem value="streamlit">Streamlit</SelectItem>
                  <SelectItem value="docker">Docker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Space Type</label>
              <Select
                value={filters.spaceType}
                onValueChange={(value) => onChange({ ...filters, spaceType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="model">Model</SelectItem>
                  <SelectItem value="dataset">Dataset</SelectItem>
                  <SelectItem value="app">Application</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
