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

  useEffect(() => {
    isInteractingRef.current = false;
    baselineQtyRef.current = serverQuantity;
    syncDisplayQty(serverQuantity);
    setIsEditing(false);
  }, [productId, syncDisplayQty]);

  useEffect(() => {
    if (isInteractingRef.current || isPending) return;
    baselineQtyRef.current = serverQuantity;
    syncDisplayQty(serverQuantity);
  }, [serverQuantity, isPending, syncDisplayQty]);

  const canDecrease = displayQty > 0 && !disabled && !isPending;

  const commitDelta = useCallback(
    async (delta: number) => {
      if (delta === 0) {
        isInteractingRef.current = false;
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
        isInteractingRef.current = false;
      }
    },
    [onAdjust, syncDisplayQty],
  );

  const beginInteraction = useCallback(() => {
    isInteractingRef.current = true;
  }, []);

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
    if (disabled || isPending) return;
    beginInteraction();
    setEditValue(String(displayQtyRef.current));
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditValue("");
    isInteractingRef.current = false;
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
          disabled={!canDecrease}
          aria-label="Diminuir estoque"
          className="flex h-6 w-6 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40 select-none touch-none"
          onPointerDown={
            canDecrease
              ? (event) => {
                  beginInteraction();
                  minusHold.handlePointerDown(event);
                }
              : undefined
          }
          onPointerUp={canDecrease ? minusHold.handlePointerUp : undefined}
          onPointerCancel={canDecrease ? minusHold.handlePointerUp : undefined}
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
            disabled={disabled || isPending}
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
          disabled={disabled || isPending}
          aria-label="Aumentar estoque"
          className="flex h-6 w-6 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40 select-none touch-none"
          onPointerDown={
            disabled || isPending
              ? undefined
              : (event) => {
                  beginInteraction();
                  plusHold.handlePointerDown(event);
                }
          }
          onPointerUp={disabled || isPending ? undefined : plusHold.handlePointerUp}
          onPointerCancel={disabled || isPending ? undefined : plusHold.handlePointerUp}
        >
          <Plus size={11} />
        </button>
      </div>
    </div>
  );
}
