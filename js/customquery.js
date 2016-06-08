    $("#s").keyup(function(event){
        if(event.keyCode == 13){
            $('.fetch').click();
        }
    });
    function init()
    {
        hostserverurl = "http://51.254.218.90:8000/CL"
        query  = $('#q').val().replace(/\n/g,' ').replace(/\r/g,' ')
        
        var tmpstr = query.substring(0,query.indexOf('{'))
        tmpstr = tmpstr.replace(/\?/g,' ?')
        tmpstr = tmpstr.replace(/(\(|\))/g,' ')
        tmpstr = tmpstr.split(' ')
        //alert(tmpstr) 
        
        var tmplst = []
        for (var j = 0;j<tmpstr.length;j++)
            if (tmpstr[j][0]=='?' || tmpstr[j]=='as')
                tmplst.push(tmpstr[j])
        
        //alert(tmpstr)  
        tmpstr = []
        var j = 0
        for (j = 0;j<(tmplst.length-1);j++)
            if (tmplst[j+1]!='as' && tmplst[j]!='as')
                tmpstr.push(tmplst[j].substring(1))
        tmpstr.push(tmplst[j].substring(1))
        bd = (tmpstr.join(','))
        
        console.log(bd)   
        
        $('#b').val(bd)
        bd = $('#b').val()
        data = {'query':query,'bindingset':bd,'repository':'ou'}
        start();
    }
    function start()
    {
        url = hostserverurl+"/First.jsp"
        xhr = $.ajax({
                url:url,
                type:'POST',
                data:data,
                success: display,
                error: function(jqXHR, textStatus, errorThrown){$('#d').html(jqXHR.responseText)}
               });
        $('#d').html('<img src="../img/load.gif" height="50px" width="50px"/><br /><input type="button" value="CANCEL REQUEST" onclick="cancel()"/>');
    }
    function display(data)
    {
       
        if (data.replace('<table id="rel" border = "1">','').replace('</table>','').trim()=="")
                data = 'No results'
        $('#d').html('<div class="">'+data.replace('<table id="rel" border = "1">','<table class="table">')+'</div>'+'<h3 id ="download"> <span onmouseover="download()"> Download data as JSoN  <i class="fa fa-download arrow"></i></span></h3><h3 id ="exportdp" title="The data will be saved in dpaste for 1 day only."><span onmouseover="exportdp()"> Export JSoN to dpaste <i class="fa fa-share"></i></span></h3>')
    }
    function getObj()
    {
        var obj = {};

        var rows = $("table > tbody > tr");
        
        var firstRow = rows.filter(":first-child");
        var header = firstRow.find("th").map(function () {
            return $(this).text();
        }).get();
        var arr = rows.not(firstRow).map(function () {
            obj = {};
            $(this).find("td").each(function (i) {
                obj[header[i]] = $(this).text();
            });
            return obj;
        }).get();
        
        return arr;   
    }    
    function download()
    {
        $("#download").html('<span onmouseover="download()"> Download data as JSoN  <i class="fa fa-download arrow"></i>&nbsp;&nbsp;<img style="width:30px" src="../img/load.gif"/></span>')
        var obj = getObj()
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
        $("#download").html('<a href="data:'+data+'" download="query.json">Download data as JSoN  <i class="fa fa-download arrow"></i></a>')
    }
    function exportdp()
    {
        $("#exportdp").html('<span onmouseover="exportdp()"> Export JSoN to dpaste <i class="fa fa-share"></i>&nbsp;&nbsp;<img style="width:30px" src="../img/load.gif"/></span>')
        var obj = getObj()
           $.ajax({
                    url: "http://dpaste.com/api/v2/",
                    data: {
                      content: JSON.stringify(obj),
                      syntax: "json",
                      title: "Query",
                      poster: "CommonLAK",
                      expiry_days: "1"
                    },
                    type: 'POST',
                    success: function(pasteurl) {
                      $("#exportdp").html('<a href="'+pasteurl+'#wrap" target="_blank"> Export JSoN to dpaste <i class="fa fa-share"></i></a>')
                    } ,
                    error: function(a) {console.log(a);$('#D').html("Could not connect to dpaste")}
                  })
    }
    function fill1()
    {
        $('#q').val("SELECT ?s ?p ?o \nWHERE \n{ \n    ?s ?p ?o . \n} \nLIMIT 100");
        $('#b').val("s,p,o")
    }
    function fill2()
    {
        $('#q').val("SELECT distinct ?o \nWHERE \n{ \n    ?s <http://xmlns.com/foaf/0.1/maker>  ?o . \n}");
        $('#b').val("o")
    }
    function fill3()
    {
        $('#q').val("SELECT distinct ?p \nWHERE \n{ \n    ?s ?p ?o . \n}");
        $('#b').val("p")
    }  
    function selectText(containerid) 
    {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().addRange(range);
        }
    } 
