package mk.ukim.finki.wp.booklist.services.impl;

import mk.ukim.finki.wp.booklist.models.Book;
import mk.ukim.finki.wp.booklist.models.exceptions.ApiException;
import mk.ukim.finki.wp.booklist.repositories.BookRepository;
import mk.ukim.finki.wp.booklist.services.BookService;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BookServiceImpl implements BookService {
    @Autowired
    BookRepository bookRepository;
    /*private BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }*/
/*
    @Override
    public Book create(Book book) {
        checkUniqueId(book);
        return bookRepository.save(book);
    }

    @Override
    public Book edit(String id, Book book) {
        if(!bookRepository.existsById(id))
            throw new ApiException("Book doesn't exist");
        Book old = get(id);
        bookRepository.delete(old);
        return bookRepository.save(book);
    }

    @Override
    public void delete(String id) {
        bookRepository.deleteById(id);
    }
*/

    Book getBook(String name) {
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

    String formatString(String string){
        if(string != "/") {
            String[] arr = string.split("/");
            string = arr[arr.length - 1].replace("_", " ");
            string.trim();
        }
         return string;
    }

    int formatNumberPages(String numberPages) {
        return Integer.parseInt(numberPages.split("\\^")[0]);
    }

    String formatDate(String date) {
        return date.split("\"")[0];
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
            bookRepository.closeConnection("qeISBN");
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
        List<String> authors = bookRepository.findAllDistinctAuthors();
        return authors;
    }

    @Override
    public Page<Book> getAllBooksByPageAndFilters(String search, String[] authors,
                                                  String[] genres, Pageable pageable){
        ResultSet rsBookNames;
        String closeConn;
        if((search == null || search == "") && (authors == null ||authors.length == 0) &&
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

        int start = (int) pageable.getOffset();
        int end = (start + pageable.getPageSize()) > books.size() ? books.size() : (start + pageable.getPageSize());
        Page<Book> pages = new PageImpl<Book>(books.subList(start, end), pageable, books.size());

        return pages;
    }

/*
    @Override
    public Book getByBookTitle(String title) {
      return null;
    }*/

  /*   @Override
    public Book getByBookTitle(String title) {
        Book b = new Book();
      if(!bookRepository.existsBookByTitle(title))
            throw new ApiException("Book doesn't exist");
        return bookRepository.getBookByTitle(title);
       return  b;
    }

 @Override
    public List<Book> getBooksWithPagesLessThan(int numberPages) {
      //  return bookRepository.findAllWithLessPagesThan(numberPages);
     return  null;
    }

 @Override
    public Page<Book> getAllBooksByPage(int page, int size){
        Page<Book> result = this.bookRepository.findAll(PageRequest.of(page, size));
        return result;
    }

    @Override
    public Page<Book> getAllBooksByPageAndFilters(int[] AuthorIds, String[] genres, String search, int numberPagesFrom, int numberPagesTo, boolean read, boolean favourite, Pageable pageable){

        if((AuthorIds == null || AuthorIds.length == 0) &&
                (genres == null || genres.length == 0) &&
                (search == null || search.isEmpty()) &&
                numberPagesFrom == 0 &&
                numberPagesTo == 0) {
            if(favourite)
                return bookRepository.findAllByFavouriteIsTrue(pageable);
            if(read)
                return bookRepository.findAllByReadIsTrue(pageable);
            return bookRepository.findAll(pageable);
        }

        List<String> genreList;
        if(genres == null || genres.length == 0) {
            genreList = null;
        }
        else {
            genreList = new ArrayList<>();
            for (int i = 0; i < genres.length; i++) {
                genreList.add(genres[i]);
            }
        }

        List<Author> authorsList;
        if(AuthorIds == null || AuthorIds.length == 0) {
            authorsList = authorRepository.findAll();
        }
        else {
            authorsList = new ArrayList<>();
            for (int i = 0; i < AuthorIds.length; i++) {
                if (!authorRepository.existsById(AuthorIds[i]))
                    throw new ApiException("Author doesn't exist");
                Optional<Author> optionalEntity = authorRepository.findById(AuthorIds[i]);
                authorsList.add(optionalEntity.get());
            }
        }

        if(numberPagesFrom == 0) {
            numberPagesFrom = getMinMaxNumberPages()[0];
        }

        if(numberPagesTo == 0) {
            numberPagesTo = getMinMaxNumberPages()[1];
        }

        if(search != null && !search.isEmpty()) {
            search = "%" + search + "%";
        }
        else {
            search = null;
        }

        Page<Book> result = this.bookRepository.Filters(authorsList, genreList, search, numberPagesFrom, numberPagesTo, read, favourite, pageable);
        return result;
    }

    @Override
    public List<Book> getAllBooksByNumberPagesBetween(int from, int to) {
        return bookRepository.findAllByNumberPagesBetween(from, to);
    }

    @Override
    public Book markAsRead(String id) {
        if(!bookRepository.existsById(id))
            throw new ApiException("Book doesn't exist");
        Optional<Book> optionalEntity = bookRepository.findById(id);
        Book book = optionalEntity.get();

        if(book.isRead()) {
            if(book.isFavourite())
                book.setFavourite(false);
            book.setRead(false);
        }
        else
            book.setRead(true);
        return bookRepository.save(book);
    }

    @Override
    public Book updateFavourites(String id) {
        if(!bookRepository.existsById(id))
            throw new ApiException("Book doesn't exist");
        Optional<Book> optionalEntity = bookRepository.findById(id);
        Book book = optionalEntity.get();

        if(book.isFavourite()) {
            book.setFavourite(false);
        }
        else {
            if(!book.isRead()) {
                throw new ApiException("The book is not read!");
            }
            else {
                book.setFavourite(true);
            }
        }
        return bookRepository.save(book);
    }

    @Override
    public Book addAComment(String id, String comment) {
        if(!bookRepository.existsById(id))
            throw new ApiException("Book doesn't exist");
        Optional<Book> optionalEntity = bookRepository.findById(id);
        Book book = optionalEntity.get();

        if(comment != null)
            book.setComment(comment);
        return bookRepository.save(book);
    }

    @Override
    public int[] getMinMaxNumberPages() {
        int min = bookRepository.minNumberPages();
        int max = bookRepository.maxNumberPages();
        int[] minMax = new int[]{ min, max};
        return minMax;
    }

    private void checkUniqueId(Book book) {
        if(bookRepository.existsById(book.getISBN()))
            throw new ApiException("Book already exists");
    }*/
}
