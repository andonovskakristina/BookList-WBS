package mk.ukim.finki.wp.booklist.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "authors")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Author {
    @Id
    String name;

    @ElementCollection
    List<String> bookNames;

    public Author(String name, List<String> bookNames) {
        this.name = name;
        this.bookNames = bookNames;
    }
}
