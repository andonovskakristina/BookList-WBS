package mk.ukim.finki.wp.booklist.repositories.impl;

import mk.ukim.finki.wp.booklist.models.Book;
import mk.ukim.finki.wp.booklist.repositories.BookRepository;

import java.util.List;

import java.util.UUID;

import org.apache.jena.query.*;
import org.springframework.stereotype.Repository;

import static org.apache.jena.query.ResultSetFactory.copyResults;
import static org.apache.jena.query.ResultSetFactory.makeRewindable;

@Repository
public class BookRepositoryImpl implements BookRepository {

    QueryExecution qeAll;
    QueryExecution qeBookNames;
    QueryExecution qeAuthor;
    QueryExecution qeISBN;
    QueryExecution qeGenres;

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
    }

    @Override
    public void closeConnection(String qe) {
       /* if(qe.equals("qeAll"))
            qeAll.close();*/
         if(qe.equals("qeBookNames"))
            qeBookNames.close();
      else if(qe.equals("qeAuthor"))
            qeAuthor.close();
        else if(qe.equals("qeISBN"))
            qeISBN.close();
        else if(qe.equals("qeGenres"))
            qeGenres.close();
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
                "}");
        ResultSet results = qeBookNames.execSelect();

        return results;
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
            return "";
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
            return "";
        }
    }

    @Override
    public boolean existsById(String id) {
        return false;
    }

    @Override
    public Book findById(String id) {
        return null;
    }
}
