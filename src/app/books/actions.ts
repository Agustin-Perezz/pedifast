"use server";

import { revalidatePath } from "next/cache";
import { createBookRequestDto } from "@/application/use-cases/books/create-book/create-book.request.dto";
import { createBooksContainer } from "@/lib/containers/books.container";
import { requireUser } from "@/lib/shared/infrastructure/auth.server";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function createBook(formData: FormData): Promise<void> {
  await requireUser();

  const dto = createBookRequestDto.parse({
    title: formData.get("title"),
    author: formData.get("author"),
  });

  const supabase = await createSupabaseServerClient();
  const { create } = createBooksContainer(supabase);

  await create.execute(dto);

  revalidatePath("/books");
}
