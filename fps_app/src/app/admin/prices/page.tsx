import { prisma } from "@/lib/prisma"

export default async function AdminPricesPage() {
  const prices = await prisma.hardwarePrice.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hardware Prices</h1>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted-background">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Hardware</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Store</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="px-4 py-3">{p.hardwareName}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {p.hardwareType}
                  </span>
                </td>
                <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-muted">{p.store}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
