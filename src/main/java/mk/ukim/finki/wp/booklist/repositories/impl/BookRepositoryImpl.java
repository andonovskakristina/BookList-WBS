package mk.ukim.finki.wp.booklist.repositories.impl;

import mk.ukim.finki.wp.booklist.repositories.BookRepository;

import java.util.ArrayList;
import java.util.List;

import org.apache.jena.query.*;
import org.apache.jena.update.UpdateExecutionFactory;
import org.apache.jena.update.UpdateFactory;
import org.apache.jena.update.UpdateProcessor;
import org.apache.jena.update.UpdateRequest;
import org.springframework.stereotype.Repository;

import static org.apache.jena.query.ResultSetFactory.makeRewindable;

@Repository
public class BookRepositoryImpl implements BookRepository {

    private QueryExecution qeAll;
    private QueryExecution qeBookNames;
    private QueryExecution qeAuthor;
    private QueryExecution qeISBN;
    private QueryExecution qeGenres;
    private QueryExecution qePublicationDate;
    private QueryExecution qeNumberPages;
    private QueryExecution qeDescription;
    private QueryExecution qeImageUrl;
    private QueryExecution qeBookAuthors;
    private QueryExecution qeBookGenres;

    public void openConnection(String qe, String query) {
        if(qe.equals("qeAll"))
            qeAll = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                query);
        else if(qe.equals("qeBookNames"))
            qeBookNames = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);
        else if(qe.equals("qeAuthor"))
            qeAuthor = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);
        else if(qe.equals("qeISBN"))
            qeISBN = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);
        else if(qe.equals("qeGenres"))
            qeGenres = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);
        else if(qe.equals("qeNumberPages"))
            qeNumberPages = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);
        else if(qe.equals("qePublicationDate"))
            qePublicationDate = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);
        else if(qe.equals("qeDescription"))
            qeDescription = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);
        else if(qe.equals("qeImageUrl"))
            qeImageUrl = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);
        else if(qe.equals("qeBookAuthors"))
            qeBookAuthors = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);
        else if(qe.equals("qeBookGenres"))
            qeBookGenres = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);

        System.out.println("Open: " + qe);
    }

    @Override
    public void closeConnection(String qe) {
        if(qe.equals("qeAll"))
            qeAll.close();
        else if(qe.equals("qeBookNames"))
            qeBookNames.close();
        else if(qe.equals("qeAuthor"))
            qeAuthor.close();
        else if(qe.equals("qeISBN"))
            qeISBN.close();
        else if(qe.equals("qeGenres"))
            qeGenres.close();
        else if(qe.equals("qeNumberPages"))
            qeNumberPages.close();
        else if(qe.equals("qePublicationDate"))
            qePublicationDate.close();
        else if(qe.equals("qeDescription"))
            qeDescription.close();
        else if(qe.equals("qeImageUrl"))
            qeImageUrl.close();
        else if(qe.equals("qeBookAuthors"))
            qeBookAuthors.close();
        else if(qe.equals("qeBookGenres"))
            qeBookGenres.close();

        System.out.println("Close: " + qe);
    }

    @Override
    public ResultSet findAll() {
        openConnection("qeAll","SELECT * WHERE {?s ?p ?o}");
        ResultSet results = qeAll.execSelect();
        return results;
    }

    @Override
    public ResultSet findAllBookNames() {
        openConnection("qeBookNames", "select ?s\n" +
                "where {\n" +
                "  ?s ?p ?o filter (?p=<http://dbpedia.org/ontology/isbn>)\n" +
                "} group by ?s");
        ResultSet results = qeBookNames.execSelect();

        return results;
    }

    private String formatStringFilter(String string){
        return string.replace(" ", "_");
    }

    private StringBuilder getFilterQuery(String search, String[] authors, String[] genres) {
        StringBuilder filterQuery = new StringBuilder();

        if(search != null && search != "") {
            // filter the book title by search string
            filterQuery.append("regex(str(?s), \".*")
                    .append(formatStringFilter(search))
                    .append(".*\",'i')");
            if((authors != null && authors.length > 0) || (genres != null && genres.length > 0))
                filterQuery.append(" && ");
        }
        if((authors != null && authors.length > 0) || (genres != null && genres.length > 0))
            filterQuery.append(" (");
        if (authors != null && authors.length > 0) {
            for(int i = 0; i < authors.length; i++) {
                filterQuery.append("regex(str(?o), \".*")
                        .append(formatStringFilter(authors[i]))
                        .append("\",'i')");
                if(i != authors.length - 1 || (genres != null && genres.length > 0))
                    filterQuery.append(" || ");
            }
        }
        if (genres != null && genres.length > 0) {
            for(int i = 0; i < genres.length; i++) {
                filterQuery.append("regex(str(?o), \".*")
                        .append(formatStringFilter(genres[i]))
                        .append("\",'i')");
                if(i != genres.length - 1)
                    filterQuery.append(" || ");
            }
        }
        if((authors != null && authors.length > 0) || (genres != null && genres.length > 0)) {
            filterQuery.append(") && (regex(str(?p), \".*author\",'i') || regex(str(?p), \".*literaryGenre\",'i'))");
        }

        return filterQuery;
    }

    @Override
    public ResultSet findAllBookNamesFilter(String search, String[] authors, String[] genres) {
        StringBuilder query = getFilterQuery(search, authors, genres);
        openConnection("qeAll", "select ?s\n" +
                "where {\n" +
                "  ?s ?p ?o." +
                " filter ("+ query +")\n" +
                "} group by ?s");

        return qeAll.execSelect();
    }

    @Override
    public String findISBN(String bookName) {
        openConnection("qeISBN", "select ?o\n" +
                "where {\n" +
                "  ?s ?p ?o filter (?s=<"+bookName+">&&?p=<http://dbpedia.org/ontology/isbn>)\n" +
                "}");
        ResultSet results = qeISBN.execSelect();
        try
        {  QuerySolution qs = results.next();

            return (qs.get("o")).toString();
        }
        catch (Exception e) {
            return "";
        }
    }

    @Override
    public String findAuthor(String bookName) {
        openConnection("qeAuthor", "select ?o\n" +
                "where {\n" +
                "  ?s ?p ?o filter (?s=<"+bookName+">&&?p=<http://dbpedia.org/ontology/author>)\n" +
                "}");
        ResultSet results = qeAuthor.execSelect();
        try
        {  QuerySolution qs = results.next();

            return (qs.get("o")).toString();
        }
        catch (Exception e) {
            return "/";
        }
    }

    @Override
    public String findGenres(String bookName) {
        openConnection("qeGenres", "select ?o\n" +
                "where {\n" +
                "  ?s ?p ?o filter (?s=<"+bookName+">&&?p=<http://dbpedia.org/ontology/literaryGenre>)\n" +
                "}");
        ResultSet results = qeGenres.execSelect();

        try
        {  QuerySolution qs = results.next();

        return (qs.get("o")).toString();
        }
        catch (Exception e) {
            return "/";
        }
    }

    @Override
    public String findNumberPages(String bookName) {
        openConnection("qeNumberPages", "select ?o\n" +
                "where {\n" +
                "  ?s ?p ?o filter (?s=<"+bookName+">&&?p=<http://dbpedia.org/ontology/numberOfPages>)\n" +
                "}");
        ResultSet results = qeNumberPages.execSelect();
        try
        {  QuerySolution qs = results.next();

            return (qs.get("o")).toString();
        }
        catch (Exception e) {
            return "0";
        }
    }

    @Override
    public String findPublicationDate(String bookName) {
        openConnection("qePublicationDate", "select ?o\n" +
                "where {\n" +
                "  ?s ?p ?o filter (?s=<"+bookName+">&&?p=<http://dbpedia.org/property/releaseDate>)\n" +
                "}");
        ResultSet results = qePublicationDate.execSelect();
        try
        {  QuerySolution qs = results.next();

            return (qs.get("o")).toString();
        }
        catch (Exception e) {
            return "/";
        }
    }

    @Override
    public String findDescription(String bookName) {
        openConnection("qeDescription", "select ?o\n" +
                "where {\n" +
                "  ?s ?p ?o filter (?s=<"+bookName+">&&?p=<http://dbpedia.org/ontology/abstract>)\n" +
                "}");
        ResultSet results = qeDescription.execSelect();
        try
        {  QuerySolution qs = results.next();

            return (qs.get("o")).toString();
        }
        catch (Exception e) {
            return "No book description.";
        }
    }

    @Override
    public String findImageUrl(String bookName) {
        openConnection("qeImageUrl", "select ?o\n" +
                "where {\n" +
                "  ?s ?p ?o filter (?s=<"+bookName+">&&?p=<http://dbpedia.org/ontology/thumbnail>)\n" +
                "}");
        ResultSet results = qeImageUrl.execSelect();
        try
        {  QuerySolution qs = results.next();

            return (qs.get("o")).toString();
        }
        catch (Exception e) {
            return "https://store.lexisnexis.com/__data/assets/image/0003/26571/dummy_cover.jpg";
        }
    }

    @Override
    public boolean existsById(String id) {
        openConnection("qeISBN", "select *\n" +
                " where {\n" +
                "  ?s ?p ?o filter (?o=\""+id+"\"&&?p=<http://dbpedia.org/ontology/isbn>)\n" +
                "}");
        ResultSet results = qeISBN.execSelect();
        try
        {
            QuerySolution qs = results.next();
            closeConnection("qeISBN");
            return true;
        }
        catch (Exception e) {
            closeConnection("qeISBN");
            return false;
        }
    }

    @Override
    public String findById(String id) {
        openConnection("qeISBN", "select ?s\n" +
                "where {\n" +
                "  ?s ?p ?o filter (?o=\""+id+"\"&&?p=<http://dbpedia.org/ontology/isbn>)\n" +
                "}");
        ResultSet results = qeISBN.execSelect();
        try
        {  QuerySolution qs = results.next();
            return qs.get("s").toString();
        }
        catch (Exception e) {
            return "";
        }
    }

    @Override
    public List<String> findAllDistinctAuthors() {
        List<String> authors = new ArrayList<>();
        openConnection("qeAuthor", "select distinct ?o\n" +
                "where {\n" +
                "  ?s ?p ?o filter (?p=<http://dbpedia.org/ontology/author>)\n" +
                "}");
        ResultSet results = qeISBN.execSelect();
        try {
            QuerySolution qs = results.next();
            authors.add(qs.get("s").toString());
        }
        catch (Exception e) {
        System.out.println("error");
        }

        return authors;
    }

    @Override
    public ResultSet findAllBookAuthors() {
        openConnection("qeBookAuthors", "select ?o\n" +
                "where {\n" +
                "\t?s ?p ?o filter (?p=<http://dbpedia.org/ontology/author>&&?o!=\"\")\n" +
                "}\n" +
                "group by ?o");

        return qeBookAuthors.execSelect();
    }

    @Override
    public ResultSet findAllBookGenres() {
        openConnection("qeBookGenres", "select ?o\n" +
                "where {\n" +
                "\t?s ?p ?o filter (?p=<http://dbpedia.org/ontology/literaryGenre>)\n" +
                "}\n" +
                "group by ?o");
        ResultSet results = qeBookGenres.execSelect();

        return results;
    }


    public String findTitleByIsbn(String isbn){

        openConnection("qeISBN", "select ?s ?p ?o \n" +
                "where {?s ?p ?o filter (?o=\""+isbn+"\" )  }");

        ResultSet name = qeISBN.execSelect();
        try
        {  QuerySolution qs = name.next();
            return qs.toString();
        }
        catch (Exception e) {
            return "";
        }
       finally {
            closeConnection("qeISBN");
        }
    }

   @Override
    public void deleteById(String id){
        String tuple = findTitleByIsbn(id).split("s = ")[1];
        String queryString = "delete {?s ?p ?o}" +
                " where {?s ?p ?o filter(?s="+tuple+"}";

        System.out.println(queryString);

        UpdateRequest request = UpdateFactory.create(queryString) ;
        UpdateProcessor proc = UpdateExecutionFactory.createRemote(request, "http://localhost:3030/Books/update") ;
        proc.execute();
   }

    @Override
    public void create(String ISBN, String title, String author, String[] genres, int numberPages,
                       String publicationDate, String description, String imageUrl) {
        title = formatStringFilter(title);
        author = formatStringFilter(author);

        String query = "insert data { " +
                "<http://dbpedia.org/resource/"+ title +"> <http://dbpedia.org/ontology/isbn> \""+ ISBN +"\";\n" +
                "<http://dbpedia.org/ontology/author> <http://dbpedia.org/resource/"+ author +">; \n" +
                "<http://dbpedia.org/ontology/numberOfPages> \"" + numberPages + "\"; \n " +
                "<http://dbpedia.org/property/releaseDate> \"" + publicationDate + "\"; \n " +
                "<http://dbpedia.org/ontology/abstract> \"" + description + "\"; \n " +
                "<http://dbpedia.org/ontology/thumbnail> \"" + imageUrl + "\"; \n ";

        for (int i = 0; i < genres.length; i++) {
            genres[i] = formatStringFilter(genres[i]);
            query += "<http://dbpedia.org/ontology/literaryGenre> \"" + genres[i] + "\" ";
            if(i != genres.length - 1)
                query += ";\n ";
        }

        query += ".\n }";

        UpdateRequest request = UpdateFactory.create(query) ;
        UpdateProcessor proc = UpdateExecutionFactory.createRemote(request, "http://localhost:3030/Books/update") ;
        proc.execute();
    }

    @Override
    public void edit(String ISBN, String title, String author, String[] genres, int numberPages, String publicationDate, String description, String imageUrl) {
        deleteById(ISBN);
        create(ISBN, title, author, genres, numberPages, publicationDate, description, imageUrl);
    }
}
