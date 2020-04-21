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

    public void openConnection(String qe, String query) {
        if(qe == "qeAll")
            qeAll = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                query);
        else if(qe == "qeBookNames")
            qeBookNames = QueryExecutionFactory.sparqlService("http://localhost:3030/Books/query",
                    query);
    }

    @Override
    public void closeConnection(String qe) {
        if(qe == "qeAll")
            qeAll.close();
        else if(qe == "qeBookNames")
            qeBookNames.close();
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
    public boolean existsById(String id) {
        return false;
    }

    @Override
    public Book findById(String id) {
        return null;
    }
}
