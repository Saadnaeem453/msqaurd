import { useRef } from "react";
import { CATEGORIES } from "../../services/attendee_events.service";
import { ChevronRight } from "lucide-react";

interface CategoryBrowserProps {
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  onSeeAll?: () => void;
}

const CategoryBrowser = ({ activeCategory, onCategoryChange, onSeeAll }: CategoryBrowserProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center gap-4">

      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-secondary/5 border border-secondary/10 text-secondary hover:text-white hover:border-secondary/30"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>


      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="text-primary text-sm font-medium hover:text-primary/80 transition-colors flex-shrink-0 flex items-center gap-1"
        >
          See all <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

export default CategoryBrowser;
