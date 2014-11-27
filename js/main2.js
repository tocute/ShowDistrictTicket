$(document).on("mobileinit",function(e)
{
    
});

$(document).on("pageinit","#page-1",function(e)
{
    Parse.initialize("CPFQXuoHErkxiN8b3uDFuGuGBnZbLen9jglvAB4p", "qvHqLCDitrqkwAL3bSbMfbdcYlUY9wlfVJZmom3S");
    var mDistrictIDArray = [6301200,6301100,6301000,6300900,6300100,6300200,6300400,6300600,6300500,6300700,6300300,6300800];
    var mDistrictNameArray = ["北投","士林","內湖","南港","松山","信義","中山","大同","中正","萬華","大安","文山"];
    var mTimerInterval = 30000;
    var getDistrictIndex = function (id)
    {
        var index = -1;
        for(var i = 0; i<mDistrictIDArray.length; i++)
        {
            if(mDistrictIDArray[i] == id)
            {
                index = i;
                break;
            }
        }
        return index;
    }

    var addTable = function(col)
    {
        var table = $("#bigTableLeft");
        var table_id = "myTableLeft"+col;
        if(col%2 == 1)
        {
            table = $("#bigTableRight");
            table_id = "myTableRight"+col;
        } 
        var table_bg_color = "<colgroup><col style=background-color:#d1d1d1><col style=background-color:#ccecf2><col style=background-color:#f9f8f2></colgroup>";
        var table_header = "<thead><tr><th>行政區</th> <th>連勝文</th> <th>柯文哲</th> </tr></thead>";
        table.append("<td  valign=top> <table id="+table_id+" style='border:1px #2e565b solid;padding:5px;' rules='all' cellpadding='5';>"+table_bg_color+table_header+"<tbody></tbody></table></td>");
        return table_id;
    }

    var onBtnGetAllTicketClick = function (e)
    {
        $.mobile.loading( 'show', {
            text: '資料更新中...',
            textVisible: true,
            theme: 'z',
            html: ""
        });


        Parse.Cloud.run("GetAllDistrictTicket",null, 
        {
            success: function(results) 
            {
                var totalCandidate7Tictet = 0;
                var totalCandidate6Tictet = 0;
                var json_data = [];

                $("#"+mLeftTableID +" tbody tr").remove();
                $("#"+mRightTableID+" tbody tr").remove();
                $("#bigTable tr").remove();

                for(var ii = 0; ii < 12; ii++)
                {
                    var result_obj = {districtId:0, candidate7:0, candidate6:0};
                    json_data.push(result_obj);
                } 

                for(var i = 0; i<results.length; i++)
                {
                    var entiry = results[i];
                    var district_Id = entiry.districtId
                    var district_Id_index = getDistrictIndex(district_Id);

                    json_data[district_Id_index].districtId = parseInt(district_Id);
                    json_data[district_Id_index].candidate7 = entiry.candidate7;
                    json_data[district_Id_index].candidate6 = entiry.candidate6                
                }


                for(var i = 0; i<json_data.length; i++)
                {
                    var table_element = $("#"+mLeftTableID);
                    if(i%2 == 1)
                        table_element = $("#"+mRightTableID);

                    var entiry = json_data[i];

                    var candidate7Tictet = entiry.candidate7;
                    var candidate6Tictet = entiry.candidate6;
                    var districtId = entiry.districtId;

                    totalCandidate7Tictet += candidate7Tictet;
                    totalCandidate6Tictet += candidate6Tictet;

                    //+ 'tr:last'
                    table_element.append('<tr><td>'+mDistrictNameArray[getDistrictIndex(districtId)]+'區</td><td>'+candidate6Tictet+'</td><td>'+candidate7Tictet+'</td></tr>');
                }
                table_element = $("#bigTable");
                table_element.append('<tr><td><b>總票</b></td><td><b>'+totalCandidate6Tictet+'</b></td><td><b>'+totalCandidate7Tictet+'</b></td></tr>');
                $.mobile.loading( 'hide');
            },
            error: function(error) 
            {
                /*{
                    "code":141,
                    "message":"密碼錯誤  請再次確認投票所編號與密碼"
                }*/
                alert(JSON.stringify(error.message));
                $.mobile.loading( 'hide');
            }
        });  
    }
    var mLeftTableID = addTable(0);
    var mRightTableID = addTable(1);
    var mUpdateTimer = window.setInterval(onBtnGetAllTicketClick, mTimerInterval);
    onBtnGetAllTicketClick();
    
});