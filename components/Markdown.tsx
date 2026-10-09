"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Files for download live in public/files/ and are served at <site>/files/.
// A Markdown link to one of them is shown as a download button:
//   [Workshop program (PDF)](https://<site>/files/program.pdf)
// Content is only rendered in the browser (posts load from Supabase), so
// reading window.location here is safe.
function isSiteFile(href: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const url = new URL(href, window.location.href);
    return (
      url.origin === window.location.origin &&
      /\/files\/[^/]+\.[a-z0-9]+$/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}

const components: Components = {
  a(props) {
    const { node, href, children, ...rest } = props;
    if (href && isSiteFile(href)) {
      return (
        <Button asChild variant="outline" size="sm" className="no-underline!">
          <a {...rest} href={href} download>
            <Download /> {children}
          </a>
        </Button>
      );
    }
    return (
      <a {...rest} href={href}>
        {children}
      </a>
    );
  },
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-hea">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
