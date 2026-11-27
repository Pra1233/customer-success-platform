"use client";

import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastProvider";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCustomer } from "@/store/slices/customersSlice";
import type { Customer, CustomerCreatePayload } from "@/types/customer";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
}

export function EditCustomerModal({ isOpen, onClose, customer }: EditCustomerModalProps) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.customers.status);
  const { showToast } = useToast();

  async function handleSubmit(payload: CustomerCreatePayload) {
    const result = await dispatch(updateCustomer({ id: customer.id, payload }));
    if (updateCustomer.fulfilled.match(result)) {
      showToast("Customer updated successfully.", "success");
      onClose();
    } else {
      showToast((result.payload as string) ?? "Failed to update customer.", "error");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit customer">
      <CustomerForm
        mode="edit"
        initial={customer}
        isSubmitting={status === "loading"}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}
