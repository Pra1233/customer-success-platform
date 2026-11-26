"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Customer, CustomerCreatePayload, CustomerStatus } from "@/types/customer";

interface CustomerFormProps {
  mode: "create" | "edit";
  initial?: Customer;
  isSubmitting: boolean;
  onSubmit: (payload: CustomerCreatePayload) => void;
}

const STATUS_OPTIONS: CustomerStatus[] = ["prospect", "active", "churned"];

export function CustomerForm({ mode, initial, isSubmitting, onSubmit }: CustomerFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [status, setStatus] = useState<CustomerStatus>(initial?.status ?? "prospect");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      company: company || undefined,
      email: email || undefined,
      phone: phone || undefined,
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        id="company"
        label="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input id="phone" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Select
        id="status"
        label="Status"
        className="capitalize"
        value={status}
        onChange={(e) => setStatus(e.target.value as CustomerStatus)}
        required
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
      <Button type="submit" isLoading={isSubmitting}>
        {mode === "create" ? "Create customer" : "Save changes"}
      </Button>
    </form>
  );
}
