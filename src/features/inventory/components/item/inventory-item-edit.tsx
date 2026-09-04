import type { ComponentProps, Ref } from "react";
import { useMemo, useState } from "react";
import type { InventoryEditContext, InventoryEditPayload } from "@khinemyaezin/seller-contracts";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { FieldGroup } from "@khinemyaezin/seller-ui/components/field";
import { Skeleton } from "@khinemyaezin/seller-ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@khinemyaezin/seller-ui/components/table";
import { Pencil } from "lucide-react";
import type { InventoryEditWidgetHandle } from "@/features/inventory/hooks/use-inventory-edit-slot";
import { useInventoryEdit } from "@/features/inventory/hooks/use-inventory-edit";
import { StockOperationPopover } from "@/features/inventory/components/stock-operations";
import { LocationPickerDialog } from "./location-picker-dialog";

export type InventoryItemEditProps = {
  context?: InventoryEditContext;
  value?: InventoryEditPayload;
  onChange?: (value: InventoryEditPayload) => void;
  ref?: Ref<InventoryEditWidgetHandle>;
};

function QuantityTrigger({ value, ...props }: ComponentProps<typeof Button> & { value: number }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 min-w-16 justify-start font-normal tabular-nums"
      {...props}
    >
      {value}
    </Button>
  );
}

export default function InventoryItemEdit({ context, value, onChange, ref }: InventoryItemEditProps) {
  const { formValue, isLoading, locations, confirmForItem, applyLocationSelection } = useInventoryEdit({
    context,
    value,
    onChange,
    ref,
  });
  const [pickerOpen, setPickerOpen] = useState(false);
  const selectedIds = useMemo(
    () => formValue?.items.map((item) => item.locationId) ?? [],
    [formValue],
  );

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <FieldGroup className="grid gap-3">
      {locations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No locations available.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>
                  <Button type="button" variant="secondary" size="icon-sm" onClick={() => setPickerOpen(true)}>
                    <Pencil data-icon="inline-end" />
                  </Button>
                </TableHead>
                <TableHead className="text-muted-foreground">On hand</TableHead>
                <TableHead className="text-muted-foreground">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formValue?.items.length ? (
                formValue.items.map((item) => (
                  <TableRow key={item.locationId}>
                    <TableCell className="text-sm">{item.locationName || item.locationId}</TableCell>
                    <TableCell>
                      {item.op === "CREATE" ? (
                        <StockOperationPopover
                          op="CREATE"
                          location={{
                            locationId: item.locationId,
                            locationName: item.locationName,
                          }}
                          value={item.createValues}
                          onConfirm={confirmForItem(item.locationId)}
                          trigger={<QuantityTrigger value={item.onHand} />}
                        />
                      ) : (
                        <StockOperationPopover
                          op="ADJUST"
                          value={item.adjustValues}
                          onConfirm={confirmForItem(item.locationId)}
                          trigger={<QuantityTrigger value={item.onHand} />}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">{item.available}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-sm text-muted-foreground">
                    Choose locations to create or update stock.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <LocationPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        locations={locations}
        selectedIds={selectedIds}
        onApply={(ids) => {
          applyLocationSelection(ids);
          setPickerOpen(false);
        }}
      />
    </FieldGroup>
  );
}
