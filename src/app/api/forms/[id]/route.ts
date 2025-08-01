import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

// DELETE form by formId
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id: formId } = await context.params;

  const client = await clientPromise;
  const db = client.db("forms-db");

  const result = await db.collection("forms-collection").deleteOne({ formId });

  if (result.deletedCount === 0) {
    return new NextResponse("Form not found", { status: 404 });
  }

  return NextResponse.json({ deleted: true, formId });
}

// GET form by formId
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id: formId } = await context.params;

  const client = await clientPromise;
  const db = client.db("forms-db");

  const form = await db.collection("forms-collection").findOne({ formId });

  if (!form) {
    return new NextResponse("Form not found", { status: 404 });
  }

  return NextResponse.json(form);
}

// UPDATE form by formId
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: formId } = await context.params;
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("forms-db");

  const result = await db.collection("forms-collection").updateOne({ formId }, { $set: body });

  if (result.matchedCount === 0) {
    return new NextResponse("Form not found", { status: 404 });
  }

  return NextResponse.json({ updated: true, formId });
}
