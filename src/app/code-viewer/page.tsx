"use client";

import { AutoResizeMonaco } from "./Comp";

const formData = {
  squadName: "Super hero squad",
  homeTown: "Metro City",
  formed: 2016,
  secretBase: "Super tower",
  active: true,
  members: [
    {
      name: "Molecule Man",
      age: 29,
      secretIdentity: "Dan Jukes",
      powers: ["Radiation resistance", "Turning tiny", "Radiation blast"],
    },
    {
      name: "Madame Uppercut",
      age: 39,
      secretIdentity: "Jane Wilson",
      powers: ["Million tonne punch", "Damage resistance", "Superhuman reflexes"],
    },
    {
      name: "Eternal Flame",
      age: 1000000,
      secretIdentity: "Unknown",
      powers: ["Immortality", "Heat Immunity", "Inferno", "Teleportation", "Interdimensional travel"],
    },
    {
      name: "Molecule Man",
      age: 29,
      secretIdentity: "Dan Jukes",
      powers: ["Radiation resistance", "Turning tiny", "Radiation blast"],
    },
    {
      name: "Madame Uppercut",
      age: 39,
      secretIdentity: "Jane Wilson",
      powers: ["Million tonne punch", "Damage resistance", "Superhuman reflexes"],
    },
    {
      name: "Eternal Flame",
      age: 1000000,
      secretIdentity: "Unknown",
      powers: ["Immortality", "Heat Immunity", "Inferno", "Teleportation", "Interdimensional travel"],
    },
  ],
  from: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON",
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-auto bg-gray-100 p-8">
      <h1 className="p-6 text-2xl font-bold">Live Form JSON Viewer</h1>
      <AutoResizeMonaco value={JSON.stringify(formData, null, 2)} />
    </main>
  );
}
