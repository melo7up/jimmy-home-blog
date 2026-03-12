import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href={SITE_CONFIG.links.github}
              className="text-sm text-muted-foreground hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <Link
              href={SITE_CONFIG.links.twitter}
              className="text-sm text-muted-foreground hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
