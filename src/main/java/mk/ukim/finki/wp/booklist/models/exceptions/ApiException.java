package mk.ukim.finki.wp.booklist.models.exceptions;

public class ApiException extends RuntimeException {
    public ApiException(String errorMessage){
        super(errorMessage);
    }
}
