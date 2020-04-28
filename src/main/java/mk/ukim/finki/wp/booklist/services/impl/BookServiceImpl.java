package mk.ukim.finki.wp.booklist.services.impl;

import mk.ukim.finki.wp.booklist.models.Book;
import mk.ukim.finki.wp.booklist.models.exceptions.ApiException;
import mk.ukim.finki.wp.booklist.repositories.BookRepository;
import mk.ukim.finki.wp.booklist.services.BookService;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;
import org.hibernate.criterion.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BookServiceImpl implements BookService {
    @Autowired
    BookRepository bookRepository;

    @Override
    public Book create(String ISBN, String title, String author, String[] genres, int numberPages, String publicationDate, String description, String imageUrl) {
        if(bookRepository.existsById(ISBN))
            throw new ApiException("The book already exists.");

        bookRepository.create(ISBN, title, author, genres, numberPages, publicationDate,
                description, imageUrl);

        String genresConcat = "";
        for (String genre : genres) {
            genresConcat += genre;
        }

        return new Book(ISBN, title, author, genresConcat, numberPages, publicationDate,
                description, imageUrl);
    }

    public Book edit(String ISBN, String title, String author, String[] genres, int numberPages, String publicationDate, String description, String imageUrl) {
        if(!bookRepository.existsById(ISBN))
            throw new ApiException("The book doesn't exist.");

        bookRepository.edit(ISBN, title, author, genres, numberPages, publicationDate,
                description, imageUrl);

        String genresConcat = "";
        for (int i = 0; i < genres.length; i++) {
            genresConcat += genres[i];
        }

        return new Book(ISBN, title, author, genresConcat, numberPages, publicationDate,
                description, imageUrl);
    }

    @Override
    public void delete(String id) {
        bookRepository.deleteById(id);
    }


    private Book getBook(String name) {
        String isbn = bookRepository.findISBN(name);
        bookRepository.closeConnection("qeISBN");

        String author = bookRepository.findAuthor(name);
        bookRepository.closeConnection("qeAuthor");

        String genres = bookRepository.findGenres(name);
        bookRepository.closeConnection("qeGenres");

        String numberPages = bookRepository.findNumberPages(name);
        bookRepository.closeConnection("qeNumberPages");

        String publicationDate = bookRepository.findPublicationDate(name);
        bookRepository.closeConnection("qePublicationDate");

        String description = bookRepository.findDescription(name);
        bookRepository.closeConnection("qeDescription");

        String imageUrl = bookRepository.findImageUrl(name);
        bookRepository.closeConnection("qeImageUrl");

        return new Book(isbn, formatString(name), formatString(author),
                formatString(genres), formatNumberPages(numberPages), publicationDate, description, imageUrl);
    }

    private String formatString(String string){
        if(!string.equals("/")) {
            String[] arr = string.split("/");
            string = arr[arr.length - 1].replace("_", " ");

        }
         return string.trim();
    }

    private int formatNumberPages(String numberPages) {
        return Integer.parseInt(numberPages.split("\\^")[0]);
    }


    @Override
    public List<Book> getAllBooks() {

        ResultSet rsBookNames = bookRepository.findAllBookNames();
        List<Book> books = new ArrayList<>();

        while ( rsBookNames.hasNext() ) {
            final QuerySolution qs = rsBookNames.next();
            if((qs.get("s")) != null) {
                String name = (qs.get("s")).toString();

                Book b = getBook(name);
                books.add(b);
              }
              else break;
        }
        bookRepository.closeConnection("qeBookNames");

        return books;
    }

    @Override
    public Book get(String id) {
        if(!bookRepository.existsById(id)) {
            throw new ApiException("Book doesn't exist");
        }
        Book book = getBook(bookRepository.findById(id));
        bookRepository.closeConnection("qeISBN");
        return book;
    }

    @Override
    public List<String> getAllAuthors() {
        ResultSet rsBookAuthors = bookRepository.findAllBookAuthors();
        List<String> authors = new ArrayList<>();

        while ( rsBookAuthors.hasNext() ) {
            final QuerySolution qs = rsBookAuthors.next();
            if((qs.get("o")) != null) {
                authors.add(formatString((qs.get("o")).toString()));
            }
            else break;
        }
        bookRepository.closeConnection("qeBookAuthors");

        return authors;
    }

    @Override
    public List<String> getAllGenres() {
        ResultSet rsBookGenres = bookRepository.findAllBookGenres();
        List<String> genres = new ArrayList<>();

        while ( rsBookGenres.hasNext() ) {
            final QuerySolution qs = rsBookGenres.next();
            if((qs.get("o")) != null) {
                genres.add(formatString((qs.get("o")).toString()));
            }
            else break;
        }
        bookRepository.closeConnection("qeBookGenres");

        return genres;
    }

    @Override
    public List<String> findAllDistinctAuthors() {
        return bookRepository.findAllDistinctAuthors();
    }

    @Override
    public Page<Book> getAllBooksByPageAndFilters(String search, String[] authors,
                                                  String[] genres, Pageable pageable){
        ResultSet rsBookNames;
        String closeConn;
        if((search == null || search.equals("")) && (authors == null ||authors.length == 0) &&
                (genres == null || genres.length == 0)) {
            rsBookNames = bookRepository.findAllBookNames();
            closeConn = "qeBookNames";
        }
        else {
            rsBookNames = bookRepository.findAllBookNamesFilter(search, authors, genres);
            closeConn = "qeAll";
        }

        List<Book> books = new ArrayList<>();

        while ( rsBookNames.hasNext() ) {
            final QuerySolution qs = rsBookNames.next();
            if((qs.get("s")) != null) {
                String name = (qs.get("s")).toString();

                Book b = getBook(name);
                books.add(b);
            }
            else break;
        }
        bookRepository.closeConnection(closeConn);

        String sortBy = pageable.getSort().toString().split(":")[0];
        Collections.sort(books, new Comparator<Book>() {
            @Override
            public int compare(Book o1, Book o2) {
                if(sortBy.equals("numberPages"))
                    return o1.getNumberPages() - o2.getNumberPages();
                else if(sortBy.equals("publicationDate"))
                    return o1.getPublicationDate().compareTo(o2.getPublicationDate());
                else
                    return o1.getTitle().compareTo(o2.getTitle());
            }
        });

        int start = (int) pageable.getOffset();
        int end = (start + pageable.getPageSize()) > books.size() ? books.size() : (start + pageable.getPageSize());

        return  new PageImpl<Book>(books.subList(start, end), pageable, books.size());
    }
}
