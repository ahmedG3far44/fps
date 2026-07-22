import { prisma } from "@/lib/prisma"

export default async function AdminHardwarePage() {
  const hardwareProfiles = await prisma.hardware.findMany({
    orderBy: { lastSyncedAt: "desc" },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hardware Profiles</h1>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted-background">
            <tr>
              <th className="px-4 py-3 text-left font-medium">User ID</th>
              <th className="px-4 py-3 text-left font-medium">CPU</th>
              <th className="px-4 py-3 text-left font-medium">GPU</th>
              <th className="px-4 py-3 text-left font-medium">RAM</th>
              <th className="px-4 py-3 text-left font-medium">Last Synced</th>
            </tr>
          </thead>
          <tbody>
            {hardwareProfiles.map((h) => (
              <tr key={h.id} className="border-b border-border">
                <td className="px-4 py-3 text-muted">{h.userId.slice(0, 8)}...</td>
                <td className="px-4 py-3">{h.cpu || "N/A"}</td>
                <td className="px-4 py-3">{h.gpu || "N/A"}</td>
                <td className="px-4 py-3 text-muted">{h.ramGB ? `${h.ramGB} GB` : "N/A"}</td>
                <td className="px-4 py-3 text-muted">
                  {h.lastSyncedAt ? new Date(h.lastSyncedAt).toLocaleDateString() : "Never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
