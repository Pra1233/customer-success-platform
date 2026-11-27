import Link from "next/link";

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M16 10H4m0 0 5-5m-5 5 5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface BackLinkProps {
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 font-label text-label-lg text-primary transition-colors hover:text-primary-hover"
    >
      <ArrowLeftIcon className="h-[18px] w-[18px]" />
      {label}
    </Link>
  );
}
