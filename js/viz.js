
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
    function start(sample)
    {
        hostserverurl = "http://commonlak-bhargavrao.rhcloud.com"
        chartype = sample
        //$('.a').css({'display':'none'});
        url = hostserverurl+"/First.jsp"
        switch (sample)
        {
            case 1: $('#d').removeClass('chartdiv')
                    query = "select ?name (count(?paper) as ?numofpapers)  where { ?person rdfs:label ?name . ?person <http://xmlns.com/foaf/0.1/made> ?paper .  } group by ?name order by asc(?name) limit 50"
                    bd = 'name,numofpapers'
                    break;
            case 2: $('#d').removeClass('chartdiv')
                    query = "select ?univ (count(?paper) as ?numofpapers)  where { ?person <http://swrc.ontoware.org/ontology#affiliation> ?univuri .  ?univuri rdfs:label ?univ .  ?person  <http://xmlns.com/foaf/0.1/made> ?paper .  } group by ?univ order by asc(?univ) "
                    bd = 'univ,numofpapers'
                    break;
            case 3: $('#d').addClass('chartdiv')
                    genmap()
                    return
        }
        $('#d').html('<canvas id="myChart"></canvas>')
        data = {query:query,bindingset:bd,repository:'ou'}
        xhr = $.ajax({
                url:url,
                type:'POST',
                data:data,
                success: ChartJSStuff,
                error: function(jqXHR, textStatus, errorThrown){alert(jqXHR.responseText)}
               });
        
    }
    
    function ChartJSStuff(data)
    {
        var arr = convertJson(data)
        //alert(JSON.stringify(arr))
        if (chartype == 1)
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
            console.log(JSON.stringify(finaljson))
            var ctx = $("#myChart").get(0).getContext("2d");
            var myLineChart = new Chart(ctx).Line(finaljson,{    tooltipXOffset: 10});
        }
        else if (chartype == 2)
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
    function genmap()
    {

       
        
         mapData = [
        {"code":"DZ" , "name":"Algeria", "value":1, "color":"black"},
        {"code":"AU" , "name":"Australia", "value":29, "color":"black"},
        {"code":"AU" , "name":"Australia ", "value":2, "color":"black"},
        {"code":"AT" , "name":"Austria", "value":7, "color":"black"},
        {"code":"AT" , "name":"Austria ", "value":2, "color":"black"},
        {"code":"BE" , "name":"Belgium", "value":8, "color":"black"},
        {"code":"BA" , "name":"Bosnia_and_Herzegovina", "value":1, "color":"black"},
        {"code":"BR" , "name":"Brasil", "value":2, "color":"black"},
        {"code":"BR" , "name":"Brazil", "value":3, "color":"black"},
        {"code":"BG" , "name":"Bulgaria", "value":1, "color":"black"},
        {"code":"CA" , "name":"Canada", "value":48, "color":"black"},
        {"code":"CL" , "name":"Chile", "value":1, "color":"black"},
        {"code":"CN" , "name":"China", "value":6, "color":"black"},
        {"code":"CZ" , "name":"Czech", "value":1, "color":"black"},
        {"code":"CZ" , "name":"Czech_Republic", "value":6, "color":"black"},
        {"code":"DK" , "name":"Denmark", "value":5, "color":"black"},
        {"code":"EC" , "name":"Ecuador", "value":2, "color":"black"},
        {"code":"EG" , "name":"Egypt", "value":1, "color":"black"},
        {"code":"EE" , "name":"Estonia", "value":2, "color":"black"},
        {"code":"FR" , "name":"FRANCE", "value":3, "color":"black"},
        {"code":"FI" , "name":"Finland", "value":2, "color":"black"},
        {"code":"FR" , "name":"France", "value":10, "color":"black"},
        {"code":"DE" , "name":"GERMANY", "value":1, "color":"black"},
        {"code":"DE" , "name":"Germany", "value":44, "color":"black"},
        {"code":"GR" , "name":"Greece", "value":9, "color":"black"},
        {"code":"IL" , "name":"ISRAEL", "value":8, "color":"black"},
        {"code":"IN" , "name":"India", "value":1, "color":"black"},
        {"code":"IE" , "name":"Ireland", "value":6, "color":"black"},
        {"code":"IL" , "name":"Israel", "value":7, "color":"black"},
        {"code":"IT" , "name":"Italia", "value":1, "color":"black"},
        {"code":"IT" , "name":"Italy", "value":6, "color":"black"},
        {"code":"JP" , "name":"JAPAN", "value":3, "color":"black"},
        {"code":"JP" , "name":"Japan", "value":9, "color":"black"},
        {"code":"KP" , "name":"Korea", "value":3, "color":"black"},
        {"code":"LU" , "name":"Luxembourg", "value":2, "color":"black"},
        {"code":"MX" , "name":"MEXICO", "value":1, "color":"black"},
        {"code":"MY" , "name":"Malaysia", "value":1   , "color":"black"},
        {"code":"MJ" , "name":"Malta", "value":1, "color":"black"},
        {"code":"MX" , "name":"Mexico", "value":3, "color":"black"},
        {"code":"NL" , "name":"Netherlands", "value":21, "color":"black"},
        {"code":"NZ" , "name":"New_Zeland", "value":1, "color":"black"},
        {"code":"NG" , "name":"Nigeria", "value":1, "color":"black"},
        {"code":"NO" , "name":"Norway", "value":1, "color":"black"},
        {"code":"PH" , "name":"Philippines", "value":2, "color":"black"},
        {"code":"PT" , "name":"Portugal", "value":6, "color":"black"},
        {"code":"RO" , "name":"Romania", "value":1, "color":"black"},
        {"code":"RU" , "name":"Russia", "value":2, "color":"black"},
        {"code":"RS" , "name":"Serbia", "value":2, "color":"black"},
        {"code":"SK" , "name":"Slovak", "value":1, "color":"black"},
        {"code":"SK" , "name":"Slovakia", "value":2, "color":"black"},
        {"code":"SI" , "name":"Slovenia", "value":1, "color":"black"},
        {"code":"ZA" , "name":"South_Africa", "value":2, "color":"black"},
        {"code":"KR" , "name":"South_Korea", "value":5, "color":"black"},
        {"code":"ES" , "name":"Spain", "value":42, "color":"black"},
        {"code":"CH" , "name":"Switzerland", "value":5, "color":"black"},
        {"code":"TW" , "name":"Taiwan", "value":1, "color":"black"},
        {"code":"NL" , "name":"The_Netherlands", "value":9, "color":"black"},
        {"code":"TR" , "name":"Turkey", "value":1, "color":"black"},
        {"code":"GB" , "name":"UK", "value":38, "color":"black"},
        {"code":"US" , "name":"USA", "value":371, "color":"black"},
        {"code":"US" , "name":"USA ", "value":9, "color":"black"},
        {"code":"GB" , "name":"United_Kingdom", "value":1, "color":"black"},
        {"code":"FI" , "name":"finland", "value":1, "color":"black"}
        ];
        latvalues = {'Brazil': {'latitude': -10, 'longitude': -55}, 'Canada': {'latitude': 54, 'longitude': -100}, 'ISRAEL': {'latitude': 31.5, 'longitude': 34.75}, 'finland': {'latitude': 62, 'longitude': 26}, 'Italy': {'latitude': 42.8333, 'longitude': 12.8333}, 'USA': {'latitude': 38, 'longitude': -97}, 'MEXICO': {'latitude': 23, 'longitude': -102}, 'Serbia': {'latitude': 44, 'longitude': 21}, 'Bosnia_and_Herzegovina': {'latitude': 44, 'longitude': 18}, 'Luxembourg': {'latitude': 49.75, 'longitude': 6}, 'France': {'latitude': 46, 'longitude': 2}, 'Italia': {'latitude': 42.8333, 'longitude': 12.8333}, 'Ireland': {'latitude': 53, 'longitude': -8}, 'Czech_Republic': {'latitude': 49.75, 'longitude': 15.5}, 'Norway': {'latitude': 62, 'longitude': 10}, 'Nigeria': {'latitude': 10, 'longitude': 8}, 'Ecuador': {'latitude': -2, 'longitude': -77.5}, 'South_Korea': {'latitude': 37, 'longitude': 127.5}, 'Slovakia': {'latitude': 48.6667, 'longitude': 19.5}, 'Israel': {'latitude': 31.5, 'longitude': 34.75}, 'Australia': {'latitude': -27, 'longitude': 133}, 'Algeria': {'latitude': 28, 'longitude': 3}, 'Malaysia': {'latitude': 2.5, 'longitude': 112.5}, 'South_Africa': {'latitude': -29, 'longitude': 24}, 'Turkey': {'latitude': 39, 'longitude': 35}, 'Slovenia': {'latitude': 46, 'longitude': 15}, 'The_Netherlands': {'latitude': 52.5, 'longitude': 5.75}, 'China': {'latitude': 35, 'longitude': 105}, 'Chile': {'latitude': -30, 'longitude': -71}, 'Austria ': {'latitude': 47.3333, 'longitude': 13.3333}, 'Belgium': {'latitude': 50.8333, 'longitude': 4}, 'GERMANY': {'latitude': 51, 'longitude': 9}, 'Germany': {'latitude': 51, 'longitude': 9}, 'Spain': {'latitude': 40, 'longitude': -4}, 'Netherlands': {'latitude': 52.5, 'longitude': 5.75}, 'Brasil': {'latitude': -10, 'longitude': -55}, 'Denmark': {'latitude': 56, 'longitude': 10}, 'Philippines': {'latitude': 13, 'longitude': 122}, 'Finland': {'latitude': 62, 'longitude': 26}, 'Korea': {'latitude': 40, 'longitude': 127}, 'Australia ': {'latitude': -27, 'longitude': 133}, 'Malta': {'latitude': 35.8833, 'longitude': 14.5}, 'Japan': {'latitude': 36, 'longitude': 138}, 'Switzerland': {'latitude': 47, 'longitude': 8}, 'United_Kingdom': {'latitude': 54, 'longitude': -2}, 'New_Zeland': {'latitude': -41, 'longitude': 174}, 'Russia': {'latitude': 60, 'longitude': 100}, 'Bulgaria': {'latitude': 43, 'longitude': 25}, 'Romania': {'latitude': 46, 'longitude': 25}, 'Portugal': {'latitude': 39.5, 'longitude': -8}, 'Estonia': {'latitude': 59, 'longitude': 26}, 'Mexico': {'latitude': 23, 'longitude': -102}, 'Czech': {'latitude': 49.75, 'longitude': 15.5}, 'USA ': {'latitude': 38, 'longitude': -97}, 'India': {'latitude': 20, 'longitude': 77}, 'FRANCE': {'latitude': 46, 'longitude': 2}, 'Egypt': {'latitude': 27, 'longitude': 30}, 'Austria': {'latitude': 47.3333, 'longitude': 13.3333}, 'Slovak': {'latitude': 48.6667, 'longitude': 19.5}, 'UK': {'latitude': 54, 'longitude': -2}, 'Greece': {'latitude': 39, 'longitude': 22}, 'JAPAN': {'latitude': 36, 'longitude': 138}, 'Taiwan': {'latitude': 23.5, 'longitude': 121}}


        // map;
         minBulletSize = 3;
         maxBulletSize = 70;
         min = Infinity;
         max = -Infinity;


        // get min and max values
        for (var i = 0; i < mapData.length; i++) {
	        var value = mapData[i].value;
	        if (value < min) {
		        min = value;
	        }
	        if (value > max) {
		        max = value;
	        }
        }

         // build map



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

	// create circle for each country



	// it's better to use circle square to show difference between values, not a radius
    var maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
    var minSquare = minBulletSize * minBulletSize * 2 * Math.PI;

    // create circle for each country
    for (var i = 0; i < mapData.length; i++) {
        var dataItem = mapData[i];
        var value = dataItem.value;
        // calculate size of a bubble
        var square = (value - min) / (max - min) * (maxSquare - minSquare) + minSquare;
        if (square < minSquare) {
            square = minSquare;
        }
        var size = Math.sqrt(square / (Math.PI * 2));
        var id = dataItem.code;

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

	map.dataProvider = dataProvider;
    map.export = {
    	enabled: true
    }
	map.write("d");
          
}
