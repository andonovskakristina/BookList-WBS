package mk.ukim.finki.wp.booklist.services;

import mk.ukim.finki.wp.booklist.models.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BookService {
    /*Book create(Book book);

    Book edit(String id, Book book);*/

    void delete(String id);

    List<Book> getAllBooks();

    List<String> getAllAuthors();

    List<String> getAllGenres();

    Book get(String id);

    Page<Book> getAllBooksByPageAndFilters(String search, String[] authors, String[] genres, Pageable pageable);

    List<String> findAllDistinctAuthors();

    //Book getByBookTitle(String title);

   // List<Book> getBooksWithPagesLessThan(int numberPages);

  ///  Page<Book> getAllBooksByPage(int page, int size);

  //  List<Book> getAllBooksByNumberPagesBetween(int from, int to);

 //   Book markAsRead(String id);

  //  Book updateFavourites(String id);

  //  Book addAComment(String id, String comment);

    //Page<Book> getAllBooksByPageAndFilters(int[] AuthorIds, String[] genres, String search, int numberPagesFrom, int numberPagesTo, boolean read, boolean favourite, Pageable pageable);*/
}
