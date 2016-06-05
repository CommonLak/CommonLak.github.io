    function init()
    {
        plottype = $('#sel').val()
        showdata(plottype)
    }
    function showdata(plottype)
    {
        if(plottype == "bar"){
            rows = {"Organization":["Number of Papers","Number of People"],"Article Body":["Length"],"Title":["Length"],"Author Based Near":["Number of authors"]}
        }
        else if(plottype == "line"){
            rows = {"Organization":["Number of Papers","Number of People"],"Article Body":["Length"],"Title":["Length"],"Author Based Near":["Number of authors"]}
        }
        else if(plottype == "pie"){
            rows = {"Organization":["Number of Papers","Number of People"],"Article Body":["Length"],"Title":["Length"],"Author Based Near":["Number of authors"]}
        }
        else if(plottype == "map"){
            rows = {"Author Based Near":["Number of authors"]}
        }
        else
        {
            rows = {}
        }
        show = '<div class="supplied"><table id = "table" class="fillwidth"> <tr><th>Select Any One</th><th>Column</th><th class="thirdcol tchead">Attribute</th><th class="thirdcol tchead">Download</th><th class="thirdcol tchead">Fetch Graph</th></tr>'
        for (i in rows){
            show += '<tr><td><i class="fa fa-star-o arrow" id="Selected_'+i.replace(/ /g,'_')+'"></i></td><td>'+i+'</td><td class = "thirdcol" id="Selected_'+i.replace(/ /g,'_')+'_ThirdCol"><select id="Selected_'+i.replace(/ /g,'_')+'_Viz_value" class="fillwidth attribute">'
            for (j in rows[i]) {
                show+='<option value="'+rows[i][j].replace(/ /g,'_')+'">'+rows[i][j]+'</option>'
            }
            show += '</select></td><td id="Selected_'+i.replace(/ /g,'_')+'_ThirdCol_download"  title="Download Data" class="thirdcol minilinks"><i class="fa fa-download minilinks arrow" id="Selected_'+i.replace(/ /g,'_')+'_Down"></i></td><td id="Selected_'+i.replace(/ /g,'_')+'_ThirdCol_graph"  title="Draw Graph" class="thirdcol minilinks"><a class="page-scroll fa fa-hand-o-right minilinks arrow black" href="#graph" id="Selected_'+i.replace(/ /g,'_')+'_Viz"></a></td></tr>'
        }
        show += '</table><br /></div>'
        show += "<div class='Byod'><a href='#data' class='arrow' onclick='byod()'><h2>Bring your own data</h2><p>Supply the JSON file, We'll visualize Your data</p></a></div>"
        $("#filloptions").html(show)
        for (i in rows) {
            $("#Selected_"+i.replace(/ /g,'_')).click(function(value){selected(value,rows)}) 
            $("#Selected_"+i.replace(/ /g,'_')+"_Down").mouseover(function(value){download(value,rows)}) 
            $("#Selected_"+i.replace(/ /g,'_')+"_Viz").click(function(value){visualize(value,plottype,rows)})            
        }
    }
    function byod()
    {
        //$("#filloptions").fadeOut()
        $("#standardtext").html("Enter the URL of the JSON data that you have")
        $("#filloptions").html("<input class = 'a' style='width:60%;height:60px' type = 'search' id = 'urlofbyod'  placeholder='Enter URL of the resource' title='Enter Url of the resource' autofocus required/><div class='adjustcenter'> <br /><a class = 'page-scroll btn fetch btn-xl'  href='#graph' onclick = 'visualizebyod()'>Fetch Results</a><div onclick='pastebyod()' class='btn'>I don't have a link</div>")
    }
    function pastebyod()
    {
        $("#standardtext").html("You can export data from the <a href = 'QueryPage.html'>Query Page</a> to dpaste and then use the URL here. Else paste your JSON data here")
        $("#filloptions").html("<textarea class='form-control a' style='height:200px' id = 'pastedjson' required title = 'Enter Data' placeholder = 'Enter Data'/></textarea><br /><div class='adjustcenter'><a class = 'page-scroll btn fetch btn-xl '  href='#graph' onclick = 'visualizebyodpaste()'>Fetch Results</a><div onclick='byod()' class='btn'>I have a link, Sorry</div>")  
    }
    function visualizebyodpaste()
    {
        console.log($('#pastedjson').val())
        try{
            arr = JSON.parse($('#pastedjson').val().replace(/\n/g,' ').replace(/\r/g,' '))
        }
        catch(error){
            $("#d").html("<h3>The supplied data is incorrect, It is not a valid JSON. Please recheck the data and try again</h3>")
            return;
        }
        $('#d').html('<canvas id="myChart"></canvas>')
        if(plottype == "bar" || plottype == "line" || plottype == "pie")
            ChartJSStuff(arr,plottype)
        else if (plottype == "map")
            genmap(arr)        
    }
    function visualizebyod()
    {
        filename = $("#urlofbyod").val()
        if (filename.indexOf("://")==-1) 
            filename = "http://"+filename
        $('#d').html('<canvas id="myChart"></canvas>')
        if(plottype == "bar" || plottype == "line" || plottype == "pie")
            $.getJSON(filename,function(arr){ChartJSStuff(arr,plottype)})
        else if (plottype == "map")
            $.getJSON(filename, genmap)        
    }
    function selected(value,rows)
    {
        for(i in rows)
        {
            if ("Selected_"+i.replace(/ /g,'_') == value.target.id) {
                $("#"+value.target.id).removeClass('fa-star-o').addClass('fa-star')
                $("#"+value.target.id+"_ThirdCol").css({'visibility':'visible'})
                $("#"+value.target.id+"_ThirdCol_graph").css({'visibility':'visible'})
                $("#"+value.target.id+"_ThirdCol_download").css({'visibility':'visible'})
            }
            else {
                $("#Selected_"+i.replace(/ /g,'_')).removeClass('fa-star').addClass('fa-star-o')
                $("#Selected_"+i.replace(/ /g,'_')+"_ThirdCol").css({'visibility':'hidden'})
                $("#Selected_"+i.replace(/ /g,'_')+"_ThirdCol_graph").css({'visibility':'hidden'})
                $("#Selected_"+i.replace(/ /g,'_')+"_ThirdCol_download").css({'visibility':'hidden'})
            }
        }
        $(".tchead").css({'visibility':'visible'})
        
    }
    function getfilename(value)
    {
        datafile = "data/"        
        trgtid = value.target.id        
        valuename = trgtid.substring(trgtid.indexOf('_')+1,trgtid.lastIndexOf('_'))
        nextval = value.target.id.replace("Down","Viz")
        return(datafile+valuename+"_"+$("#"+nextval+"_value").val()+".json")
    }
    function visualize(value,plottype,rows)
    {
        filename = getfilename(value)
        $('#d').html('<canvas id="myChart"></canvas>')
        if(plottype == "bar" || plottype == "line" || plottype == "pie")
            $.getJSON(filename,function(arr){ChartJSStuff(arr,plottype)})
        else if (plottype == "map")
            $.getJSON(filename, genmap)
    }
    function download(value,rows)
    {        
    
        filename = getfilename(value)   
        $("#"+value.target.id.replace("_Down","_ThirdCol_download")).html('<img style="width:15px" src="../../img/load.gif"/>')
        $.getJSON(filename, function(obj){
            var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
            $("#"+value.target.id.replace("_Down","_ThirdCol_download")).html('<a class="black" href="data:'+data+'" download="query.json"><i class="fa fa-download minilinks arrow" id="Selected_'+i.replace(/ /g,'_')+'_Down"></i></a>')
        })   
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
    
    function ChartJSStuff(arr,chartype)
    {

        if (chartype == "bar" || chartype == "line")
        {
            var finaljson = {}
            var labels = []
            var datapoints = [[],[]]
            for (var i=0;i<arr.length;i++)
            {
                var item = arr[i]
                var cnt = 0
                for (var j in item)
                {
                    if (cnt==0){labels.push(item[j].substring(0,40));cnt++;}
                    else {datapoints[cnt-1].push(item[j]);cnt++;}
                    
                }
            }
            
            var datasets = []
            var grad = 220
            for (var i=0;i<datapoints.length;i++)
            {
               
                datasets.push({data:datapoints[i],fillColor: "rgba("+grad+",220,220,0.2)",})
                grad-=20
            }
            finaljson.labels = labels
            finaljson.datasets = datasets
            //console.log(JSON.stringify(finaljson))
            var ctx = $("#myChart").get(0).getContext("2d");
            if (chartype == "bar") {
                var myBarChart = new Chart(ctx).Bar(finaljson,{tooltipXOffset: 10});
            }
            else if (chartype == "line") {
                var myLineChart = new Chart(ctx).Line(finaljson,{tooltipXOffset: 10});
            }
        }
        else if (chartype == "pie")
        {
        
            var finaljson = []
            for (var i=0;i<arr.length;i++)
            {
                var item = arr[i]
                var cnt = 0
                var values = {}
                for (var j in item)
                {
                    
                    if (cnt==0){values.label = item[j];cnt++;}
                    else if (cnt==1){values.value = item[j];cnt++;}
                    
                }
                values.color = "black"
                values.highlight = "#FED136"
                finaljson.push(values)
            }
            console.log(JSON.stringify(finaljson))
            var ctx = $("#myChart").get(0).getContext("2d");
            var myPieChart = new Chart(ctx).Doughnut(finaljson);
        }
    }
    function genmap(arr)
    {
        mapData = []
        
        testvalue = arr[0]
        testbit = false
        cntryattribute = ""
        valueattribute = ""
        
        no_of_cols = 0
        for (i in testvalue){
            no_of_cols++;
            if (no_of_cols==3)
            {        
                $("#d").html("<h3>The supplied data is incorrect, It contains too many columns. Please recheck the data and try again</h3>")
                return;                
            }
            if(testvalue[i].startsWith("http://dbpedia.org/resource/"))
            {
                testbit = true;
                cntryattribute = i;
            }
            else
            {
                valueattribute = i;
            }
        }
        if (!testbit){        
            $("#d").html("<h3>The supplied data is incorrect, It does not contain any country related data. Please recheck the data and try again</h3>")
            return;
        }
        
        for (i in arr){
            countryname = arr[i][cntryattribute].substring(28).trim()
            if(countryname!="")
                mapData.push({"name":countryname, "value":arr[i][valueattribute], "color":"black"})
        }

        latvalues = {'Brazil': {'latitude': -10, 'longitude': -55}, 'Canada': {'latitude': 54, 'longitude': -100}, 'ISRAEL': {'latitude': 31.5, 'longitude': 34.75}, 'finland': {'latitude': 62, 'longitude': 26}, 'Italy': {'latitude': 42.8333, 'longitude': 12.8333}, 'USA': {'latitude': 38, 'longitude': -97}, 'MEXICO': {'latitude': 23, 'longitude': -102}, 'Serbia': {'latitude': 44, 'longitude': 21}, 'Bosnia_and_Herzegovina': {'latitude': 44, 'longitude': 18}, 'Luxembourg': {'latitude': 49.75, 'longitude': 6}, 'France': {'latitude': 46, 'longitude': 2}, 'Italia': {'latitude': 42.8333, 'longitude': 12.8333}, 'Ireland': {'latitude': 53, 'longitude': -8}, 'Czech_Republic': {'latitude': 49.75, 'longitude': 15.5}, 'Norway': {'latitude': 62, 'longitude': 10}, 'Nigeria': {'latitude': 10, 'longitude': 8}, 'Ecuador': {'latitude': -2, 'longitude': -77.5}, 'South_Korea': {'latitude': 37, 'longitude': 127.5}, 'Slovakia': {'latitude': 48.6667, 'longitude': 19.5}, 'Israel': {'latitude': 31.5, 'longitude': 34.75}, 'Australia': {'latitude': -27, 'longitude': 133}, 'Algeria': {'latitude': 28, 'longitude': 3}, 'Malaysia': {'latitude': 2.5, 'longitude': 112.5}, 'South_Africa': {'latitude': -29, 'longitude': 24}, 'Turkey': {'latitude': 39, 'longitude': 35}, 'Slovenia': {'latitude': 46, 'longitude': 15}, 'The_Netherlands': {'latitude': 52.5, 'longitude': 5.75}, 'China': {'latitude': 35, 'longitude': 105}, 'Chile': {'latitude': -30, 'longitude': -71}, 'Austria ': {'latitude': 47.3333, 'longitude': 13.3333}, 'Belgium': {'latitude': 50.8333, 'longitude': 4}, 'GERMANY': {'latitude': 51, 'longitude': 9}, 'Germany': {'latitude': 51, 'longitude': 9}, 'Spain': {'latitude': 40, 'longitude': -4}, 'Netherlands': {'latitude': 52.5, 'longitude': 5.75}, 'Brasil': {'latitude': -10, 'longitude': -55}, 'Denmark': {'latitude': 56, 'longitude': 10}, 'Philippines': {'latitude': 13, 'longitude': 122}, 'Finland': {'latitude': 62, 'longitude': 26}, 'Korea': {'latitude': 40, 'longitude': 127}, 'Australia ': {'latitude': -27, 'longitude': 133}, 'Malta': {'latitude': 35.8833, 'longitude': 14.5}, 'Japan': {'latitude': 36, 'longitude': 138}, 'Switzerland': {'latitude': 47, 'longitude': 8}, 'United_Kingdom': {'latitude': 54, 'longitude': -2}, 'New_Zeland': {'latitude': -41, 'longitude': 174}, 'Russia': {'latitude': 60, 'longitude': 100}, 'Bulgaria': {'latitude': 43, 'longitude': 25}, 'Romania': {'latitude': 46, 'longitude': 25}, 'Portugal': {'latitude': 39.5, 'longitude': -8}, 'Estonia': {'latitude': 59, 'longitude': 26}, 'Mexico': {'latitude': 23, 'longitude': -102}, 'Czech': {'latitude': 49.75, 'longitude': 15.5}, 'USA ': {'latitude': 38, 'longitude': -97}, 'India': {'latitude': 20, 'longitude': 77}, 'FRANCE': {'latitude': 46, 'longitude': 2}, 'Egypt': {'latitude': 27, 'longitude': 30}, 'Austria': {'latitude': 47.3333, 'longitude': 13.3333}, 'Slovak': {'latitude': 48.6667, 'longitude': 19.5}, 'UK': {'latitude': 54, 'longitude': -2}, 'Greece': {'latitude': 39, 'longitude': 22}, 'JAPAN': {'latitude': 36, 'longitude': 138}, 'Taiwan': {'latitude': 23.5, 'longitude': 121}}


         minBulletSize = 5;
         maxBulletSize = 30;
         min = Infinity;
         max = -Infinity;

        for (var i = 0; i < mapData.length; i++) {
	        var value = parseInt(mapData[i].value);
	        if (value < min) {
		        min = value;
	        }
	        if (value > max) {
		        max = value;
	        }
        }

         if (AmCharts.isReady) {
              configChart();
            } else {
              AmCharts.ready(configChart);
            }
}
function configChart() 
{
  	AmCharts.theme = AmCharts.themes.dark;
	map = new AmCharts.AmMap();

	//map.addTitle("Population of the World in 2011", 14);
	//map.addTitle("source: Gapminder", 11);
	map.areasSettings = {
		unlistedAreasColor: "#000000",
		unlistedAreasAlpha: 0.1
	};
	map.imagesSettings.balloonText = "<span style='font-size:14px;'><b>[[title]]</b>: [[value]]</span>";

	var dataProvider = {
		mapVar: AmCharts.maps.worldLow,
		images: []
	}

    var maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
    var minSquare = minBulletSize * minBulletSize * 2 * Math.PI;

    for (var i = 0; i < mapData.length; i++) {
        var dataItem = mapData[i];
        var value = dataItem.value;
        var square = (value - min) / (max - min) * (maxSquare - minSquare) + minSquare;
        if (square < minSquare) {
            square = minSquare;
        }
        var size = Math.sqrt(square / (Math.PI * 2));
        var id = dataItem.code;        
        if(!(dataItem.name in latvalues))
            console.log(dataItem.name)
        else {
            dataProvider.images.push({
                type: "circle",
                width: size,
                height: size,
                color: dataItem.color,
                longitude: latvalues[dataItem.name].longitude,
                latitude: latvalues[dataItem.name].latitude,
                title: dataItem.name,
                value: value
            });
        }
    }
    $('#d').addClass('chartdiv')
	map.dataProvider = dataProvider;
    map.export = {
    	enabled: true
    }
	map.write("d");          
}
