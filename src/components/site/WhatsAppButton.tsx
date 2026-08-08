import { hasWhatsApp, whatsappLink } from "@/data/catalog";

export function WhatsAppButton() {
  if (!hasWhatsApp) return null;

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-0 sm:right-[max(1.5rem,env(safe-area-inset-right))] sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <span className="pointer-events-none mr-0 max-w-0 overflow-hidden rounded-sm bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:max-w-[15rem] group-hover:opacity-100 group-focus-visible:mr-2 group-focus-visible:max-w-[15rem] group-focus-visible:opacity-100">
        <span className="block px-3 py-2 text-xs font-medium whitespace-nowrap">
          Chat with us on WhatsApp
        </span>
      </span>
      <span
        className="grid h-13 w-13 place-items-center rounded-full shadow-[0_10px_30px_-8px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#FFFFFF" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.116-.199.058-.372-.03-.52-.087-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.03-1.378l-.36-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884zM20.463 3.488A11.78 11.78 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.87 11.87 0 005.74 1.463h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0020.463 3.488z" />
        </svg>
      </span>
    </a>
  );
}
