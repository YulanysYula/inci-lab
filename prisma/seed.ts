// Seeds the database with the curated ingredient list.
// Run with: npx prisma db push && npm run db:seed

import { PrismaClient } from "@prisma/client";
import { ingredients } from "../src/data/ingredients";

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱  Seeding ${ingredients.length} ingredients…`);

  for (const ing of ingredients) {
    // Upsert so re-running the seed is idempotent.
    await prisma.ingredient.upsert({
      where: { name: ing.name },
      update: ing,
      create: ing,
    });
  }

  console.log("✓ Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
