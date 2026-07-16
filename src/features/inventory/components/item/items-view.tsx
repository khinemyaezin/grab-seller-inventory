import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
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
    <Card className="gap-3">
      <CardContent className="grid gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="sm:flex-1">
            <ItemsFilter onChange={updateCriteria} />
          </div>
          <div className="flex gap-2 self-start sm:self-end">
            {createItemLink && (
              <Button variant="outline" asChild>
                <Link to="new">Add stock item</Link>
              </Button>
            )}
          </div>
        </div>
        <ItemTable filter={filter} onPageChange={updatePage} />
      </CardContent>
    </Card>
  );
}
