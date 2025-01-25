import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const delay = Number.parseInt(searchParams.get("delay") || "0");

  await sleep(delay);

  // mock space mission data
  const data = {
    missionId: faker.string.alphanumeric(8).toUpperCase(),
    spacecraft: `${faker.science.chemicalElement().name} ${faker.number.int({ min: 1, max: 999 })}`,
    launchDate: faker.date.future(),
    destination: faker.helpers.arrayElement([
      "Mars",
      "Venus",
      "Europa",
      "Titan",
      "Alpha Centauri",
    ]),
    crew: Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement([
        "Commander",
        "Pilot",
        "Engineer",
        "Science Officer",
        "Medical Officer",
      ]),
      nationality: faker.location.country(),
    })),
    missionStatus: faker.helpers.arrayElement([
      "Preparing",
      "In Progress",
      "Completed",
      "Aborted",
    ]),
    payloadWeight: `${faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 })} kg`,
    fuelType: faker.helpers.arrayElement([
      "Ion Propulsion",
      "Nuclear Thermal",
      "Antimatter",
      "Dark Matter",
    ]),
    missionObjectives: Array.from(
      { length: faker.number.int({ min: 2, max: 4 }) },
      () => faker.lorem.sentence(),
    ),
    estimatedCost: `${faker.number.float({ min: 100, max: 999, fractionDigits: 2 })} billion USD`,
  };

  return NextResponse.json(data);
}
