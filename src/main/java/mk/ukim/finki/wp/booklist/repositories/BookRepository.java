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

    boolean existsById(String id);

    Book findById(String id);
}
