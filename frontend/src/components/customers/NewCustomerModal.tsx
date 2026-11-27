"use client";

import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastProvider";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createCustomer } from "@/store/slices/customersSlice";
import type { CustomerCreatePayload } from "@/types/customer";

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (customerId: string) => void;
}

export function NewCustomerModal({ isOpen, onClose, onCreated }: NewCustomerModalProps) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.customers.status);
  const { showToast } = useToast();

  async function handleSubmit(payload: CustomerCreatePayload) {
    const result = await dispatch(createCustomer(payload));
    if (createCustomer.fulfilled.match(result)) {
      showToast("Customer created successfully.", "success");
      onCreated?.(result.payload.id);
      onClose();
    } else {
      showToast((result.payload as string) ?? "Failed to create customer.", "error");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New customer">
      <CustomerForm mode="create" isSubmitting={status === "loading"} onSubmit={handleSubmit} />
    </Modal>
  );
}
