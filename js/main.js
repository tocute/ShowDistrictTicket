$(document).on("mobileinit",function(e)
{
    
});

$(document).on("pageinit","#page-1",function(e)
{
    Parse.initialize("CPFQXuoHErkxiN8b3uDFuGuGBnZbLen9jglvAB4p", "qvHqLCDitrqkwAL3bSbMfbdcYlUY9wlfVJZmom3S");
    var mDistrictIDArray = [6301200,6301100,6301000,6300900,6300100,6300200,6300400,6300600,6300500,6300700,6300300,6300800];
    var mDistrictNameArray = ["北投","士林","內湖","南港","松山","信義","中山","大同","中正","萬華","大安","文山"];

    var mDistrictDisplayOrder = 0;
    var mTimerInterval = 30000;
    var mMaxRow = 38;

    var onBtnGetPreTicketClick = function (e)
    {
        mDistrictDisplayOrder -= 2;
        if(mDistrictDisplayOrder < 0)
            mDistrictDisplayOrder = 10;
        updateTable(mDistrictDisplayOrder);
        updateTable(mDistrictDisplayOrder+1);
    }

    var onBtnGetNextTicketClick = function (e)
    {
        mDistrictDisplayOrder += 2;
        if(mDistrictDisplayOrder > 11)
            mDistrictDisplayOrder = 0;
        updateTable(mDistrictDisplayOrder);
        updateTable(mDistrictDisplayOrder+1);
    }
      
    var addTable = function(districtId,col)
    {
        var table = $("#bigTableLeft");
        var table_id = "myTableLeft"+col;
        if(districtId%2 == 1)
        {
            table = $("#bigTableRight");
            table_id = "myTableRight"+col;
        } 
        var table_bg_color = "<colgroup><col style=background-color:#d1d1d1><col style=background-color:#ccecf2><col style=background-color:#f9f8f2></colgroup>";
        var table_header = "<thead><tr><th>投票所</th> <th>連勝文</th> <th>柯文哲</th> </tr></thead>";
        table.append("<td  valign=top> <table id="+table_id+" style='border:1px #2e565b solid;padding:5px;' rules='all' cellpadding='5';>"+table_bg_color+table_header+"<tbody></tbody></table></td>");
        return table_id;
    }

    var updateTable = function (districtDisplayId)
    {
        $.mobile.loading( 'show', {
            text: '資料更新中...',
            textVisible: true,
            theme: 'z',
            html: ""
            });

        var table = $("#bigTableLeft");
        var districtName = $("#leftDistrictName");
        if(districtDisplayId%2 == 1)
        {
            table = $("#bigTableRight");
            districtName = $("#rightDistrictName");
        } 
        table.empty();
        districtId = mDistrictIDArray[districtDisplayId];
        districtName.text((districtDisplayId+1)+". "+ mDistrictNameArray[districtDisplayId]);

        var TicketInfoObject = Parse.Object.extend("TicketInfoObject");
        var query = new Parse.Query(TicketInfoObject);
        query.limit(1000);
        query.equalTo("districtId", ""+districtId);
        query.find({
            success: function(results) 
            {
                var totalCandidate7Tictet = 0;
                var totalCandidate6Tictet = 0;
                var table_element = null;
                var table_id = null;
                var table_num = 1;
                
                for(var i = 0; i<results.length; i++)
                {
                    if(i % mMaxRow == 0)
                    {
                        table_id = addTable(districtDisplayId,table_num++);
                        table_element = $("#"+table_id);
                    }
                    
                    var entiry = results[i];

                    var candidate7Tictet = entiry.get("candidate7");
                    var candidate6Tictet = entiry.get("candidate6");
                    var voteHouseId = entiry.get("voteHouseId");

                    totalCandidate7Tictet += candidate7Tictet;
                    totalCandidate6Tictet += candidate6Tictet;

                    //+ 'tr:last'
                    table_element.append('<tr><td>'+voteHouseId+'</td><td>'+candidate6Tictet+'</td><td>'+candidate7Tictet+'</td></tr>');
                }

                table_element.append('<tr><td><b>區總票數</b></td><td><b>'+totalCandidate6Tictet+'</b></td><td><b>'+totalCandidate7Tictet+'</b></td></tr>');
                $.mobile.loading( 'hide');
            },
            error: function(error) 
            {
                alert("Error: " + error.code + " " + error.message);
                $.mobile.loading('hide');
            }
        }); 
    }

    var onBtnSetTimer = function (e)
    {
        var target = $(e.currentTarget);
        var state = target.attr("value");
        if(state == "true")
        {
            state = "false";  
            target.text("開始更新");
            clearInterval(mUpdateTimer);
            //$("#my_image").attr("src","image/btn_start_update.png");
            //target.append('<img src="image/btn_start_update.png"/>');
        } 
        else
        {
            state = "true";
            target.text("停止更新");
            mUpdateTimer = window.setInterval(initUpdate, mTimerInterval); 
            //target.append('<img src="image/btn_stop_update.png"/>');
            //$("#my_image").attr("src","image/btn_stop_update.png");
        }    
        target.attr("value",state);
    }

    function initUpdate()
    {
        updateTable(mDistrictDisplayOrder);
        updateTable(mDistrictDisplayOrder+1);
    };

    initUpdate();
    var mUpdateTimer = window.setInterval(initUpdate, mTimerInterval);
    //6300100 - 6301200
    $("#btn_pre").on("click",onBtnGetPreTicketClick);
    $("#btn_next").on("click",onBtnGetNextTicketClick);
    $("#btn_timer").on("click",onBtnSetTimer);
    
});