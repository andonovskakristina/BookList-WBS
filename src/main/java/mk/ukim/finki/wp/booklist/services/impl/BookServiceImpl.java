package mk.ukim.finki.wp.booklist.services.impl;

import mk.ukim.finki.wp.booklist.models.Book;
import mk.ukim.finki.wp.booklist.models.exceptions.ApiException;
import mk.ukim.finki.wp.booklist.repositories.BookRepository;
import mk.ukim.finki.wp.booklist.services.BookService;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {
    /*private BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }*/

    @Autowired
    BookRepository bookRepository;
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
    @Override
    public List<Book> getAllBooks() {
        ResultSet rsBookNames = bookRepository.findAllBookNames();
        ResultSet rsAll = bookRepository.findAll();

        while ( rsBookNames.hasNext() ) {
            final QuerySolution qs = rsBookNames.next();
            System.out.println(qs.get( "s" ));
        }

        while ( rsAll.hasNext() ) {
            final QuerySolution qs = rsAll.next();
            System.out.println(qs.get( "s" ) +
                    "\n\t" + qs.get( "p" ) +
                    "\n\t" + qs.get( "o" ));
        }

        bookRepository.closeConnection("qeBookNames");
        bookRepository.closeConnection("qeAll");
        return null;
    }

    @Override
    public Book get(String id) {
        if(!bookRepository.existsById(id))
            throw new ApiException("Book doesn't exist");
        Book book = bookRepository.findById(id);
        return book;
    }
/*
    @Override
    public Book getByBookTitle(String title) {
        if(!bookRepository.existsBookByTitle(title))
            throw new ApiException("Book doesn't exist");
        return bookRepository.getBookByTitle(title);
    }

    @Override
    public List<Book> getBooksWithPagesLessThan(int numberPages) {
        return bookRepository.findAllWithLessPagesThan(numberPages);
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