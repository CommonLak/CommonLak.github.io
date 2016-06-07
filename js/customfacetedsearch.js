    function init(val)
    {
        $.getJSON("data/faceted_"+val+".json",function(obj){filldata(obj,val)})
        hostserverurl = "http://commonlak-bhargavrao.rhcloud.com"
    }
    function filldata(obj,val)
    {
        max = {'a':1214,'o':369,'c':13}
        fillvalue = '<h2 class="section-heading">Select any of the following</h2>'
        fillvalue+='<h3 class="section-subheading text-muted" id = "showres">Showing the first <span id="numres">10</span> top results.</h3><div id = "holddata">'
        l = 0
        h = 10
        fillvalue+=fillanchs(obj,l,h)
        fillvalue+='</div><h3 class="section-subheading arrow text-muted" id="showmore">Show More</h3>'
        $("#filloptions").html(fillvalue)
        $(".tags").click(function(obj){showresults(obj,val)})
        $("#showmore").click(function(){
            l = h
            h = h + 10
            if (h>max[val]){
                $("#showmore").html('')
                h = max[val]
            }
            $("#holddata").html($("#holddata").html()+fillanchs(obj,l,h))
            $("#numres").html(h)
            $(".tags").click(function(obj){$("#showres").trigger('click');showresults(obj,val)})
        })
    }
    function fillanchs(obj,l,h)
    {
        var temp = ''
        for (var i =l ; i<h;i++){
            tempid = obj[i]['name'].replace(/[,| |(|)|\-|\.]/g, '_');
            temp+='<a href="#results" class="page-scroll"><span class="tags" id="'+tempid+'">'+obj[i]['name']+'<br />('+obj[i]['num']+')</span></a>'
        }
        return temp
    }
    function showresults(obj,val)
    {
        searchdata = $("#"+obj.target.id).html().split('<')[0]
        queries = {'c':"select distinct ?paper  ?key ?value ?label where {?paper <http://data.semanticweb.org/ns/swc/ontology#isPartOf> ?book. ?book <http://swrc.ontoware.org/ontology#booktitle> \""+searchdata+"\" . ?paper <http://purl.org/dc/elements/1.1/title> ?title . ?paper ?key ?value. ?key rdfs:label ?label . values (?label ?pred) {  (\"Month\" 4)  (\"Citation\" 7) (\"Abstract\" 2) (\"Paper Title\" 1) (\"Article Body\" 6) (\"Year\" 5) (\"Maker\" 3) } . } order by ?paper ?pred",
                   'a':"select distinct ?paper  ?key ?value ?label where {?o <http://xmlns.com/foaf/0.1/name> \""+searchdata+"\" . ?paper <http://xmlns.com/foaf/0.1/maker>  ?o .   ?paper <http://purl.org/dc/elements/1.1/title> ?title .   ?paper ?key ?value. ?key rdfs:label ?label . values (?label ?pred) {  (\"Month\" 4)  (\"Citation\" 7) (\"Abstract\" 2) (\"Paper Title\" 1) (\"Article Body\" 6) (\"Year\" 5) (\"Maker\" 3) } . } order by ?paper ?pred" ,
                   'o':"select distinct ?paper  ?key ?value ?label where { ?person <http://swrc.ontoware.org/ontology#affiliation> ?univuri . ?univuri rdfs:label \""+searchdata+"\" . ?person  <http://xmlns.com/foaf/0.1/made> ?paper . ?paper <http://purl.org/dc/elements/1.1/title> ?title .  ?paper ?key ?value. ?key rdfs:label ?label . values (?label ?pred) {  (\"Month\" 4)  (\"Citation\" 7) (\"Abstract\" 2) (\"Paper Title\" 1) (\"Article Body\" 6) (\"Year\" 5) (\"Maker\" 3) } . } order by ?paper ?pred"
                  }
        data = {'query':queries[val],'bindingset':'paper,label,value,key','repository':'ou'}
        console.log(queries[val])
        url = hostserverurl+"/First.jsp"
        xhr = $.ajax({
                url:url,
                type:'POST',
                data:data,
                success: display,
                error: function(jqXHR, textStatus, errorThrown){$('#d').html(jqXHR.responseText)}
               });
        $('#d').html('<img src="../img/load.gif" height="50px" width="50px"/><br /><br />');
        optionsfill = {'c': '<option value="pTitle">Publication</option><option value="aAuthor">Author Name</option><option value="oOrganization">Organization</option>',
                       'a': '<option value="pTitle">Publication</option><option value="oOrganization">Organization</option>',
                       'o': '<option value="pTitle">Publication</option><option value="aAuthor">Authors</option>'
        }

        $("#selectfacet").html("Showing results for <select id='selectedlist' onchange='redisplay(\""+val+"\",\""+searchdata+"\")'>"+optionsfill[val]+"</select>")
        rtype = "pTitle"
    }

    function redisplay(val,searchdata)
    {
        rtype = $('#selectedlist').val()
        queries = {'apTitle':"select distinct ?paper  ?key ?value ?label where {?o <http://xmlns.com/foaf/0.1/name> \""+searchdata+"\" . ?paper <http://xmlns.com/foaf/0.1/maker>  ?o .   ?paper <http://purl.org/dc/elements/1.1/title> ?title .   ?paper ?key ?value. ?key rdfs:label ?label . values (?label ?pred) {  (\"Month\" 4)  (\"Citation\" 7) (\"Abstract\" 2) (\"Paper Title\" 1) (\"Article Body\" 6) (\"Year\" 5) (\"Maker\" 3) } . } order by ?paper ?pred" ,
                   'aoOrganization':"select distinct ?paper  ?key ?value ?label where { ?paper <http://swrc.ontoware.org/ontology#affiliation> ?person . ?paper rdfs:label \""+searchdata+"\" . ?person ?key ?value. ?key rdfs:label ?label . } order by asc(?paper) desc(?label) ",
                   'oaAuthor':"select distinct ?paper  ?key ?value ?label where { ?person <http://swrc.ontoware.org/ontology#affiliation> ?paper . ?paper rdfs:label \""+searchdata+"\" . ?paper ?key ?value. ?key rdfs:label ?label . } order by asc(?paper) desc(?label)",
                   'opTitle':"select distinct ?paper  ?key ?value ?label where { ?person <http://swrc.ontoware.org/ontology#affiliation> ?univuri . ?univuri rdfs:label \""+searchdata+"\" . ?person  <http://xmlns.com/foaf/0.1/made> ?paper . ?paper <http://purl.org/dc/elements/1.1/title> ?title .  ?paper ?key ?value. ?key rdfs:label ?label . values (?label ?pred) {  (\"Month\" 4)  (\"Citation\" 7) (\"Abstract\" 2) (\"Paper Title\" 1) (\"Article Body\" 6) (\"Year\" 5) (\"Maker\" 3) } . } order by ?paper ?pred" , 
                   'caAuthor':"select distinct ?paper ?key ?value ?label where { ?publ <http://data.semanticweb.org/ns/swc/ontology#isPartOf> ?book. ?book <http://swrc.ontoware.org/ontology#booktitle> \""+searchdata+"\" . ?publ <http://xmlns.com/foaf/0.1/maker>  ?paper. ?paper ?key ?value. ?key rdfs:label ?label . values (?label ?pred) { (\"Made\" 6 ) (\"Last Name\" 3 ) (\"First Name\" 2 ) (\"Based Near\"  4) (\"Affliation\" 5 ) (\"Name\" 1) } . } order by asc(?paper) (?pred)" ,
                   'cpTitle':"select distinct ?paper  ?key ?value ?label where {?paper <http://data.semanticweb.org/ns/swc/ontology#isPartOf> ?book. ?book <http://swrc.ontoware.org/ontology#booktitle> \""+searchdata+"\" . ?paper <http://purl.org/dc/elements/1.1/title> ?title . ?paper ?key ?value. ?key rdfs:label ?label . values (?label ?pred) {  (\"Month\" 4)  (\"Citation\" 7) (\"Abstract\" 2) (\"Paper Title\" 1) (\"Article Body\" 6) (\"Year\" 5) (\"Maker\" 3) } . } order by ?paper ?pred",
                   'coOrganization':"select distinct ?paper ?key ?value ?label where {?publ <http://data.semanticweb.org/ns/swc/ontology#isPartOf> ?book. ?book <http://swrc.ontoware.org/ontology#booktitle> \""+searchdata+"\" .  ?publ <http://xmlns.com/foaf/0.1/maker>  ?person. ?person <http://swrc.ontoware.org/ontology#affiliation>  ?paper. ?paper ?key ?value. ?key rdfs:label ?label. } order by asc(?paper) desc(?label) " ,
                  }
        data = {'query':queries[val+rtype],'bindingset':'paper,label,value,key','repository':'ou'}
        console.log(queries[val])
        url = hostserverurl+"/First.jsp"
        xhr = $.ajax({
                url:url,
                type:'POST',
                data:data,
                success: display,
                error: function(jqXHR, textStatus, errorThrown){$('#d').html(jqXHR.responseText)}
               });
        

    }
    function display(data)
    {        
        console.log(data)    
        $('#d').html('Parsing in progress<br /><img src="../img/horizontal_loading.gif" height="26px" width="416px"/>')        
        if (data.replace('<table id="rel" border = "1">','').replace('</table>','').trim()=="")
                $('#d').html('No results for "'+name+'" in "'+rtype.substring(1)+'". Try searching a different keyword or choose a different list;')
        else
        {
            

            tab = document.createElement('table')
            tab.innerHTML = data.substring(29,data.length-6)
            trs = tab.children[0].children
            prev = 0
            val = 0
            num = 0
            clrs = ['red','blue']
            newtab = document.createElement('table');
            tbody = document.createElement('tbody')
            for(var j = 1;j<trs.length;j++)
            {
                row = document.createElement('tr')
                /*td = document.createElement('td')
                row.appendChild(td)*/
                row.style.cursor='pointer';
                tds = trs[j].children
                pres=tds[0].innerHTML
                pres=pres.substring(pres.lastIndexOf('/')+1)
                pres=pres.replace(/\W/g, '')
                //alert(pres)
                if (prev!=pres)
                {
                    val = 1-val;
                    num+=1
                }
                td = document.createElement('td')
                td.width='10%'
                
                td.innerHTML = (prev!=pres)?num:'';
                row.appendChild(td)
                
                if (prev!=pres)
                {    
                    row.id = "row"+pres
                    var s = "."+pres
                    row.setAttribute('data-target',s)
                    row.setAttribute('data-toggle',"collapse")
                }
                for(var k = 1;k<3;k++ )     
                {
                    td = document.createElement('td')
                    td.className+=" justify"
                    var txt = tds[k].innerHTML;
                    td.width = ['20%','70%'][k-1]
                    //td.innerHTML = "blah "
                    checked = false
                    
                    if (k==1)
                    {
                        colorvalue = (prev!=pres)?clrs[val]:'#CC6666'
                        txt = "<a class= 'bright' style='color:"+colorvalue+"' href='"+tds[3].innerHTML+"' target='_blank'>"+txt+"</a>"
                    }

                    if (k == 2 && txt.length>1000)
                    {
                        var cleantxt = txt.replace(/"/g, '\\"');
                        cleantxt = cleantxt.replace(/'/g, "\\'");
                        cleantxt = cleantxt.replace(/(?:\r\n|\r|\n)/g, '<br />');
                        cleantxt = htmlEncode(cleantxt)
                        
                        var smalltxt = txt.substring(0,1000)
                        smalltxt = txt.replace(/"/g, '\\"');
                        smalltxt = smalltxt.replace(/'/g, "\\'");
                        smalltxt = smalltxt.replace(/(?:\r\n|\r|\n)/g, '<br />');
                        smalltxt = htmlEncode(smalltxt)
                        
                        txt = txt.substring(0,1000) + " <br /> <span class = 'arrow bright' onclick = 'event.target.parentElement.innerHTML=\""+cleantxt+" \" '>[Show full]</span>"
                        checked = true
                    }
                    if (txt.indexOf('http://dbpedia.org/resource')>-1)
                    {
                        var ortype = "aBasedNear";
                        txt = "<a class = 'lnk2' title='Search in the "+tds[k-1].innerHTML+" list for "+txt+"' onclick='filltext(\""+txt+"\",\""+ortype+"\")'>"+txt+"</a>"+"</a><i title = 'External Resource' class='fa fa-external-link rowload black' onclick='location.href=\""+txt+"\"'></i> "
                    }
                    else if (txt.indexOf('http://data.linkededucation.org/resource/lak')>-1 && k==2 && prev==pres)
                    {    
                        td.className+=" Lookuprow"+pres
                        //console.log("#"+pres)
                        var addAc = tbody.querySelector("#row"+pres)
                        //alert(addAc.tagName+" "+addAc.className+" "+addAc.id)
                        addAc.addEventListener('click',changeData)
                        txt += '<img class="rowload" title = "Looking up database" src="../img/load.gif"/>'                        
                    }
                    else if(/^[a-zA-Z \.]+$/.test(txt) && k==2 && rtype[0]=='a' && prev==pres)
                    {
                        var ortype = rtype
                        switch(tds[k-1].innerHTML)
                        {
                            case "First Name" : ortype = "aFirstName" ;break
                            case "Last Name"  : ortype = "aLastName"  ;break
                            case "Based Near" : ortype = "aBasedNear" ;break
                        }
                        txt = "<a class = 'lnk2' title='Search in the "+tds[k-1].innerHTML+" list for "+txt+"' onclick='filltext(\""+txt+"\",\""+ortype+"\")'>"+txt+"</a>"+"</a> <i title = 'Internal Link' class='fa fa-link rowload' onclick='filltext(\""+txt+"\",\""+rtype+"\")'></i>"
                    }
                    else if(!checked)
                    {
                        
                        //txt = htmlEncode(txt)
                        txt = txt.replace(/(?:\r\n|\r|\n)/g, '<br />');
                    }
                    td.innerHTML += txt;
                    row.appendChild(td)
                }        
                row.style.color = (prev!=pres)?clrs[val]:'black'
                row.className = (prev!=pres)?'clickable rows':('collapse out budgets '+pres);
                tbody.appendChild(row)
                prev=pres   
                
                if (j%300 == 0)
                {
                    //alert(j)
                    newtab.innerHTML="" 
                    newtab.appendChild(tbody)
                    newtab.className = 'table'
                    $('#d').html('')
                    $('#d').append(newtab)
                    $('#d').html($('#d').html()+'<br /><img src="..img/horizontal_loading.gif" height="26px" width="416px"/> ')    
                }            
            }
            newtab.appendChild(tbody)
            newtab.className = 'table'
            $('#d').html('')
            $('#d').append(newtab)
            //$('#d').html($('#d').html()+'<i class = "fa fa-file-pdf-o bold arrow huge" onclick="demoFromHTML()" title="Convert To PDF"></i>')
        }
        
    }
    function filltext(n,t)
    {
        $('#s').val(n)
        $('#sel').val(t)
        rtype = t
        name = n
        qinit(n,t)
    }
    function changeData(event)
    {

        elems = document.getElementsByClassName('Lookup'+event.target.parentElement.id)
        event.target.parentElement.removeEventListener('click',changeData)
        for (var i = 0;i<elems.length;i++)
        {
            run(i)
        }
    }
    function run(i)
    {
        var ele = elems[i]
        var otxt = ele.innerHTML
        
        otxt = otxt.substring(0,otxt.indexOf('<'))
        var quer = "Select ?name where {<"+otxt+"> rdfs:label ?name . } Limit 1"
        var dataq = {'query':quer,'bindingset':'name','repository':'ou'}
        $.ajax  ({
                type:'POST',
                url:url,
                data:dataq,
                success: function(t){
                     var pt = t.substring(t.indexOf('<td>')+4,t.indexOf('</td>'))
                     var ort = rtype;
                     if(otxt.indexOf('person') > -1) ort =  'aAuthor'
                     else if(otxt.indexOf('paper') > -1) ort =  'pTitle'
                     else if(otxt.indexOf('organization') > -1) ort =  'oOrganization'
                     pt = pt.replace(/'/g, "&#39;");
                     //pt=htmlEncode(pt)
                     if(otxt.indexOf('reference') > -1)
                        var ihtl = pt+ "<i title = 'Search Google' onclick='searchGoogle(\""+pt+"\")' class='fa fa-google rowload bold'>&nbsp;</i>    "
                     else
                        var ihtl = "<a class = 'lnk2' title='Search in the "+ort.substring(1)+" list for "+pt+"' target='_blank' href='../search?q="+pt+"&s="+ort+"'>"+pt+"<a>"+"</a> <i title = 'Internal Link' onclick='filltext(\""+pt+"\",\""+ort+"\")' class='fa fa-link rowload'></i>"
                     if (otxt.indexOf('paper') > -1)
                        ihtl += "<i title = 'Search Google' onclick='searchGoogle(\""+pt+"\")' class='fa fa-google rowload'>&nbsp;</i>    "
                     console.log(ihtl)
                     ele.innerHTML = ihtl
                        
                        
                },
                error: function(jqXHR, textStatus, errorThrown){alert(jqXHR.responseText)}
                })
    }
    function searchGoogle(txt)
    {
        var u = "https://www.google.com/search?q="+encodeURIComponent(txt)+"\r\n"
        window.open(u);
    }
    function htmlEncode(value){
      //create a in-memory div, set it's inner text(which jQuery automatically encodes)
      //then grab the encoded contents back out.  The div never exists on the page.
      return $('<div/>').text(value).html();
    }

    function htmlDecode(value){
      return $('<div/>').html(value).text();
    }   
