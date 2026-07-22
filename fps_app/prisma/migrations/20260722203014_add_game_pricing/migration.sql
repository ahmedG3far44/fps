-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GameStorePrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "currentPrice" REAL NOT NULL,
    "originalPrice" REAL,
    "discount" INTEGER,
    "buyUrl" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameStorePrice_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GameStorePrice_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "releaseDate" DATETIME,
    "engine" TEXT,
    "igdbId" INTEGER,
    "rawgId" INTEGER,
    "itadPlainId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "developerId" TEXT,
    "publisherId" TEXT,
    CONSTRAINT "Game_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Game_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("coverUrl", "createdAt", "description", "developerId", "engine", "id", "igdbId", "publisherId", "rawgId", "releaseDate", "slug", "title", "updatedAt") SELECT "coverUrl", "createdAt", "description", "developerId", "engine", "id", "igdbId", "publisherId", "rawgId", "releaseDate", "slug", "title", "updatedAt" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
CREATE UNIQUE INDEX "Game_igdbId_key" ON "Game"("igdbId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Store_slug_key" ON "Store"("slug");

-- CreateIndex
CREATE INDEX "GameStorePrice_gameId_idx" ON "GameStorePrice"("gameId");

-- CreateIndex
CREATE INDEX "GameStorePrice_countryCode_idx" ON "GameStorePrice"("countryCode");
