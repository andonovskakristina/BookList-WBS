package mk.ukim.finki.wp.booklist.repositories;

import mk.ukim.finki.wp.booklist.models.Book;
import org.apache.jena.query.ResultSet;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository {

    void closeConnection(String qe);

    ResultSet findAll();

    ResultSet findAllBookNames();

    ResultSet findAllBookNamesFilter(String search, String[] authors, String[] genres);

    String findISBN(String bookName);

    String findAuthor(String bookName);

    List<String> findAllDistinctAuthors();

    String findGenres(String bookName);

    String findNumberPages(String bookName);

    String findPublicationDate(String bookName);

    String findDescription(String bookName);

    String findImageUrl(String bookName);

    boolean existsById(String id);

    String findById(String id);

    ResultSet findAllBookAuthors();

    ResultSet findAllBookGenres();

    ResultSet findBooksByAuthor(String author);

    void deleteById(String id);

    void create(String ISBN, String title, String author, String[] genres, int numberPages,
                String publicationDate, String description, String imageUrl);

    void edit(String ISBN, String title, String author, String[] genres, int numberPages,
                String publicationDate, String description, String imageUrl);
}
