import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
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
  const [sessionDelta, setSessionDelta] = useState(0);
  const sessionDeltaRef = useRef(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    sessionDeltaRef.current = sessionDelta;
  }, [sessionDelta]);

  useEffect(() => {
    setSessionDelta(0);
    setIsEditing(false);
  }, [productId, quantity]);

  const displayQuantity = Math.max(0, quantity + sessionDelta);
  const canDecrease = displayQuantity > 0 && !disabled && !isPending;

  const commitDelta = useCallback(
    async (delta: number) => {
      if (delta === 0) return;
      setSessionDelta(0);
      await onAdjust(delta);
    },
    [onAdjust],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      setSessionDelta((prev) => {
        const next = prev + direction;
        if (quantity + next < 0) return prev;
        return next;
      });
    },
    [quantity],
  );

  const commitSession = useCallback(() => {
    void commitDelta(sessionDeltaRef.current);
  }, [commitDelta]);

  const minusHold = useHoldRepeat({
    onStep: () => step(-1),
    onEnd: commitSession,
  });

  const plusHold = useHoldRepeat({
    onStep: () => step(1),
    onEnd: commitSession,
  });

  function startEdit() {
    if (disabled || isPending) return;
    setEditValue(String(displayQuantity));
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditValue("");
  }

  async function commitEdit() {
    const parsed = Number.parseInt(editValue, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      cancelEdit();
      toast.error("Informe um estoque válido (0 ou mais).");
      return;
    }

    const delta = parsed - quantity;
    setIsEditing(false);
    setEditValue("");
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
          onPointerDown={canDecrease ? minusHold.handlePointerDown : undefined}
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
            {isPending && sessionDelta === 0 ? (
              <Loader2 size={12} className="animate-spin text-muted-foreground" />
            ) : (
              displayQuantity
            )}
          </button>
        )}

        <button
          type="button"
          disabled={disabled || isPending}
          aria-label="Aumentar estoque"
          className="flex h-6 w-6 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40 select-none touch-none"
          onPointerDown={disabled || isPending ? undefined : plusHold.handlePointerDown}
          onPointerUp={disabled || isPending ? undefined : plusHold.handlePointerUp}
          onPointerCancel={disabled || isPending ? undefined : plusHold.handlePointerUp}
        >
          <Plus size={11} />
        </button>
      </div>
    </div>
  );
}
