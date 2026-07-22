import "dotenv/config"
import path from "path"
import { PrismaClient } from "../src/generated/prisma"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const dbPath = path.resolve(process.cwd(), "dev.db")
process.env.DATABASE_URL = `file:${dbPath}`

const adapter = new PrismaLibSql({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  const usd = await prisma.currency.upsert({
    where: { code: "USD" },
    update: {},
    create: { code: "USD", name: "US Dollar", symbol: "$" },
  })

  const us = await prisma.country.upsert({
    where: { code: "US" },
    update: {},
    create: { code: "US", name: "United States", currencyId: usd.id },
  })
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

  await prisma.hardwarePrice.createMany({
    data: [
      { hardwareName: "NVIDIA RTX 4090", hardwareType: "GPU", price: 1599.99, store: "Newegg", currencyId: usd.id, countryId: us.id },
      { hardwareName: "NVIDIA RTX 4080", hardwareType: "GPU", price: 999.99, store: "Newegg", currencyId: usd.id, countryId: us.id },
      { hardwareName: "NVIDIA RTX 4070", hardwareType: "GPU", price: 549.99, store: "Newegg", currencyId: usd.id, countryId: us.id },
      { hardwareName: "NVIDIA RTX 4060", hardwareType: "GPU", price: 299.99, store: "Newegg", currencyId: usd.id, countryId: us.id },
      { hardwareName: "AMD Ryzen 7 7800X3D", hardwareType: "CPU", price: 449.99, store: "Amazon", currencyId: usd.id, countryId: us.id },
      { hardwareName: "AMD Ryzen 5 7600X", hardwareType: "CPU", price: 249.99, store: "Amazon", currencyId: usd.id, countryId: us.id },
      { hardwareName: "Intel Core i7-14700K", hardwareType: "CPU", price: 409.99, store: "Amazon", currencyId: usd.id, countryId: us.id },
      { hardwareName: "Intel Core i5-14600K", hardwareType: "CPU", price: 319.99, store: "Amazon", currencyId: usd.id, countryId: us.id },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
