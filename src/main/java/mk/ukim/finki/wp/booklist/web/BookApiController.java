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

import javax.swing.text.StyledEditorKit;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
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
/*
    @PostMapping()
    public Book createNewBook(@RequestParam(value="ISBN") String ISBN,
                              @RequestParam(value="title") String title,
                              @RequestParam(value="publicationDate") String publicationDate,
                              @RequestParam(value="author") String author,
                              @RequestParam(value="review") double review,
                              @RequestParam(value="numberPages") int numberPages,
                              @RequestParam(value="description") String description,
                              @RequestParam(value="genres") String[] genres,
                              @RequestParam(value="imageUrl") String imageUrl){

        Book result = bookService.create(new Book(ISBN, title, publicationDate, author, review, numberPages, description, "", false, false, imageUrl, genres));
        return result;
    }

    @PatchMapping("/{id}/markAsRead")
    public Book markAsRead(@PathVariable String id) {
        return bookService.markAsRead(id);
    }

    @PatchMapping("/{id}/updateFavourites")
    public Book updateFavourites(@PathVariable String id) {
        return bookService.updateFavourites(id);
    }

    @PatchMapping("/{id}")
    public Book editBook(@PathVariable String id,
                         @RequestParam(value="title") String title,
                         @RequestParam(value="publicationDate") String publicationDate,
                         @RequestParam(value="author") int authorId,
                         @RequestParam(value="review") double review,
                         @RequestParam(value="numberPages") int numberPages,
                         @RequestParam(value="description") String description,
                         @RequestParam(value="genres") List<Genre> genres,
                         @RequestParam(value="imageUrl") String imageUrl){

        Book old = bookService.get(id);
        Book result = bookService.edit(id, new Book(id, title, LocalDate.parse(publicationDate, DateTimeFormatter.ofPattern("yyyy-MM-dd")), authorService.get(authorId), review, numberPages, description, old.getComment(), old.isRead(), old.isFavourite(), imageUrl, genres));
        return result;
    }
*/
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

/*
    @GetMapping()
    public Page<Book> getAllBooks(@RequestParam(value = "authorIds",
                                            required = false) int[] authorIds,
                                  @RequestParam(value = "genres",
                                          required = false) String[] genres,
                                  @RequestParam(value = "search",
                                          required = false) String search,
                                  @RequestParam(value = "numberPagesFrom",
                                          required = false,
                                          defaultValue = "0") int numberPagesFrom,
                                  @RequestParam(value = "numberPagesTo",
                                          required = false,
                                          defaultValue = "0") int numberPagesTo,
                                  @RequestParam(value = "read",
                                          required = false, defaultValue = "false")
                                              boolean read,
                                  @RequestParam(value = "favourite",
                                          required = false, defaultValue = "false")
                                              boolean favourite,
                                  @PageableDefault(page = 0, size = 3, sort = {"title"}) Pageable pageable){
        return bookService.getAllBooksByPageAndFilters(authorIds, genres, search, numberPagesFrom, numberPagesTo, read, favourite, pageable);

    }

    @GetMapping("/minMaxNumberPages")
    public int[] getMinMaxNumberPages(){
        return bookService.getMinMaxNumberPages();
    }*/
}
