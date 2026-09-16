import { useEffect, useState } from "react";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Checkbox } from "@khinemyaezin/seller-ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@khinemyaezin/seller-ui/components/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@khinemyaezin/seller-ui/components/table";
import type { LocationResponse } from "@/features/inventory/types";
import { Card } from "@khinemyaezin/seller-ui/components/index";

export type LocationPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locations: LocationResponse[];
  selectedIds: string[];
  onApply: (selectedIds: string[]) => void;
};

export function LocationPickerDialog({
  open,
  onOpenChange,
  locations,
  selectedIds,
  onApply,
}: LocationPickerDialogProps) {
  const [draftIds, setDraftIds] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (open) {
      setDraftIds(selectedIds);
    }
  }, [open, selectedIds]);

  const toggleDraftLocation = (locationId: string, checked: boolean) => {
    setDraftIds((prev) =>
      checked
        ? prev.includes(locationId) ? prev : [...prev, locationId]
        : prev.filter((id) => id !== locationId),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose locations</DialogTitle>
        </DialogHeader>
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-muted-foreground">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    <label className="flex items-center gap-3 font-medium cursor-pointer">
                      <Checkbox
                        checked={draftIds.includes(location.id)}
                        onCheckedChange={(checked) =>
                          toggleDraftLocation(location.id, checked === true)
                        }
                      />
                      <span>{location.name}</span>
                    </label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={draftIds.length === 0}
            onClick={() => onApply(draftIds)}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
