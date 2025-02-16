import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { spaceCategories } from "@shared/schema";
import type { SpaceFilters } from "@shared/schema";

interface FilterAccordionProps {
  filters: SpaceFilters;
  onChange: (filters: SpaceFilters) => void;
}

export function FilterAccordion({ filters, onChange }: FilterAccordionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Accordion type="single" collapsible className="bg-card rounded-lg shadow-lg">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 rounded-t-lg">
            <span className="text-lg">✨ Filters</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => onChange({ ...filters, category: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(spaceCategories).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Space Type</label>
                <Select
                  value={filters.spaceType}
                  onValueChange={(value) => onChange({ ...filters, spaceType: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="model">🤖 Model</SelectItem>
                    <SelectItem value="dataset">📚 Dataset</SelectItem>
                    <SelectItem value="app">📱 Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">SDK</label>
                <Select
                  value={filters.sdkType}
                  onValueChange={(value) => onChange({ ...filters, sdkType: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select SDK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gradio">🎨 Gradio</SelectItem>
                    <SelectItem value="streamlit">📊 Streamlit</SelectItem>
                    <SelectItem value="docker">🐳 Docker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}