package mk.ukim.finki.wp.booklist.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
public class Book {
    @Id
    private String ISBN;

    private String title;

  //  private String publicationDate;

    private String author;

//    private double review;

 //   private int numberPages;

   // @Column(length = 2000)
  //  private String description;

   // private boolean read;

   // private boolean favourite;

  //  private String imageUrl;

    private String genres;

    public Book(String isbn, String name, String author, String genres) {
        this.ISBN =  isbn;
        this.title= name;
        this.author= author;
        this.genres = genres;
    }
}
