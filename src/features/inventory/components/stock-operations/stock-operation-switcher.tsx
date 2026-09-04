import { ReactNode, Ref } from "react";
import AdjustStockForm from "./adjust-stock-form";
import CreateStockForm from "./create-stock-form";
import { LocationValues, type StockOperationFormHandle, type StockOperationOp } from "./types";
import { AdjustStockFormValues, CreateInventoryItemValues } from "@/types";

type AdjustProps = {
  op: "ADJUST";
  formRef: Ref<StockOperationFormHandle>;
  value?: AdjustStockFormValues;
};
type CreateProps = {
  op: "CREATE";
  formRef: Ref<StockOperationFormHandle>;
  value?: CreateInventoryItemValues;
  location: LocationValues
};

export type StockOperationSwitcherProps = AdjustProps | CreateProps;

const FORM_FACTORIES = {
  ADJUST: (props: AdjustProps) => (
    <AdjustStockForm key="adjust" ref={props.formRef} value={props.value} />
  ),
  CREATE: (props: CreateProps) => (
    <CreateStockForm
      ref={props.formRef}
      locations={props.location}
      value={props.value}
    />
  ),
} satisfies { [K in StockOperationOp]: (props: Extract<StockOperationSwitcherProps, { op: K }>) => ReactNode };
export default function StockOperationSwitcher(props: StockOperationSwitcherProps) {
  const renderForm = FORM_FACTORIES[props.op] as (p: StockOperationSwitcherProps) => ReactNode;

  return (
    <div className="grid gap-3">
      {renderForm?.(props)}
    </div>
  );
}