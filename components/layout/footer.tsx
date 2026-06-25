import Link from "next/link";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "https://docs.arc.network" },
      { label: "Arc Network", href: "https://www.arc.io" },
      { label: "Faucet", href: "https://faucet.circle.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "ArcScan Explorer", href: "https://testnet.arcscan.app" },
      { label: "Circle", href: "https://www.circle.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border px-4 py-10 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <p className="text-lg font-bold">AgentPulse</p>
          <p className="mt-2 text-sm text-muted">
            Real-time reputation monitoring for the decentralized agent economy.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-success">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-8 text-xs text-muted">
        © {new Date().getFullYear()} AgentPulse. All rights reserved. · Trust
        scores are informational only and not financial advice.
      </p>
    </footer>
  );
}
