    $("#s").keyup(function(event){
        if(event.keyCode == 13){
            $('.fetch').click();
        }
    });
    (window.onpopstate = function (event) {
        

        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
           urlParams[decode(match[1])] = decode(match[2]);

        if(JSON.stringify(urlParams) == "{}")
        {

        }
        else
        {
            $('#s').val(urlParams['q'])
            $('#sel').val(urlParams['s'])
            $('#fetchresults')[0].click()
        }
    })();
    function init()
    {
        name  = $('#s').val()
        rtype = $('#sel').val()
        hostserverurl = "http://commonlak-bhargavrao.rhcloud.com"
        qinit(name,rtype)
    }
    function qinit(name,rtype)
    {
        history.pushState({earname:name,eartyp:rtype}, "page "+hisstate, "SearchPage.html");
        hisstate+=1
        if ((name.toLowerCase().indexOf("delete") > -1) || (/[%<>\[\]{}]/.test(name)))
        {   
            var injtxt = 'We have taken care of SPARQL Injections. Please do not exploit a educational resource.<br /><br /><br /><a href="http://xkcd.com/327/"><img src="../img/xkcd.png" /></a><br /><br /><br />Kindly <a id="lnq" class="page-scroll" href="#page-top" onclick="$(\'#btt\').click();">search</a> again'
            $('#d').html(injtxt);
        }
        else
        {
            name = name
            rtype = rtype
                 
            switch (rtype)
            {
                case "aAuthor"       : predicate = "<http://xmlns.com/foaf/0.1/name>" ;  break
                case "aFirstName"    : predicate = "<http://xmlns.com/foaf/0.1/firstName>" ;  break
                case "aLastName"     : predicate = "<http://xmlns.com/foaf/0.1/lastName>" ;  break
                case "aBasedNear"    : predicate = "<http://xmlns.com/foaf/0.1/based_near>" ;  break
                case "pTitle"        : predicate = "<http://purl.org/dc/elements/1.1/title>" ; break
                case "pBody"         : predicate = "<http://schema.org/articleBody>" ; break
            }
            if(rtype[0]=='a')
                query = "select distinct ?person ?keys ?key ?value where { ?person "+predicate+" ?name . ?person <http://xmlns.com/foaf/0.1/made>  ?x. ?person ?keys ?value .  ?keys rdfs:label ?key . values (?key ?pred) { (\"Made\" 6 ) (\"Last Name\" 3 ) (\"First Name\" 2 ) (\"Based Near\"  4) (\"Affliation\" 5 ) (\"Name\" 1) } .  FILTER(CONTAINS (lcase(str(?name)), \""+name.toLowerCase()+"\" ) ) } order by asc(?person) (?pred)"
            else if(rtype[0]=='o')
                query = "select distinct ?person ?keys ?key ?value where { ?person <http://xmlns.com/foaf/0.1/name> ?name . ?x <http://swrc.ontoware.org/ontology#affiliation>  ?person.  ?person ?keys ?value .  ?keys rdfs:label ?key . FILTER(CONTAINS (lcase(str(?name)), \""+name.toLowerCase()+"\" ) ) } order by asc(?person) "
            else if(rtype[0]=='p')
                query = "SELECT distinct ?person ?keys  ?key  ?value WHERE {     ?person ?keys ?value .    ?person  "+predicate+"  ?o .    FILTER(CONTAINS (lcase(str(?o)), \""+name.toLowerCase()+"\")) . values (?key ?pred) {  (\"Month\" 4)  (\"Citation\" 7) (\"Abstract\" 2) (\"Paper Title\" 1) (\"Article Body\" 6) (\"Year\" 5) (\"Maker\" 3) } .   ?keys rdfs:label ?key . } order by (?person) (?pred)"
            else if(rtype[0]=='e')
                query = "SELECT distinct ?person ?keys  ?key  ?value WHERE {     ?person ?keys ?value .     FILTER(CONTAINS (lcase(str(?value)), \""+name.toLowerCase()+"\")) . ?keys rdfs:label ?key . } order by (?person) "
            data = {'query':query,'bindingset':'person,key,value,keys','repository':'ou'}
            start();
        }
    }
    function start()
    {
        //$('.a').css({'display':'none'});
        url = hostserverurl+"/First.jsp"
        urla = url + "?bindingset=person,key,value,keys&repository=ou"
        urla += "&query="+query
        console.log(query)
        xhr = $.ajax({
                url:url,
                type:'POST',
                data:data,
                success: display,
                error: function(jqXHR, textStatus, errorThrown){$('#d').html(jqXHR.responseText)}
               });
        $('#d').html('<img src="../img/load.gif" height="50px" width="50px"/><br /><br /><input type="button" value="CANCEL REQUEST" onclick="cancel()"/>');
        
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
                    $('#d').html($('#d').html()+'<br /><img src="../img/horizontal_loading.gif" height="26px" width="416px"/> ')    
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
                        var ihtl = "<a class = 'lnk2' title='Search in the "+ort.substring(1)+" list for "+pt+"' onclick='filltext(\""+pt+"\",\""+ort+"\")'>"+pt+"<a>"+"</a> <i title = 'Internal Link' onclick='filltext(\""+pt+"\",\""+ort+"\")' class='fa fa-link rowload'></i>"
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
    function demoFromHTML() 
    {
        var pdf = new jsPDF('p', 'pt', 'letter');

        pdf.cellInitialize();
        pdf.setFontSize(6);
        $.each( $('tr'), function (i, row){
            $.each( $(row).find("td"), function(j, cell){
                var txt = $(cell).text().trim() || " ";
                width=40
                switch(j)
                {
                    case 0: width = 20; break
                    case 1: width = 80; break
                    case 2: width = 480; break
                }
                pdf.cell(10, 10, width, 12, txt, i);
            });
        });

        pdf.save('sample-file.pdf');
    } 
