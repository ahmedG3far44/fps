import "dotenv/config"
import path from "path"
import bcrypt from "bcryptjs"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const dbPath = path.resolve(process.cwd(), "dev.db")
process.env.DATABASE_URL = `file:${dbPath}`

const adapter = new PrismaLibSql({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

const ALL_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "SAR", name: "Saudi Riyal", symbol: "SAR" },
  { code: "AED", name: "UAE Dirham", symbol: "AED" },
  { code: "ARS", name: "Argentine Peso", symbol: "AR$" },
  { code: "CLP", name: "Chilean Peso", symbol: "CL$" },
  { code: "COP", name: "Colombian Peso", symbol: "CO$" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
  { code: "QAR", name: "Qatari Riyal", symbol: "QAR" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "KD" },
  { code: "OMR", name: "Omani Rial", symbol: "OMR" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "BD" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "JD" },
  { code: "LBP", name: "Lebanese Pound", symbol: "L£" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "MAD" },
  { code: "TND", name: "Tunisian Dinar", symbol: "DT" },
  { code: "DZD", name: "Algerian Dinar", symbol: "DA" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "RON", name: "Romanian Leu", symbol: "lei" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "KES", name: "Kenyan Shilling", symbol: "Sh" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$U" },
  { code: "PYG", name: "Paraguayan Guarani", symbol: "Gs" },
  { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs" },
]

const currenciesById: Record<string, { id: string; code: string }> = {}

async function seedCurrencies() {
  for (const c of ALL_CURRENCIES) {
    const record = await prisma.currency.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    })
    currenciesById[c.code] = record
  }
}

const ALL_COUNTRIES: { code: string; name: string; currency: string }[] = [
  { code: "US", name: "United States", currency: "USD" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "DE", name: "Germany", currency: "EUR" },
  { code: "FR", name: "France", currency: "EUR" },
  { code: "IT", name: "Italy", currency: "EUR" },
  { code: "ES", name: "Spain", currency: "EUR" },
  { code: "NL", name: "Netherlands", currency: "EUR" },
  { code: "BE", name: "Belgium", currency: "EUR" },
  { code: "AT", name: "Austria", currency: "EUR" },
  { code: "CH", name: "Switzerland", currency: "CHF" },
  { code: "SE", name: "Sweden", currency: "SEK" },
  { code: "NO", name: "Norway", currency: "NOK" },
  { code: "DK", name: "Denmark", currency: "DKK" },
  { code: "FI", name: "Finland", currency: "EUR" },
  { code: "PL", name: "Poland", currency: "PLN" },
  { code: "CZ", name: "Czech Republic", currency: "CZK" },
  { code: "PT", name: "Portugal", currency: "EUR" },
  { code: "IE", name: "Ireland", currency: "EUR" },
  { code: "SK", name: "Slovakia", currency: "EUR" },
  { code: "HU", name: "Hungary", currency: "HUF" },
  { code: "RO", name: "Romania", currency: "RON" },
  { code: "GR", name: "Greece", currency: "EUR" },
  { code: "BG", name: "Bulgaria", currency: "BGN" },
  { code: "HR", name: "Croatia", currency: "EUR" },
  { code: "LT", name: "Lithuania", currency: "EUR" },
  { code: "SI", name: "Slovenia", currency: "EUR" },
  { code: "LV", name: "Latvia", currency: "EUR" },
  { code: "EE", name: "Estonia", currency: "EUR" },
  { code: "CY", name: "Cyprus", currency: "EUR" },
  { code: "MT", name: "Malta", currency: "EUR" },
  { code: "LU", name: "Luxembourg", currency: "EUR" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "AU", name: "Australia", currency: "AUD" },
  { code: "NZ", name: "New Zealand", currency: "NZD" },
  { code: "JP", name: "Japan", currency: "JPY" },
  { code: "KR", name: "South Korea", currency: "KRW" },
  { code: "BR", name: "Brazil", currency: "BRL" },
  { code: "MX", name: "Mexico", currency: "MXN" },
  { code: "AR", name: "Argentina", currency: "ARS" },
  { code: "CL", name: "Chile", currency: "CLP" },
  { code: "CO", name: "Colombia", currency: "COP" },
  { code: "PE", name: "Peru", currency: "PEN" },
  { code: "ZA", name: "South Africa", currency: "ZAR" },
  { code: "TR", name: "Turkey", currency: "TRY" },
  { code: "RU", name: "Russia", currency: "RUB" },
  { code: "IN", name: "India", currency: "INR" },
  { code: "ID", name: "Indonesia", currency: "IDR" },
  { code: "MY", name: "Malaysia", currency: "MYR" },
  { code: "PH", name: "Philippines", currency: "PHP" },
  { code: "SG", name: "Singapore", currency: "SGD" },
  { code: "TH", name: "Thailand", currency: "THB" },
  { code: "VN", name: "Vietnam", currency: "VND" },
  { code: "CN", name: "China", currency: "CNY" },
  { code: "TW", name: "Taiwan", currency: "TWD" },
  { code: "HK", name: "Hong Kong", currency: "HKD" },
  { code: "IL", name: "Israel", currency: "ILS" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR" },
  { code: "AE", name: "United Arab Emirates", currency: "AED" },
  { code: "QA", name: "Qatar", currency: "QAR" },
  { code: "KW", name: "Kuwait", currency: "KWD" },
  { code: "OM", name: "Oman", currency: "OMR" },
  { code: "BH", name: "Bahrain", currency: "BHD" },
  { code: "JO", name: "Jordan", currency: "JOD" },
  { code: "LB", name: "Lebanon", currency: "LBP" },
  { code: "EG", name: "Egypt", currency: "EGP" },
  { code: "MA", name: "Morocco", currency: "MAD" },
  { code: "TN", name: "Tunisia", currency: "TND" },
  { code: "DZ", name: "Algeria", currency: "DZD" },
  { code: "IS", name: "Iceland", currency: "ISK" },
  { code: "UA", name: "Ukraine", currency: "UAH" },
  { code: "NG", name: "Nigeria", currency: "NGN" },
  { code: "KE", name: "Kenya", currency: "KES" },
  { code: "PK", name: "Pakistan", currency: "PKR" },
  { code: "BD", name: "Bangladesh", currency: "BDT" },
  { code: "LK", name: "Sri Lanka", currency: "LKR" },
  { code: "UY", name: "Uruguay", currency: "UYU" },
  { code: "PY", name: "Paraguay", currency: "PYG" },
  { code: "BO", name: "Bolivia", currency: "BOB" },
  { code: "HR", name: "Croatia", currency: "EUR" },
]

async function seedCountries() {
  for (const c of ALL_COUNTRIES) {
    const currency = currenciesById[c.currency]
    if (!currency) continue
    await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: { code: c.code, name: c.name, currencyId: currency.id },
    })
  }
}

async function main() {
  await seedCurrencies()
  await seedCountries()

  const passwordHash = await bcrypt.hash("admin123", 12)
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  })
  console.log("Default admin created: admin@example.com / admin123")

  const usd = currenciesById["USD"]!
  const us = await prisma.country.findUnique({ where: { code: "US" } })
  if (!us) throw new Error("US country not found after seeding")
  const developer = await prisma.developer.upsert({
    where: { slug: "cd-projekt-red" },
    update: {},
    create: { name: "CD Projekt Red", slug: "cd-projekt-red" },
  })

  const publisher = await prisma.publisher.upsert({
    where: { slug: "cd-projekt" },
    update: {},
    create: { name: "CD Projekt", slug: "cd-projekt" },
  })

  const genre = await prisma.genre.upsert({
    where: { slug: "rpg" },
    update: {},
    create: { name: "RPG", slug: "rpg" },
  })

  const game = await prisma.game.upsert({
    where: { slug: "cyberpunk-2077" },
    update: {},
    create: {
      title: "Cyberpunk 2077",
      slug: "cyberpunk-2077",
      description: "An open-world, action-adventure RPG set in the megalopolis of Night City.",
      developerId: developer.id,
      publisherId: publisher.id,
      engine: "REDengine 4",
      releaseDate: new Date("2020-12-10"),
    },
  })

  await prisma.gameGenre.upsert({
    where: { gameId_genreId: { gameId: game.id, genreId: genre.id } },
    update: {},
    create: { gameId: game.id, genreId: genre.id },
  })

  const resolutions = ["P720", "P1080", "P1440", "P4K"] as const
  const qualities = ["ULTRA", "HIGH", "MEDIUM", "LOW"] as const
  const fpsData: Record<string, Record<string, number>> = {
    P720: { ULTRA: 90, HIGH: 110, MEDIUM: 140, LOW: 180 },
    P1080: { ULTRA: 60, HIGH: 80, MEDIUM: 110, LOW: 150 },
    P1440: { ULTRA: 40, HIGH: 55, MEDIUM: 75, LOW: 100 },
    P4K: { ULTRA: 20, HIGH: 35, MEDIUM: 50, LOW: 70 },
  }

  for (const res of resolutions) {
    for (const qual of qualities) {
      const fps = fpsData[res]?.[qual]
      if (fps) {
        await prisma.benchmark.upsert({
          where: {
            gameId_resolution_quality: {
              gameId: game.id,
              resolution: res,
              quality: qual,
            },
          },
          update: { fps },
          create: {
            gameId: game.id,
            resolution: res,
            quality: qual,
            fps,
          },
        })
      }
    }
  }

  await prisma.requirement.createMany({
    data: [
      {
        gameId: game.id,
        type: "minimum",
        os: "Windows 10",
        cpu: "Intel Core i5-3570K / AMD FX-8310",
        gpu: "NVIDIA GTX 780 / AMD Radeon RX 470",
        ramGB: 8,
        storageGB: 70,
      },
      {
        gameId: game.id,
        type: "recommended",
        os: "Windows 10",
        cpu: "Intel Core i7-4790 / AMD Ryzen 3 3200G",
        gpu: "NVIDIA GTX 1060 / AMD Radeon R9 Fury",
        ramGB: 12,
        storageGB: 70,
      },
    ],
  })

  const hwPrices = [
    { hardwareName: "NVIDIA RTX 4090", hardwareType: "GPU", price: 1599.99, store: "Newegg", currencyId: usd.id, countryId: us.id },
    { hardwareName: "NVIDIA RTX 4080", hardwareType: "GPU", price: 999.99, store: "Newegg", currencyId: usd.id, countryId: us.id },
    { hardwareName: "NVIDIA RTX 4070", hardwareType: "GPU", price: 549.99, store: "Newegg", currencyId: usd.id, countryId: us.id },
    { hardwareName: "NVIDIA RTX 4060", hardwareType: "GPU", price: 299.99, store: "Newegg", currencyId: usd.id, countryId: us.id },
    { hardwareName: "AMD Ryzen 7 7800X3D", hardwareType: "CPU", price: 449.99, store: "Amazon", currencyId: usd.id, countryId: us.id },
    { hardwareName: "AMD Ryzen 5 7600X", hardwareType: "CPU", price: 249.99, store: "Amazon", currencyId: usd.id, countryId: us.id },
    { hardwareName: "Intel Core i7-14700K", hardwareType: "CPU", price: 409.99, store: "Amazon", currencyId: usd.id, countryId: us.id },
    { hardwareName: "Intel Core i5-14600K", hardwareType: "CPU", price: 319.99, store: "Amazon", currencyId: usd.id, countryId: us.id },
  ]
  for (const p of hwPrices) {
    await prisma.hardwarePrice.upsert({
      where: {
        hardwareName_hardwareType_store_countryId_currencyId: {
          hardwareName: p.hardwareName,
          hardwareType: p.hardwareType,
          store: p.store,
          countryId: p.countryId,
          currencyId: p.currencyId,
        },
      },
      update: { price: p.price },
      create: p,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
