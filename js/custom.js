    function changeurl(value)
    {
        index = ((String)(window.location)).lastIndexOf("/");
        window.location = (((String)(window.location)).substring(0,index)+"/"+value)
    }
    function cancel()
    {
        xhr.abort()
        $('#d').html('Request cancelled, <a id="lnq" class="page-scroll" href="#page-top">search</a> again.');
    }   
    function convertJson(data)
    {
        var obj = {};

        var rows = $(data).find('tr');
        
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
