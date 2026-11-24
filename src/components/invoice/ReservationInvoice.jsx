import { CarFront } from "lucide-react";

function MetadataSection({ title, rows }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
      <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </h3>
      <dl className="space-y-1.5">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-baseline justify-between gap-3">
            <dt className="shrink-0 text-[10px] text-slate-500">{label}</dt>
            <dd className="min-w-0 break-all text-right text-[11px] font-semibold text-slate-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function InvoiceHeader({ data }) {
  return (
    <header className="mb-4 flex flex-col gap-4 border-b-2 border-slate-900 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
          <CarFront size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold tracking-tight text-slate-900">{data.brandTitle}</p>
          <p className="mt-0.5 text-[10px] text-slate-500">{data.contact}</p>
        </div>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
          Invoice / Reservation
        </p>
        <p className="mt-1 inline-flex rounded-lg bg-slate-900 px-2.5 py-0.5 text-sm font-bold text-white">
          {data.reservationId}
        </p>
        <p className="mt-1.5 text-[10px] text-slate-500">Issued {data.issueDate}</p>
        <span className="mt-1.5 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
          {data.status}
        </span>
      </div>
    </header>
  );
}

function ChargeSummary({ data }) {
  return (
    <section className="mb-4">
      <h2 className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        Charge Summary
      </h2>
      <table className="w-full table-fixed border-collapse border border-slate-300 text-[11px]">
        <colgroup>
          <col className="w-[50%]" />
          <col className="w-[16%]" />
          <col className="w-[16%]" />
          <col className="w-[18%]" />
        </colgroup>
        <thead>
          <tr className="bg-slate-100 text-[9px] uppercase tracking-wide text-slate-600">
            <th scope="col" className="border-b border-slate-300 px-2 py-1.5 text-left">
              CHARGE / DESCRIPTION
            </th>
            <th scope="col" className="border-b border-slate-300 px-2 py-1.5 text-left">
              RATE
            </th>
            <th scope="col" className="border-b border-slate-300 px-2 py-1.5 text-left">
              UNIT / QTY
            </th>
            <th scope="col" className="border-b border-slate-300 px-2 py-1.5 text-right">
              AMOUNT
            </th>
          </tr>
        </thead>
        <tbody>
          {data.chargeRows.map((row) => (
            <tr key={row.label} className="border-b border-slate-200 last:border-b-0">
              <td className="px-2 py-1.5 text-slate-800">{row.label}</td>
              <td className="px-2 py-1.5 text-slate-600">{row.rate}</td>
              <td className="px-2 py-1.5 text-slate-600">{row.unit}</td>
              <td className="px-2 py-1.5 text-right font-semibold text-slate-900">{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.couponRow && (
        <div className="flex items-center justify-between gap-3 border-x border-b border-slate-300 bg-blue-50 px-2 py-1.5 text-[11px] font-bold text-blue-800">
          <span className="rounded bg-blue-700 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white">
            {data.couponRow.label}
          </span>
          <span>{data.couponRow.amount}</span>
        </div>
      )}
      <div className="flex items-center justify-between bg-slate-900 px-2 py-2 text-xs font-bold text-white">
        <span>TOTAL</span>
        <span>{data.total}</span>
      </div>
    </section>
  );
}

function SignatureFooter({ data }) {
  return (
    <>
      <section className="mb-4 grid gap-4 sm:grid-cols-2">
        {data.signatures.map((signature) => (
          <div key={signature.label}>
            <p className="text-[10px] font-semibold text-slate-700">{signature.label}</p>
            <div className="mt-6 border-b border-dashed border-slate-400" aria-hidden="true" />
            <p className="mt-1.5 text-[9px] text-slate-500">{signature.timestampLabel}</p>
          </div>
        ))}
      </section>
      <footer className="border-t border-slate-200 pt-2 text-[9px] leading-relaxed text-slate-500">
        <p>{data.footer.terms}</p>
        <p className="mt-0.5 font-semibold text-slate-700">{data.footer.thanks}</p>
      </footer>
    </>
  );
}

export default function ReservationInvoice({ data }) {
  return (
    <article
      className="invoice-document mx-auto w-full max-w-[210mm] bg-white p-6 text-slate-900 shadow-sm sm:p-8"
      aria-label="Reservation invoice"
    >
      <InvoiceHeader data={data} />
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="min-w-0 space-y-3">
          {data.leftSections.map((section) => (
            <MetadataSection key={section.title} title={section.title} rows={section.rows} />
          ))}
        </div>
        <div className="min-w-0 space-y-3">
          {data.rightSections.map((section) => (
            <MetadataSection key={section.title} title={section.title} rows={section.rows} />
          ))}
        </div>
      </div>
      <ChargeSummary data={data} />
      <SignatureFooter data={data} />
    </article>
  );
}
