import { Card, CardContent, CardHeader } from "@khinemyaezin/seller-ui/components/card";
import ItemTable from "./item-table";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Link } from "react-router";
import ItemsFilter from "./items-filter";
import { useInventoryLink } from "@/features/inventory/hooks/use-root";
import { useItemFilter } from "@/features/inventory/hooks/use-item-filter";

export default function ItemsView() {
  const createItemLink = useInventoryLink("createInventoryItem");
  const { filter, updateCriteria, updatePage } = useItemFilter();

  return (
    <Card >
      <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:flex-1">
          <ItemsFilter onChange={updateCriteria} />
        </div>
        <div className="flex items-center gap-4 self-start sm:self-end">
          {createItemLink && (
            <Button variant="outline" asChild>
              <Link to="new">Add stock item</Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <ItemTable filter={filter} onPageChange={updatePage} />
    </Card>
  );
}
