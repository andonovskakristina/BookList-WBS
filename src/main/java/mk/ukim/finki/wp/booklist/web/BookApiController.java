package mk.ukim.finki.wp.booklist.web;

import mk.ukim.finki.wp.booklist.models.Book;
import mk.ukim.finki.wp.booklist.models.exceptions.ApiException;
import mk.ukim.finki.wp.booklist.services.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.util.MimeTypeUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "/api/books", produces = MimeTypeUtils.APPLICATION_JSON_VALUE)
@Validated
public class BookApiController {
    private BookService bookService;

    public BookApiController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping()
    public Book createNewBook(@RequestParam(value="ISBN") String ISBN,
                              @RequestParam(value="title") String title,
                              @RequestParam(value="publicationDate") String publicationDate,
                              @RequestParam(value="author") String author,
                              @RequestParam(value="numberPages") int numberPages,
                              @RequestParam(value="description") String description,
                              @RequestParam(value="genres") String[] genres,
                              @RequestParam(value="imageUrl") String imageUrl){

        return bookService.create(ISBN, title, author, genres, numberPages, publicationDate,
                description, imageUrl);
    }

    @PatchMapping("/{id}")
    public Book editBook(@PathVariable String id,
                         @RequestParam(value="title") String title,
                         @RequestParam(value="publicationDate") String publicationDate,
                         @RequestParam(value="author") String author,
                         @RequestParam(value="numberPages") int numberPages,
                         @RequestParam(value="description") String description,
                         @RequestParam(value="genres") String[] genres,
                         @RequestParam(value="imageUrl") String imageUrl){

        return bookService.edit(id, title, author, genres, numberPages, publicationDate,
                description, imageUrl);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable String id){
        bookService.delete(id);
    }

    @GetMapping("/{id}")
    public Book getBook(@PathVariable String id){
        return bookService.get(id);
    }

    @GetMapping("/allBooks")
    public List<Book> getAllBooks(){
        return bookService.getAllBooks();
    }

    @GetMapping("/allAuthors")
    public List<String> getAllAuthors(){
        return bookService.getAllAuthors();
    }

    @GetMapping("/allGenres")
    public List<String> getAllGenres(){
        return bookService.getAllGenres();
    }

    @GetMapping()
    public Page<Book> getAllBooksPageable(@RequestParam(value = "authors",
            required = false) String[] authors,
                                  @RequestParam(value = "genres",
                                          required = false) String[] genres,
                                  @RequestParam(value = "search",
                                          required = false) String search,
                                  @PageableDefault(page = 0, size = 5, sort = {"title"}) Pageable pageable){
        return bookService.getAllBooksByPageAndFilters(search, authors, genres, pageable);

    }
}
