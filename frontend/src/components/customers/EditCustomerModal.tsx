"use client";

import { Modal } from "@/components/ui/Modal";
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

  async function handleSubmit(payload: CustomerCreatePayload) {
    const result = await dispatch(updateCustomer({ id: customer.id, payload }));
    if (updateCustomer.fulfilled.match(result)) {
      onClose();
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
