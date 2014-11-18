$(document).on("mobileinit",function(e)
{
    
});

$(document).on("pageinit","#page-1",function(e)
{
    Parse.initialize("CPFQXuoHErkxiN8b3uDFuGuGBnZbLen9jglvAB4p", "qvHqLCDitrqkwAL3bSbMfbdcYlUY9wlfVJZmom3S");
    var mDistrictId = 6300100;
    
    var onBtnGetPreTicketClick = function (e)
    {
        mDistrictId -= 100;
        if(mDistrictId < 6300100)
            mDistrictId = 6301200;
        updateTable(mDistrictId);
    }

    var onBtnGetNextTicketClick = function (e)
    {
        mDistrictId += 100;
        if(mDistrictId > 6301200)
            mDistrictId = 6300100;
        updateTable(mDistrictId);
    }
      
    var updateTable = function (districtId)
    {
        var temp_list = $("#ticketList");
        temp_list.empty();
        $("#districtName").text("區域 : "+ getDistrictName(districtId));

        var TicketInfoObject = Parse.Object.extend("TicketInfoObject");
        var query = new Parse.Query(TicketInfoObject);
        query.equalTo("districtId", ""+districtId);
        query.find({
            success: function(results) 
            {
                var totalCandidate7Tictet = 0;
                var totalCandidate6Tictet = 0;
                for(var i = 0; i<results.length; i++)
                {
                    var entiry = results[i];
                    var districtId = entiry.get("districtId");
                    var candidate7Tictet = entiry.get("candidate7");
                    var candidate6Tictet = entiry.get("candidate6");

                    totalCandidate7Tictet += candidate7Tictet;
                    totalCandidate6Tictet += candidate6Tictet;

                    //var mydata = JSON.parse(district);
                    //mydata[districtId];
                    temp_list.append("<li>"+"District :  白："+candidate7Tictet +" 藍："+candidate6Tictet+"</li>");
                }
                temp_list.append("<li> 白總："+totalCandidate7Tictet +" 藍總："+totalCandidate6Tictet+"</li>");
                temp_list.listview("refresh");
            },
            error: function(error) 
            {
                alert("Error: " + error.code + " " + error.message);
            }
        }); 
    }

    var getDistrictName = function (districtId)
    {
        var district_name = null;
        if(districtId == 6301200)
        {
            district_name = "北投";  //1北投
        }
        else if(districtId == 6301100)
        {
            district_name = "士林";  //2士林
        }
        else if(districtId == 6301000)
        {
            district_name = "內湖";  //3內湖
        }
        else if(districtId == 6300900)
        {
            district_name = "南港";  //4南港
        }
        else if(districtId == 6300100)
        {
            district_name = "松山";  //5松山
        }
        else if(districtId == 6300200)
        {
            district_name = "信義"; //6信義
        }
        else if(districtId == 6300400)
        {
            district_name = "中山"; //7中山
        }
        else if(districtId == 6300600)
        {
            district_name = "大同";  //8大同
        }
        else if(districtId == 6300500)
        {
            district_name = "中正";  //9中正
        }
        else if(districtId == 6300700)
        {
            district_name = "萬華";  //10萬華
        }
        else if(districtId == 6300300)
        {
            district_name = "大安";  //11大安
        }
        else if(districtId == 6300800)
        {
            district_name = "文山";  //12文山
        }

        return district_name;
    }

    updateTable(mDistrictId);
    //6300100 - 6301200
    $("#btn_pre").on("click",onBtnGetPreTicketClick);
    $("#btn_next").on("click",onBtnGetNextTicketClick);
});