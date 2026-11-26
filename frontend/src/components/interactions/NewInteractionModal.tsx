"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { InteractionForm } from "@/components/interactions/InteractionForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createInteraction } from "@/store/slices/interactionsSlice";
import { fetchCustomers } from "@/store/slices/customersSlice";
import type { InteractionCreatePayload } from "@/types/interaction";

interface NewInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  fixedCustomerId?: string;
  onCreated?: () => void;
}

export function NewInteractionModal({
  isOpen,
  onClose,
  fixedCustomerId,
  onCreated,
}: NewInteractionModalProps) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.interactions.status);
  const customers = useAppSelector((state) => state.customers.items);

  const [selectedCustomerId, setSelectedCustomerId] = useState(fixedCustomerId ?? "");

  useEffect(() => {
    if (!fixedCustomerId) {
      dispatch(fetchCustomers({ limit: 100 }));
    }
  }, [fixedCustomerId, dispatch]);

  async function handleSubmit(payload: InteractionCreatePayload) {
    const result = await dispatch(createInteraction(payload));
    if (createInteraction.fulfilled.match(result)) {
      onCreated?.();
      onClose();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log interaction">
      {!fixedCustomerId && (
        <div className="mb-4">
          <Select
            label="Customer"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a customer
            </option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {selectedCustomerId ? (
        <InteractionForm
          mode="create"
          customerId={selectedCustomerId}
          isSubmitting={status === "loading"}
          onSubmit={handleSubmit}
        />
      ) : (
        <p className="text-sm text-gray-400">Select a customer to continue.</p>
      )}
    </Modal>
  );
}
