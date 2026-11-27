"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { SVGProps } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
      <path d="M3 5h14v10H3V5Zm0 0 7 6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-container text-secondary-text">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="font-body text-body-sm text-secondary-text">{label}</p>
        <p className="font-label text-label-lg text-on-surface">{value}</p>
      </div>
    </div>
  );
}

const SENTIMENT_ORDER = ["positive", "neutral", "negative"] as const;
const SENTIMENT_DOT: Record<string, string> = {
  positive: "bg-success",
  neutral: "bg-warning",
  negative: "bg-danger",
};
const SENTIMENT_BAR: Record<string, string> = {
  positive: "bg-success",
  neutral: "bg-warning",
  negative: "bg-danger",
};

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

  const sentimentBreakdown = useMemo(() => {
    const counts: Record<string, number> = { positive: 0, neutral: 0, negative: 0 };
    let total = 0;
    for (const interaction of interactions) {
      if (interaction.sentiment) {
        counts[interaction.sentiment] = (counts[interaction.sentiment] ?? 0) + 1;
        total += 1;
      }
    }
    return { counts, total };
  }, [interactions]);

  async function handleDelete() {
    if (!confirm("Delete this customer? This cannot be undone from the UI.")) return;
    const result = await dispatch(deleteCustomer(id));
    if (deleteCustomer.fulfilled.match(result)) {
      router.push("/customers");
    }
  }

  if (!customer) {
    return <p className="font-body text-body-md text-secondary-text">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <BackLink href="/customers" label="Customers" />
      <div className="flex flex-col gap-6 rounded-md border border-outline-variant bg-surface p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={customer.name} size="lg" />
          <div>
            <h1 className="font-headline text-headline-md text-on-surface">{customer.name}</h1>
            {customer.company && (
              <p className="font-body text-body-md text-secondary-text">{customer.company}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>
            Edit customer
          </Button>
          <Button
            size="sm"
            onClick={() => setIsInteractionModalOpen(true)}
          >
            New interaction
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <Card className="flex flex-col gap-1">
            <p className="mb-1 font-title text-title-md text-on-surface">Details</p>
            <div className="divide-y divide-outline-variant">
              <DetailRow icon={BuildingIcon} label="Company" value={customer.company ?? "—"} />
              <DetailRow icon={MailIcon} label="Email" value={customer.email ?? "—"} />
              <DetailRow icon={PhoneIcon} label="Phone" value={customer.phone ?? "—"} />
            </div>
          </Card>

          {sentimentBreakdown.total > 0 && (
            <Card className="flex flex-col gap-4">
              <p className="font-title text-title-md text-on-surface">Sentiment Overview</p>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-container">
                {SENTIMENT_ORDER.map((s) => (
                  <div
                    key={s}
                    className={SENTIMENT_BAR[s]}
                    style={{ width: `${(sentimentBreakdown.counts[s] / sentimentBreakdown.total) * 100}%` }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {SENTIMENT_ORDER.map((s) => (
                  <div key={s} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-label text-label-md capitalize text-on-surface">
                      <span className={`h-2.5 w-2.5 rounded-full ${SENTIMENT_DOT[s]}`} />
                      {s}
                    </span>
                    <span className="font-label text-label-md tabular-nums text-secondary-text">
                      {sentimentBreakdown.counts[s]} (
                      {Math.round((sentimentBreakdown.counts[s] / sentimentBreakdown.total) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <section className="flex flex-col gap-4 rounded-md border border-outline-variant bg-surface p-6 shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-md text-on-surface">Interaction History</h2>
            <span className="font-label text-label-md tabular-nums text-secondary-text">
              {interactions.length} recorded interaction{interactions.length === 1 ? "" : "s"}
            </span>
          </div>
          <InteractionList interactions={interactions} />
        </section>
      </div>

      {isEditOpen && (
        <EditCustomerModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} customer={customer} />
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
