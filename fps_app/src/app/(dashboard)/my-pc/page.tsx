"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface HardwareData {
  cpu: string
  gpu: string
  ramGB: number
  storageGB: number
  storageType: string
  os: string
}

const cpus = [
  "Intel Core i3-12100F",
  "Intel Core i3-13100F",
  "Intel Core i3-14100F",
  "Intel Core i5-10400F",
  "Intel Core i5-11400F",
  "Intel Core i5-12400F",
  "Intel Core i5-12600K",
  "Intel Core i5-13400F",
  "Intel Core i5-13600K",
  "Intel Core i5-14400F",
  "Intel Core i5-14600K",
  "Intel Core i7-10700K",
  "Intel Core i7-11700K",
  "Intel Core i7-12700K",
  "Intel Core i7-13700K",
  "Intel Core i7-14700K",
  "Intel Core i9-10900K",
  "Intel Core i9-11900K",
  "Intel Core i9-12900K",
  "Intel Core i9-13900K",
  "Intel Core i9-13900KS",
  "Intel Core i9-14900K",
  "Intel Core i9-14900KS",
  "Intel Core Ultra 5 225H",
  "Intel Core Ultra 7 265K",
  "Intel Core Ultra 9 285K",
  "AMD Ryzen 3 3100",
  "AMD Ryzen 3 3300X",
  "AMD Ryzen 5 3600",
  "AMD Ryzen 5 5600",
  "AMD Ryzen 5 5600X",
  "AMD Ryzen 5 7500F",
  "AMD Ryzen 5 7600",
  "AMD Ryzen 5 7600X",
  "AMD Ryzen 5 8400F",
  "AMD Ryzen 5 9600X",
  "AMD Ryzen 7 3700X",
  "AMD Ryzen 7 5700X",
  "AMD Ryzen 7 5700X3D",
  "AMD Ryzen 7 5800X",
  "AMD Ryzen 7 5800X3D",
  "AMD Ryzen 7 7700",
  "AMD Ryzen 7 7700X",
  "AMD Ryzen 7 7800X3D",
  "AMD Ryzen 7 8700G",
  "AMD Ryzen 7 9700X",
  "AMD Ryzen 7 9800X3D",
  "AMD Ryzen 9 3900X",
  "AMD Ryzen 9 3950X",
  "AMD Ryzen 9 5900X",
  "AMD Ryzen 9 5950X",
  "AMD Ryzen 9 7900",
  "AMD Ryzen 9 7900X",
  "AMD Ryzen 9 7950X",
  "AMD Ryzen 9 7950X3D",
  "AMD Ryzen 9 9900X",
  "AMD Ryzen 9 9950X",
]

const gpus = [
  "NVIDIA GTX 1050 Ti",
  "NVIDIA GTX 1060",
  "NVIDIA GTX 1070",
  "NVIDIA GTX 1080",
  "NVIDIA GTX 1080 Ti",
  "NVIDIA GTX 1650",
  "NVIDIA GTX 1650 Super",
  "NVIDIA GTX 1660",
  "NVIDIA GTX 1660 Super",
  "NVIDIA GTX 1660 Ti",
  "NVIDIA RTX 2060",
  "NVIDIA RTX 2060 Super",
  "NVIDIA RTX 2070",
  "NVIDIA RTX 2070 Super",
  "NVIDIA RTX 2080",
  "NVIDIA RTX 2080 Super",
  "NVIDIA RTX 2080 Ti",
  "NVIDIA RTX 3050",
  "NVIDIA RTX 3060",
  "NVIDIA RTX 3060 Ti",
  "NVIDIA RTX 3070",
  "NVIDIA RTX 3070 Ti",
  "NVIDIA RTX 3080",
  "NVIDIA RTX 3080 Ti",
  "NVIDIA RTX 3090",
  "NVIDIA RTX 3090 Ti",
  "NVIDIA RTX 4060",
  "NVIDIA RTX 4060 Ti",
  "NVIDIA RTX 4070",
  "NVIDIA RTX 4070 Super",
  "NVIDIA RTX 4070 Ti",
  "NVIDIA RTX 4070 Ti Super",
  "NVIDIA RTX 4080",
  "NVIDIA RTX 4080 Super",
  "NVIDIA RTX 4090",
  "NVIDIA RTX 4090 D",
  "NVIDIA RTX 5050",
  "NVIDIA RTX 5060",
  "NVIDIA RTX 5060 Ti",
  "NVIDIA RTX 5070",
  "NVIDIA RTX 5070 Ti",
  "NVIDIA RTX 5080",
  "NVIDIA RTX 5090",
  "AMD RX 570",
  "AMD RX 580",
  "AMD RX 590",
  "AMD RX 5500 XT",
  "AMD RX 5600 XT",
  "AMD RX 5700",
  "AMD RX 5700 XT",
  "AMD RX 6400",
  "AMD RX 6500 XT",
  "AMD RX 6600",
  "AMD RX 6600 XT",
  "AMD RX 6650 XT",
  "AMD RX 6700 XT",
  "AMD RX 6750 XT",
  "AMD RX 6800",
  "AMD RX 6800 XT",
  "AMD RX 6900 XT",
  "AMD RX 6950 XT",
  "AMD RX 7600",
  "AMD RX 7600 XT",
  "AMD RX 7700 XT",
  "AMD RX 7800 XT",
  "AMD RX 7900 GRE",
  "AMD RX 7900 XT",
  "AMD RX 7900 XTX",
  "AMD RX 9060 XT",
  "AMD RX 9070",
  "AMD RX 9070 XT",
  "Intel Arc A580",
  "Intel Arc A750",
  "Intel Arc A770",
  "Intel Arc B580",
  "Intel Arc B570",
]

const storageTypes = ["SSD", "HDD", "NVMe", "SSHD"]
const osOptions = [
  "Windows 11",
  "Windows 10",
  "Windows 8.1",
  "Windows 7",
  "macOS Sequoia",
  "macOS Sonoma",
  "macOS Ventura",
  "Ubuntu",
  "Fedora",
  "Arch Linux",
  "SteamOS",
  "Other",
]

export default function MyPCPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState<HardwareData>({
    cpu: "",
    gpu: "",
    ramGB: 16,
    storageGB: 512,
    storageType: "SSD",
    os: "Windows 11",
  })
  const [customCpu, setCustomCpu] = useState("")
  const [customGpu, setCustomGpu] = useState("")

  const allCpus = [...cpus, "Other (custom)"]
  const allGpus = [...gpus, "Other (custom)"]

  function isInList(value: string, list: string[]) {
    return list.includes(value)
  }

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    fetch("/api/hardware")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          const savedCpu = data.cpu || ""
          const savedGpu = data.gpu || ""
          setForm({
            cpu: isInList(savedCpu, allCpus) ? savedCpu : "",
            gpu: isInList(savedGpu, allGpus) ? savedGpu : "",
            ramGB: data.ramGB || 16,
            storageGB: data.storageGB || 512,
            storageType: data.storageType || "SSD",
            os: data.os || "Windows 11",
          })
          if (savedCpu && !isInList(savedCpu, allCpus)) setCustomCpu(savedCpu)
          if (savedGpu && !isInList(savedGpu, allGpus)) setCustomGpu(savedGpu)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError("")
    const payload = {
      ...form,
      cpu: form.cpu === "Other (custom)" ? customCpu : form.cpu,
      gpu: form.gpu === "Other (custom)" ? customGpu : form.gpu,
    }
    try {
      const res = await fetch("/api/hardware", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save")
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } catch {
      setError("Failed to save. Try again.")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">My PC</h1>
        <p className="text-muted-foreground mt-1">Enter your PC specifications to get personalized performance predictions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="cpu" className="text-sm font-medium">CPU</label>
            <select
              id="cpu"
              value={form.cpu}
              onChange={(e) => setForm({ ...form, cpu: e.target.value })}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
            >
              <option value="">Select CPU</option>
              {allCpus.map((cpu) => (
                <option key={cpu} value={cpu}>{cpu}</option>
              ))}
            </select>
            {form.cpu === "Other (custom)" && (
              <input
                value={customCpu}
                onChange={(e) => setCustomCpu(e.target.value)}
                placeholder="Enter your CPU model"
                className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
              />
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="gpu" className="text-sm font-medium">GPU</label>
            <select
              id="gpu"
              value={form.gpu}
              onChange={(e) => setForm({ ...form, gpu: e.target.value })}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
            >
              <option value="">Select GPU</option>
              {allGpus.map((gpu) => (
                <option key={gpu} value={gpu}>{gpu}</option>
              ))}
            </select>
            {form.gpu === "Other (custom)" && (
              <input
                value={customGpu}
                onChange={(e) => setCustomGpu(e.target.value)}
                placeholder="Enter your GPU model"
                className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
              />
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="ram" className="text-sm font-medium">RAM (GB)</label>
            <select
              id="ram"
              value={form.ramGB}
              onChange={(e) => setForm({ ...form, ramGB: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
            >
              {[4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256].map((gb) => (
                <option key={gb} value={gb}>{gb} GB</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="os" className="text-sm font-medium">Operating System</label>
            <select
              id="os"
              value={form.os}
              onChange={(e) => setForm({ ...form, os: e.target.value })}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
            >
              {osOptions.map((os) => (
                <option key={os} value={os}>{os}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="storageGB" className="text-sm font-medium">Storage Size (GB)</label>
            <select
              id="storageGB"
              value={form.storageGB}
              onChange={(e) => setForm({ ...form, storageGB: Number(e.target.value) })}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
            >
              {[128, 256, 512, 1024, 2048, 4096, 8192].map((gb) => (
                <option key={gb} value={gb}>{gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="storageType" className="text-sm font-medium">Storage Type</label>
            <select
              id="storageType"
              value={form.storageType}
              onChange={(e) => setForm({ ...form, storageType: e.target.value })}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
            >
              {storageTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Hardware"}
          </button>
          {saved && (
            <span className="text-sm text-green-500 animate-in fade-in">Saved successfully!</span>
          )}
        </div>
      </form>
    </div>
  )
}
