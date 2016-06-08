<%@ page import = "java.io.*"  errorPage="error.jsp"%><%@ page import = "java.util.List" %><%@ page import = "java.util.HashSet" %><%@ page import = "java.util.Arrays" %><%@ page import = "org.openrdf.model.Value" %><%@ page import = "org.openrdf.query.BindingSet" %><%@ page import = "org.openrdf.query.QueryLanguage" %><%@ page import = "org.openrdf.query.TupleQuery" %><%@ page import = "org.openrdf.query.TupleQueryResultHandler" %><%@ page import = "com.franz.agraph.repository.AGCatalog" %><%@ page import = "com.franz.agraph.repository.AGRepository" %><%@ page import = "com.franz.agraph.repository.AGRepositoryConnection" %><%@ page import = "com.franz.agraph.repository.AGServer" %><%! String CATALOG_ID = "/"; %><%! String REPOSITORY_ID = "lak"; %><%! String USERNAME = "Bhargav"; %><%! String PASSWORD = "password"; %><%! String TEMPORARY_DIRECTORY = ""; %><table id="rel" border = "1"><%
    
    String queryString = request.getParameter("query");
    String set = request.getParameter("bindingset");
    response.setHeader("Access-Control-Allow-Origin","*");



    //String queryString = "select ?name where{?s <http://xmlns.com/foaf/0.1/name> ?name . }";
    //String set = "ty";
    
    String SERVER_URL = "http://51.254.218.90:10035";

    REPOSITORY_ID = request.getParameter("repository");
    
    final String vals[] = set.split(",");
    final String [] RETURN_STRING = {""};

    AGServer server = new AGServer(SERVER_URL, USERNAME, PASSWORD);
    AGCatalog catalog = server.getCatalog(CATALOG_ID);          // open catalog
    AGRepository myRepository = catalog.openRepository(REPOSITORY_ID);
    AGRepositoryConnection conn = myRepository.getConnection();
    List<String> indices = conn.listIndices();
    try 
    {
        TupleQuery tupleQuery = conn.prepareTupleQuery(QueryLanguage.SPARQL, queryString);
        tupleQuery.evaluate(new TupleQueryResultHandler() 
        {
            
            @Override
            public void startQueryResult(List<String> bindingNames) 
            {
                //System.out.format("Bindings: %s\n", bindingNames);
                
            }
        
            @Override
            public void handleSolution(BindingSet bindingSet) 
            {
                //Values v[] = new Values [vals.length];
                RETURN_STRING[0] += "<tr>";
                for (int j = 0; j< vals.length; j++)
                {
                    //RETURN_STRING[0] += "<td>"+j+"</td>";
                    Value p = bindingSet.getValue(vals[j]);
                    String s = p+"";
                    if (s.contains("\""))
                    {
                        String [] check = s.split("\"");
                        if (check.length >1)
                            s = check[1];
                    }
                    RETURN_STRING[0] += "<td>"+s+"</td>";
                    
                }
                RETURN_STRING[0] += "</tr>";
            }
        
            @Override
            public void endQueryResult() 
            {
                if(!RETURN_STRING[0].equals(""))
                {
                    String some="<tr>";
                    for (int i=0;i<vals.length;i++)
                            some+="<th>"+vals[i]+"</th>";
                    RETURN_STRING[0]=some + "</tr>" + RETURN_STRING[0] ;
                }
            }
        });
        //long count = tupleQuery.count();
        //out.println("count: " + count);
    } 
    finally    
    {
        conn.close();
    }
    if(RETURN_STRING!=null)
    {   
        String s = RETURN_STRING[0];
        out.println("Data from"+SERVER_URL+s);
    }
    else
        throw new Exception();
%></table>
