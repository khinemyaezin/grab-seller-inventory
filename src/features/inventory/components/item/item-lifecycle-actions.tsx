import { useState } from "react";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@khinemyaezin/seller-ui/components/dialog";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { ItemLifecycleEvent } from "@/features/inventory/types";
import {
  useActivateInventoryMutation,
  useDiscontinueInventoryMutation,
  useSuspendInventoryMutation,
} from "@/features/inventory/hooks/use-items";

export type ItemLifecycleActionsProps = {
  status: string;
  suspendLink?: HateoasLink;
  activateLink?: HateoasLink;
  discontinueLink?: HateoasLink;
  onLifecycleEvent?: (event: ItemLifecycleEvent) => void;
};

type PendingConfirmation = {
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  action: () => Promise<unknown>;
  success: ItemLifecycleEvent["type"];
  failure: ItemLifecycleEvent["type"];
};

export default function ItemLifecycleActions({
  status,
  suspendLink,
  activateLink,
  discontinueLink,
  onLifecycleEvent,
}: ItemLifecycleActionsProps) {
  const suspendMutation = useSuspendInventoryMutation();
  const activateMutation = useActivateInventoryMutation();
  const discontinueMutation = useDiscontinueInventoryMutation();
  const [confirmation, setConfirmation] = useState<PendingConfirmation | null>(null);

  const run = async (
    action: () => Promise<unknown>,
    success: ItemLifecycleEvent["type"],
    failure: ItemLifecycleEvent["type"],
  ) => {
    try {
      await action();
      onLifecycleEvent?.({ type: success } as ItemLifecycleEvent);
    } catch {
      onLifecycleEvent?.({ type: failure } as ItemLifecycleEvent);
    }
  };

  const handleConfirm = () => {
    if (!confirmation) return;
    const { action, success, failure } = confirmation;
    setConfirmation(null);
    void run(action, success, failure);
  };

  return (
    <>
      <ButtonGroup>
        {suspendLink && (
          <Button
            type="button"
            variant="secondary"
            disabled={suspendMutation.isPending}
            onClick={() =>
              setConfirmation({
                title: "Suspend stock item?",
                description: "Suspend selling for this stock item?",
                confirmLabel: "Suspend",
                action: () => suspendMutation.mutateAsync({ link: suspendLink }),
                success: "suspended",
                failure: "suspendFailed",
              })
            }
          >
            <ButtonStatus
              status={suspendMutation.isPending ? "pending" : "idle"}
              pendingLabel="Suspending…"
            >
              Suspend
            </ButtonStatus>
          </Button>
        )}
        {activateLink && (
          <Button
            type="button"
            variant="secondary"
            disabled={activateMutation.isPending}
            onClick={() =>
              run(
                () => activateMutation.mutateAsync({ link: activateLink }),
                "activated",
                "activateFailed",
              )
            }
          >
            <ButtonStatus
              status={activateMutation.isPending ? "pending" : "idle"}
              pendingLabel="Activating…"
            >
              Activate
            </ButtonStatus>
          </Button>
        )}
        {discontinueLink  && (
          <Button
            type="button"
            variant="destructive"
            disabled={discontinueMutation.isPending}
            onClick={() =>
              setConfirmation({
                title: "Discontinue stock item?",
                description:
                  "Permanently discontinue this stock item? Stock operations will be blocked.",
                confirmLabel: "Discontinue",
                destructive: true,
                action: () => discontinueMutation.mutateAsync({ link: discontinueLink }),
                success: "discontinued",
                failure: "discontinueFailed",
              })
            }
          >
            <ButtonStatus
              status={discontinueMutation.isPending ? "pending" : "idle"}
              pendingLabel="Discontinuing…"
            >
              Discontinue
            </ButtonStatus>
          </Button>
        )}
      </ButtonGroup>

      <Dialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmation?.title}</DialogTitle>
            <DialogDescription>{confirmation?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmation(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmation?.destructive ? "destructive" : "default"}
              onClick={handleConfirm}
            >
              {confirmation?.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
