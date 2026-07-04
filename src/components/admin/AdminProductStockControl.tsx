import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { ADMIN_FONT } from "@/components/admin/AdminLabel";
import { useHoldRepeat } from "@/hooks/useHoldRepeat";

interface AdminProductStockControlProps {
  productId: string;
  quantity: number;
  disabled?: boolean;
  isPending?: boolean;
  onAdjust: (delta: number) => Promise<void>;
}

export default function AdminProductStockControl({
  productId,
  quantity,
  disabled = false,
  isPending = false,
  onAdjust,
}: AdminProductStockControlProps) {
  const serverQuantity = Number.isFinite(quantity) ? quantity : 0;
  const [displayQty, setDisplayQty] = useState(serverQuantity);
  const [isInteracting, setIsInteracting] = useState(false);
  const displayQtyRef = useRef(serverQuantity);
  const baselineQtyRef = useRef(serverQuantity);
  const isInteractingRef = useRef(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const syncDisplayQty = useCallback((next: number) => {
    const normalized = Math.max(0, next);
    displayQtyRef.current = normalized;
    setDisplayQty(normalized);
  }, []);

  const endInteraction = useCallback(() => {
    isInteractingRef.current = false;
    setIsInteracting(false);
  }, []);

  const beginInteraction = useCallback(() => {
    isInteractingRef.current = true;
    setIsInteracting(true);
  }, []);

  useEffect(() => {
    endInteraction();
    baselineQtyRef.current = serverQuantity;
    syncDisplayQty(serverQuantity);
    setIsEditing(false);
  }, [productId, endInteraction, syncDisplayQty]);

  useEffect(() => {
    if (isInteractingRef.current || isPending) return;
    baselineQtyRef.current = serverQuantity;
    syncDisplayQty(serverQuantity);
  }, [serverQuantity, isPending, syncDisplayQty]);

  const controlsLocked = disabled || isPending;
  const minusDisabled = controlsLocked || (displayQty <= 0 && !isInteracting);
  const minusPointerActive = !controlsLocked;

  const commitDelta = useCallback(
    async (delta: number) => {
      if (delta === 0) {
        endInteraction();
        return;
      }

      const rollbackQty = baselineQtyRef.current;

      try {
        await onAdjust(delta);
        baselineQtyRef.current = rollbackQty + delta;
        syncDisplayQty(baselineQtyRef.current);
      } catch {
        syncDisplayQty(rollbackQty);
      } finally {
        endInteraction();
      }
    },
    [onAdjust, syncDisplayQty, endInteraction],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      beginInteraction();
      syncDisplayQty(displayQtyRef.current + direction);
    },
    [beginInteraction, syncDisplayQty],
  );

  const commitSession = useCallback(() => {
    const delta = displayQtyRef.current - baselineQtyRef.current;
    void commitDelta(delta);
  }, [commitDelta]);

  const minusHold = useHoldRepeat({
    onStep: () => {
      if (displayQtyRef.current <= 0) return;
      step(-1);
    },
    onEnd: commitSession,
  });

  const plusHold = useHoldRepeat({
    onStep: () => step(1),
    onEnd: commitSession,
  });

  function startEdit() {
    if (controlsLocked) return;
    beginInteraction();
    setEditValue(String(displayQtyRef.current));
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditValue("");
    endInteraction();
    syncDisplayQty(baselineQtyRef.current);
  }

  async function commitEdit() {
    const parsed = Number.parseInt(editValue, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      cancelEdit();
      toast.error("Informe um estoque válido (0 ou mais).");
      return;
    }

    setIsEditing(false);
    setEditValue("");
    syncDisplayQty(parsed);

    const delta = parsed - baselineQtyRef.current;
    await commitDelta(delta);
  }

  function handleEditKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void commitEdit();
    }
    if (event.key === "Escape") {
      cancelEdit();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span
        style={{
          fontFamily: ADMIN_FONT.mono,
          fontSize: "0.58rem",
          letterSpacing: "0.12em",
          color: "#9A7085",
        }}
      >
        ESTOQUE:
      </span>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          disabled={minusDisabled}
          aria-label="Diminuir estoque"
          className="flex h-6 w-6 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40 select-none touch-none"
          onPointerDown={
            minusPointerActive
              ? (event) => {
                  if (displayQtyRef.current <= 0 && !isInteractingRef.current) return;
                  beginInteraction();
                  minusHold.handlePointerDown(event);
                }
              : undefined
          }
          onPointerUp={minusPointerActive ? minusHold.handlePointerUp : undefined}
          onPointerCancel={minusPointerActive ? minusHold.handlePointerUp : undefined}
        >
          <Minus size={11} />
        </button>

        {isEditing ? (
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            autoFocus
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onBlur={() => void commitEdit()}
            onKeyDown={handleEditKeyDown}
            className="h-6 w-12 border border-primary bg-muted text-center text-sm text-foreground outline-none"
            style={{ fontFamily: ADMIN_FONT.mono }}
            aria-label="Editar quantidade em estoque"
          />
        ) : (
          <button
            type="button"
            disabled={controlsLocked}
            onClick={startEdit}
            className="relative flex h-6 min-w-10 items-center justify-center px-1 text-sm font-semibold text-foreground transition-colors hover:text-primary disabled:opacity-40"
            style={{ fontFamily: ADMIN_FONT.mono }}
            aria-label="Editar estoque"
          >
            {displayQty}
          </button>
        )}

        <button
          type="button"
          disabled={controlsLocked}
          aria-label="Aumentar estoque"
          className="flex h-6 w-6 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40 select-none touch-none"
          onPointerDown={
            minusPointerActive
              ? (event) => {
                  beginInteraction();
                  plusHold.handlePointerDown(event);
                }
              : undefined
          }
          onPointerUp={minusPointerActive ? plusHold.handlePointerUp : undefined}
          onPointerCancel={minusPointerActive ? plusHold.handlePointerUp : undefined}
        >
          <Plus size={11} />
        </button>
      </div>
    </div>
  );
}
