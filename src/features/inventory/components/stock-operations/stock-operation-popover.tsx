import { useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@khinemyaezin/seller-ui/components/popover";
import { Spinner } from "@khinemyaezin/seller-ui/components/spinner";
import StockOperationSwitcher from "./stock-operation-switcher";
import type { LocationValues, StockOperationFormHandle, StockOperationSubmit } from "./types";
import type { AdjustStockFormValues, CreateInventoryItemValues } from "@/features/inventory/types";

type AdjustPopoverProps = {
  op: "ADJUST";
  value?: AdjustStockFormValues;
};

type CreatePopoverProps = {
  op: "CREATE";
  value?: CreateInventoryItemValues;
  location: LocationValues;
};

export type StockOperationPopoverProps = {
  trigger: ReactNode;
  onConfirm: (payload: StockOperationSubmit) => Promise<void>;
} & (AdjustPopoverProps | CreatePopoverProps);

export default function StockOperationPopover(props: StockOperationPopoverProps) {
  const { trigger, onConfirm } = props;
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<StockOperationFormHandle>(null);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setError(null);
    }
  };

  const handleConfirm = async () => {
    const payload = await formRef.current?.submit();
    if (!payload) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      await onConfirm(payload);
      setOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save stock operation");
    } finally {
      setPending(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-96 p-3">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            {props.op === "ADJUST" ? (
              <StockOperationSwitcher
                op="ADJUST"
                formRef={formRef}
                value={props.value}
              />
            ) : (
              <StockOperationSwitcher
                op="CREATE"
                formRef={formRef}
                value={props.value}
                location={props.location}
              />
            )}
            {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
          </div>
          <Button
            type="button"
            size="icon-sm"
            aria-label="Confirm"
            disabled={pending}
            onClick={() => void handleConfirm()}
          >
            {pending ? <Spinner /> : <Check />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
