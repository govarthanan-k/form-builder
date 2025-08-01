import { NextResponse } from "next/server";

import { MongoServerError } from "mongodb";

import clientPromise from "@/lib/mongodb";

// Get all forms
export async function GET() {
  const client = await clientPromise;
  const db = client.db("forms-db");

  const forms = await db.collection("forms-collection").find().toArray();

  return NextResponse.json(forms);
}

// Create a new form
export async function POST(req: Request) {
  const body = await req.json();
  const formId = body.formId;

  if (!formId) {
    return new NextResponse("Missing formId", { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("forms-db");

  try {
    await db.collection("forms-collection").insertOne(body);

    return NextResponse.json({ created: true, formId });
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      return new NextResponse("Form with this formId already exists", { status: 409 });
    }

    console.error("Insert error:", err);

    return new NextResponse("Failed to create form", { status: 500 });
  }
}
