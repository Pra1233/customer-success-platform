"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { SVGProps } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { InteractionList } from "@/components/interactions/InteractionList";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCustomer, fetchCustomer } from "@/store/slices/customersSlice";
import { fetchInteractions } from "@/store/slices/interactionsSlice";

const EditCustomerModal = dynamic(
  () => import("@/components/customers/EditCustomerModal").then((m) => m.EditCustomerModal),
  { ssr: false }
);
const NewInteractionModal = dynamic(
  () => import("@/components/interactions/NewInteractionModal").then((m) => m.NewInteractionModal),
  { ssr: false }
);

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M3 5h14v10H3V5Zm0 0 7 6 7-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M5 3h3l1.5 4-2 1.5a9 9 0 0 0 4 4l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A14 14 0 0 1 3.5 4.6 1.5 1.5 0 0 1 5 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuildingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M4 17V4h8v13M4 17h12M12 17V9h4v8M7 7h1M7 10h1M7 13h1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const customer = useAppSelector((state) => state.customers.current);
  const interactions = useAppSelector((state) => state.interactions.items);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomer(id));
    dispatch(fetchInteractions({ customer_id: id }));
  }, [dispatch, id]);

  async function handleDelete() {
    if (!confirm("Delete this customer? This cannot be undone from the UI.")) return;
    const result = await dispatch(deleteCustomer(id));
    if (deleteCustomer.fulfilled.match(result)) {
      router.push("/customers");
    }
  }

  if (!customer) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={customer.name} size="lg" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{customer.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              {customer.company && (
                <span className="text-sm text-gray-500">{customer.company}</span>
              )}
              <Badge value={customer.status} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="h-fit lg:col-span-1">
          <p className="mb-1 text-sm font-medium text-gray-700">Details</p>
          <div className="divide-y divide-gray-100">
            <DetailRow icon={BuildingIcon} label="Company" value={customer.company ?? "—"} />
            <DetailRow icon={MailIcon} label="Email" value={customer.email ?? "—"} />
            <DetailRow icon={PhoneIcon} label="Phone" value={customer.phone ?? "—"} />
          </div>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Interactions</h2>
            <Button size="sm" onClick={() => setIsInteractionModalOpen(true)}>
              Log interaction
            </Button>
          </div>
          <Card>
            <InteractionList interactions={interactions} />
          </Card>
        </div>
      </div>

      {isEditOpen && (
        <EditCustomerModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          customer={customer}
        />
      )}
      {isInteractionModalOpen && (
        <NewInteractionModal
          isOpen={isInteractionModalOpen}
          onClose={() => setIsInteractionModalOpen(false)}
          fixedCustomerId={customer.id}
        />
      )}
    </div>
  );
}
