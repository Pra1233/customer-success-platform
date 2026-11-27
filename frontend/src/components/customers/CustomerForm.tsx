"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Customer, CustomerCreatePayload } from "@/types/customer";

interface CustomerFormProps {
  mode: "create" | "edit";
  initial?: Customer;
  isSubmitting: boolean;
  onSubmit: (payload: CustomerCreatePayload) => void;
}

export function CustomerForm({ mode, initial, isSubmitting, onSubmit }: CustomerFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      company: company || undefined,
      email: email || undefined,
      phone: phone || undefined,
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
      <Button type="submit" isLoading={isSubmitting} className="mt-1">
        {mode === "create" ? "Create customer" : "Save changes"}
      </Button>
    </form>
  );
}
