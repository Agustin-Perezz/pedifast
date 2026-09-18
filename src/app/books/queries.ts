import type { Book } from "@/domain/entities/book.entity";
import { createBooksContainer } from "@/lib/containers/books.container";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function getBooks(): Promise<Book[]> {
  const supabase = await createSupabaseServerClient();
  const { getBooks: getBooksUseCase } = createBooksContainer(supabase);

  const { books } = await getBooksUseCase.execute();

  return books;
}
