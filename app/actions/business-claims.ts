"use server"

import { revalidatePath } from "next/cache"
import { submitClaim, type SubmitClaimResult } from "@/lib/api/business-claims"

export async function claimBusiness(slug: string, message: string): Promise<SubmitClaimResult> {
  const result = await submitClaim(slug, message)

  if (result === "ok") {
    revalidatePath(`/businesses/${slug}`)
    revalidatePath("/my-business")
  }

  return result
}
