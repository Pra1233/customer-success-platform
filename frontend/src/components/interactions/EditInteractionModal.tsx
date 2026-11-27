"use client";

import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastProvider";
import { InteractionForm } from "@/components/interactions/InteractionForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateInteraction } from "@/store/slices/interactionsSlice";
import type { Interaction, InteractionCreatePayload } from "@/types/interaction";

interface EditInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  interaction: Interaction;
}

export function EditInteractionModal({
  isOpen,
  onClose,
  interaction,
}: EditInteractionModalProps) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.interactions.status);
  const { showToast } = useToast();

  async function handleSubmit(payload: InteractionCreatePayload) {
    const result = await dispatch(updateInteraction({ id: interaction.id, payload }));
    if (updateInteraction.fulfilled.match(result)) {
      showToast("Interaction updated successfully.", "success");
      onClose();
    } else {
      showToast((result.payload as string) ?? "Failed to update interaction.", "error");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit interaction">
      <InteractionForm
        mode="edit"
        initial={interaction}
        isSubmitting={status === "loading"}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}
