"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Cpu, Monitor, HardDrive, Globe } from "lucide-react"

const cpus = [
  "Intel Core i3-2100", "Intel Core i3-3220", "Intel Core i3-4130",
  "Intel Core i3-6100", "Intel Core i3-7100", "Intel Core i3-8100",
  "Intel Core i3-9100F", "Intel Core i3-12100F", "Intel Core i3-13100F",
  "Intel Core i3-14100F", "Intel Core i5-2400", "Intel Core i5-2500K",
  "Intel Core i5-3570K", "Intel Core i5-4460", "Intel Core i5-4670K",
  "Intel Core i5-4690K", "Intel Core i5-5675C", "Intel Core i5-6400",
  "Intel Core i5-6600K", "Intel Core i5-7400", "Intel Core i5-7600K",
  "Intel Core i5-8400", "Intel Core i5-8600K", "Intel Core i5-9400F",
  "Intel Core i5-9600K", "Intel Core i5-10400F", "Intel Core i5-11400F",
  "Intel Core i5-12400F", "Intel Core i5-12600K", "Intel Core i5-13400F",
  "Intel Core i5-13600K", "Intel Core i5-14400F", "Intel Core i5-14600K",
  "Intel Core i7-2600K", "Intel Core i7-2700K", "Intel Core i7-3770K",
  "Intel Core i7-4770K", "Intel Core i7-4790K", "Intel Core i7-5775C",
  "Intel Core i7-6700K", "Intel Core i7-7700K", "Intel Core i7-8700K",
  "Intel Core i7-9700K", "Intel Core i7-10700K", "Intel Core i7-11700K",
  "Intel Core i7-12700K", "Intel Core i7-13700K", "Intel Core i7-14700K",
  "Intel Core i9-10900K", "Intel Core i9-11900K", "Intel Core i9-12900K",
  "Intel Core i9-13900K", "Intel Core i9-13900KS", "Intel Core i9-14900K",
  "Intel Core i9-14900KS", "Intel Core Ultra 5 225H", "Intel Core Ultra 7 265K",
  "Intel Core Ultra 9 285K",
  "AMD Ryzen 3 1200", "AMD Ryzen 3 1300X", "AMD Ryzen 3 2200G",
  "AMD Ryzen 3 3200G", "AMD Ryzen 3 3100", "AMD Ryzen 3 3300X",
  "AMD Ryzen 5 1400", "AMD Ryzen 5 1500X", "AMD Ryzen 5 1600",
  "AMD Ryzen 5 1600X", "AMD Ryzen 5 2600", "AMD Ryzen 5 2600X",
  "AMD Ryzen 5 3400G", "AMD Ryzen 5 3600", "AMD Ryzen 5 5600",
  "AMD Ryzen 5 5600X", "AMD Ryzen 5 7500F", "AMD Ryzen 5 7600",
  "AMD Ryzen 5 7600X", "AMD Ryzen 5 8400F", "AMD Ryzen 5 9600X",
  "AMD Ryzen 7 1700", "AMD Ryzen 7 1700X", "AMD Ryzen 7 1800X",
  "AMD Ryzen 7 2700", "AMD Ryzen 7 2700X", "AMD Ryzen 7 3700X",
  "AMD Ryzen 7 5700X", "AMD Ryzen 7 5700X3D", "AMD Ryzen 7 5800X",
  "AMD Ryzen 7 5800X3D", "AMD Ryzen 7 7700", "AMD Ryzen 7 7700X",
  "AMD Ryzen 7 7800X3D", "AMD Ryzen 7 8700G", "AMD Ryzen 7 9700X",
  "AMD Ryzen 7 9800X3D", "AMD Ryzen 9 3900X", "AMD Ryzen 9 3950X",
  "AMD Ryzen 9 5900X", "AMD Ryzen 9 5950X", "AMD Ryzen 9 7900",
  "AMD Ryzen 9 7900X", "AMD Ryzen 9 7950X", "AMD Ryzen 9 7950X3D",
  "AMD Ryzen 9 9900X", "AMD Ryzen 9 9950X",
]

const gpus = [
  "NVIDIA GTX 1050 Ti", "NVIDIA GTX 1060", "NVIDIA GTX 1070",
  "NVIDIA GTX 1080", "NVIDIA GTX 1080 Ti", "NVIDIA GTX 1650",
  "NVIDIA GTX 1650 Super", "NVIDIA GTX 1660", "NVIDIA GTX 1660 Super",
  "NVIDIA GTX 1660 Ti", "NVIDIA RTX 2060", "NVIDIA RTX 2060 Super",
  "NVIDIA RTX 2070", "NVIDIA RTX 2070 Super", "NVIDIA RTX 2080",
  "NVIDIA RTX 2080 Super", "NVIDIA RTX 2080 Ti", "NVIDIA RTX 3050",
  "NVIDIA RTX 3060", "NVIDIA RTX 3060 Ti", "NVIDIA RTX 3070",
  "NVIDIA RTX 3070 Ti", "NVIDIA RTX 3080", "NVIDIA RTX 3080 Ti",
  "NVIDIA RTX 3090", "NVIDIA RTX 3090 Ti", "NVIDIA RTX 4060",
  "NVIDIA RTX 4060 Ti", "NVIDIA RTX 4070", "NVIDIA RTX 4070 Super",
  "NVIDIA RTX 4070 Ti", "NVIDIA RTX 4070 Ti Super", "NVIDIA RTX 4080",
  "NVIDIA RTX 4080 Super", "NVIDIA RTX 4090", "NVIDIA RTX 4090 D",
  "NVIDIA RTX 5050", "NVIDIA RTX 5060", "NVIDIA RTX 5060 Ti",
  "NVIDIA RTX 5070", "NVIDIA RTX 5070 Ti", "NVIDIA RTX 5080",
  "NVIDIA RTX 5090",
  "AMD RX 570", "AMD RX 580", "AMD RX 590", "AMD RX 5500 XT",
  "AMD RX 5600 XT", "AMD RX 5700", "AMD RX 5700 XT", "AMD RX 6400",
  "AMD RX 6500 XT", "AMD RX 6600", "AMD RX 6600 XT", "AMD RX 6650 XT",
  "AMD RX 6700 XT", "AMD RX 6750 XT", "AMD RX 6800", "AMD RX 6800 XT",
  "AMD RX 6900 XT", "AMD RX 6950 XT", "AMD RX 7600", "AMD RX 7600 XT",
  "AMD RX 7700 XT", "AMD RX 7800 XT", "AMD RX 7900 GRE", "AMD RX 7900 XT",
  "AMD RX 7900 XTX", "AMD RX 9060 XT", "AMD RX 9070", "AMD RX 9070 XT",
  "Intel Arc A580", "Intel Arc A750", "Intel Arc A770", "Intel Arc B580",
  "Intel Arc B570",
]

const storageTypes = ["SSD", "HDD", "NVMe", "SSHD"]
const osOptions = [
  "Windows 11", "Windows 10", "Windows 8.1", "Windows 7",
  "macOS Sequoia", "macOS Sonoma", "macOS Ventura",
  "Ubuntu", "Fedora", "Arch Linux", "SteamOS", "Other",
]

interface Country {
  id: string
  code: string
  name: string
  currency: { id: string; code: string; symbol: string } | null
}

export default function OnboardingPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [step, setStep] = useState<"hardware" | "region">("hardware")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [cpu, setCpu] = useState("")
  const [gpu, setGpu] = useState("")
  const [ramGB, setRamGB] = useState(16)
  const [storageGB, setStorageGB] = useState(512)
  const [storageType, setStorageType] = useState("SSD")
  const [os, setOs] = useState("Windows 11")
  const [customCpu, setCustomCpu] = useState("")
  const [customGpu, setCustomGpu] = useState("")

  const [countries, setCountries] = useState<Country[]>([])
  const [countryId, setCountryId] = useState("")

  const allCpus = [...cpus, "Other (custom)"]
  const allGpus = [...gpus, "Other (custom)"]

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return }
    if (!session?.user) return
    if (session.user.onboarded) { router.push("/dashboard"); return }
  }, [status, session, router])

  useEffect(() => {
    fetch("/api/countries")
      .then((r) => r.json())
      .then((data: Country[]) => setCountries(data))
      .catch(() => {})
  }, [])

  function clearFieldError(field: string) {
    setFieldErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
  }

  function validateHardware(): boolean {
    const errors: Record<string, string> = {}
    if (!cpu) errors.cpu = "Select your CPU"
    if (cpu === "Other (custom)" && !customCpu.trim()) errors.customCpu = "Enter your CPU model"
    if (!gpu) errors.gpu = "Select your GPU"
    if (gpu === "Other (custom)" && !customGpu.trim()) errors.customGpu = "Enter your GPU model"
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleNext() {
    if (validateHardware()) setStep("region")
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-container/50 border-t-primary-container rounded-full animate-spin" />
      </div>
    )
  }

  if (!session?.user || session.user.onboarded) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)

    const resolvedCpu = cpu === "Other (custom)" ? customCpu.trim() : cpu
    const resolvedGpu = gpu === "Other (custom)" ? customGpu.trim() : gpu

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpu: resolvedCpu, gpu: resolvedGpu, ramGB, storageGB, storageType, os, countryId }),
      })

      if (!res.ok) {
        const text = await res.text()
        let msg = "Something went wrong"
        try { msg = JSON.parse(text).error } catch {}
        console.error("Onboarding POST error:", res.status, text)
        setError(msg)
        return
      }

      await update()
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Failed to save. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const selectedCountry = countries.find((c) => c.id === countryId)

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl kinetic-card p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-headline-md">Welcome to FPS</h1>
          <p className="text-body-lg text-on-surface-variant mt-1">Set up your profile to get started</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`flex items-center gap-2 ${step === "hardware" ? "text-primary-container" : "text-on-surface-variant"}`}>
            <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${step === "hardware" ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant"}`}>1</div>
            <span className="text-label-caps">Hardware</span>
          </div>
          <div className="w-8 h-px bg-outline-variant" />
          <div className={`flex items-center gap-2 ${step === "region" ? "text-primary-container" : "text-on-surface-variant"}`}>
            <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${step === "region" ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant"}`}>2</div>
            <span className="text-label-caps">Region</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === "hardware" && (
            <>
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
                  <Cpu className="size-3.5" /> CPU
                </label>
                <select value={cpu} onChange={(e) => { setCpu(e.target.value); clearFieldError("cpu") }} className={`kinetic-input w-full ${fieldErrors.cpu ? "border-error" : ""}`}>
                  <option value="">Select your CPU</option>
                  {allCpus.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {fieldErrors.cpu && <p className="text-xs text-error">{fieldErrors.cpu}</p>}
                {cpu === "Other (custom)" && (
                  <div className="mt-2">
                    <input value={customCpu} onChange={(e) => { setCustomCpu(e.target.value); clearFieldError("customCpu") }} placeholder="Enter CPU model" className={`kinetic-input w-full ${fieldErrors.customCpu ? "border-error" : ""}`} />
                    {fieldErrors.customCpu && <p className="text-xs text-error mt-1">{fieldErrors.customCpu}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
                  <Monitor className="size-3.5" /> GPU
                </label>
                <select value={gpu} onChange={(e) => { setGpu(e.target.value); clearFieldError("gpu") }} className={`kinetic-input w-full ${fieldErrors.gpu ? "border-error" : ""}`}>
                  <option value="">Select your GPU</option>
                  {allGpus.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                {fieldErrors.gpu && <p className="text-xs text-error">{fieldErrors.gpu}</p>}
                {gpu === "Other (custom)" && (
                  <div className="mt-2">
                    <input value={customGpu} onChange={(e) => { setCustomGpu(e.target.value); clearFieldError("customGpu") }} placeholder="Enter GPU model" className={`kinetic-input w-full ${fieldErrors.customGpu ? "border-error" : ""}`} />
                    {fieldErrors.customGpu && <p className="text-xs text-error mt-1">{fieldErrors.customGpu}</p>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-label-caps text-on-surface-variant">RAM</label>
                  <select value={ramGB} onChange={(e) => setRamGB(Number(e.target.value))} className="kinetic-input w-full">
                    {[4, 8, 12, 16, 24, 32, 48, 64, 96, 128].map((gb) => <option key={gb} value={gb}>{gb} GB</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-label-caps text-on-surface-variant">OS</label>
                  <select value={os} onChange={(e) => setOs(e.target.value)} className="kinetic-input w-full">
                    {osOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
                    <HardDrive className="size-3.5" /> Storage Size
                  </label>
                  <select value={storageGB} onChange={(e) => setStorageGB(Number(e.target.value))} className="kinetic-input w-full">
                    {[128, 256, 512, 1024, 2048, 4096].map((gb) => <option key={gb} value={gb}>{gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-label-caps text-on-surface-variant">Storage Type</label>
                  <select value={storageType} onChange={(e) => setStorageType(e.target.value)} className="kinetic-input w-full">
                    {storageTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <button type="button" onClick={handleNext} className="kinetic-btn-primary w-full">
                Next: Region
              </button>
            </>
          )}

          {step === "region" && (
            <>
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
                  <Globe className="size-3.5" /> Region
                </label>
                <select value={countryId} onChange={(e) => setCountryId(e.target.value)} className="kinetic-input w-full appearance-none">
                  <option value="">Auto-detect from IP</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code}){c.currency ? ` ${c.currency.symbol} ${c.currency.code}` : ""}
                    </option>
                  ))}
                </select>
                {selectedCountry?.currency && (
                  <p className="text-xs text-on-surface-variant mt-1">
                    Currency: {selectedCountry.currency.symbol} {selectedCountry.currency.code}
                  </p>
                )}
              </div>

              {(error || fieldErrors.submit) && (
                <div className="rounded-lg bg-error-container/10 border border-error/20 px-4 py-2 text-sm text-error">
                  {fieldErrors.submit || error}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("hardware")} className="kinetic-btn-secondary flex-1">
                  Back
                </button>
                <button type="submit" disabled={saving} className="kinetic-btn-primary flex-1 disabled:opacity-50">
                  {saving ? "Saving..." : "Complete Setup"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
