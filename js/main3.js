$(function() {

  $("#leftHeaderImage").bind("click",function(){
     nowIndex-=2;
     
     if (nowIndex <0) {
      nowIndex = districts.length-2;
     };
     console.log(nowIndex);
     retrieveData();
  });

  $("#rightHeaderImage").bind("click",function(){
     nowIndex+=2;
     
     if (nowIndex > districts.length-1) {
      nowIndex = 0;
     };

     retrieveData();
  });


    Parse.initialize("CPFQXuoHErkxiN8b3uDFuGuGBnZbLen9jglvAB4p", "qvHqLCDitrqkwAL3bSbMfbdcYlUY9wlfVJZmom3S");
    var mDistrictIDArray = [6301200,6301100,6301000,6300900,6300100,6300200,6300400,6300600,6300500,6300700,6300300,6300800];
    var mDistrictNameArray = ["北投","士林","內湖","南港","松山","信義","中山","大同","中正","萬華","大安","文山"];
    var mTimerInterval = 30000;
    var districts=[];
    var nowLeftData, nowRightData;
    var nowIndex=0;

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
    };

    var getDistrictName = function(id) {
      var dictName = {};
      switch(id) {
        case 6301200:
          dictName={"zh":"北投", "en":"Beitou", "background" : "#e73736"};
          break;
        case 6301100:
          dictName={"zh":"士林", "en":"Shihlin", "background" : "#e73736"};
          break;
        case 6301000:
          dictName={"zh":"內湖", "en":"Neihu", "background" : "#875389"};
          break;
        case 6300900:
          dictName={"zh":"南港", "en":"Nangang", "background" : "#875389"};
          break;
        case 6300100:
          dictName={"zh":"松山", "en":"Songshan", "background" : '#008865'};
          break;
        case 6300200:
          dictName={"zh":"信義", "en":"Sinyi", "background" : '#008865'};
          break;
        case 6300400:
          dictName={"zh":"中山", "en":"Jhongshan", "background" : '#f3981c'};
          break;
        case 6300600:
          dictName={"zh":"大同", "en":"Datong", "background" : '#f3981c'};
          break;
        case 6300500:
          dictName={"zh":"中正", "en":"Jhongjheng", "background" : '#10376b'};
          break;
        case 6300700:
          dictName={"zh":"萬華", "en":"Wanhua", "background" : '#10376b'};
          break;
        case 6300300:
          dictName={"zh":"大安", "en":"Daan", "background" : '#00a9be'};
          break;
        case 6300800:
          dictName={"zh":"文山", "en":"Wunshan", "background" : '#00a9be'};
          break;
      }
      return dictName;
    };

    var getAllDistrictData = function() {
      
      while (districts.length) {
        districts.pop();
      };

      $("#loader").show();
      Parse.Cloud.run("GetAllDistrictTicket",null, 
      {
        success: function(results) {

          for(var i = 0; i<results.length; i++) {
            var temp = results[i];
            var name = getDistrictName(temp.districtId);
            var district = {
              "candidate6":temp.candidate6,
              "candidate7":temp.candidate7,
              "districtId":temp.districtId,
              "totalVoteHouseCount":temp.totalVoteHouseCount,
              "unfinishedVoteHouse":temp.unfinishedVoteHouse,
              "zhName":name.zh,
              "engName":name.en,
              "color":name.background
            };
            districts.push(district);
          };

          var leftDistrictId = mDistrictIDArray[nowIndex];
          var rightDistrictId = mDistrictIDArray[nowIndex+1];

          retrieveData();
          $("#loader").hide();
        },
        error: function(error) 
        {
            /*{
                "code":141,
                "message":"密碼錯誤  請再次確認投票所編號與密碼"
            }*/
            alert(JSON.stringify(error.message));
            $("#loader").hide();
        }
      });
    };

    var retrieveData = function() {

      var leftDistrictId = mDistrictIDArray[nowIndex];
      var rightDistrictId = mDistrictIDArray[nowIndex+1];

      for (var i = 0; i < districts.length; i++) {
        if (leftDistrictId === districts[i].districtId) {
          nowLeftData = districts[i];
        } if (rightDistrictId === districts[i].districtId) {
          nowRightData = districts[i];
        }
      }
      console.log(nowLeftData);
      //$('#leftHeader').text(districts[0].zhName);
      $('#leftHeaderImage').attr("src", "image/district/"+ nowLeftData.engName +".png");
      $('#leftDiv').attr("style", "background-image: url(image/map/"+ nowLeftData.engName +".png);");
      $('#leftSevenTicketNum').text(Math.floor(nowLeftData.candidate7/10000) + "萬" + nowLeftData.candidate7%10000 + "票");
      $('#leftSixTicketNum').text(Math.floor(nowLeftData.candidate6/10000) + "萬" + nowLeftData.candidate6%10000 + "票");
      $('#leftVoteHouseCount').text(''+ nowLeftData.zhName +'區總投票所 '+ nowLeftData.totalVoteHouseCount +' 間');
      $("#leftSevenProgress #progress").attr("style","width: " + Math.floor((nowLeftData.candidate7/(nowLeftData.candidate7+nowLeftData.candidate6)*100)) +"%");
      $("#leftSevenProgress #progress span").text(Math.floor(nowLeftData.candidate7/(nowLeftData.candidate7+nowLeftData.candidate6)*100) +"%");
      $("#leftSixProgress #progress").attr("style","width: " + Math.floor((nowLeftData.candidate6/(nowLeftData.candidate7+nowLeftData.candidate6)*100)) +"%");
      $("#leftSixProgress #progress span").text(Math.floor(nowLeftData.candidate6/(nowLeftData.candidate7+nowLeftData.candidate6)*100) +"%");
      $("#leftVoteProgress #progress").attr("style","width: "+ Math.floor(((nowLeftData.totalVoteHouseCount-nowLeftData.unfinishedVoteHouse)/nowLeftData.totalVoteHouseCount)*100) +"%");
      $("#leftVoteProgress #progress span").text(Math.floor(((nowLeftData.totalVoteHouseCount-nowLeftData.unfinishedVoteHouse)/nowLeftData.totalVoteHouseCount)*100) +"%");
      $('#leftVoteProgress #progress').css("background-color", nowLeftData.color);
      //$('#rightHeader').text(districts[1].zhName);        
      $('#rightHeaderImage').attr("src", "image/district/"+ nowRightData.engName +".png");
      $('#rightDiv').attr("style", "background-image: url(image/map/"+ nowRightData.engName +".png);");
      $('#rightSevenTicketNum').text(Math.floor(nowRightData.candidate7/10000) + "萬" + nowRightData.candidate7%10000 + "票");
      $('#rightSixTicketNum').text(Math.floor(nowRightData.candidate6/10000) + "萬" + nowRightData.candidate6%10000 + "票");
      $('#rightVoteHouseCount').text(''+ nowRightData.zhName +'區總投票所 '+ nowRightData.totalVoteHouseCount +' 間');
      $("#rightSevenProgress #progress").attr("style","width: " + Math.floor((nowRightData.candidate7/(nowRightData.candidate7+nowRightData.candidate6)*100)) +"%");
      $("#rightSevenProgress #progress span").text(Math.floor(nowRightData.candidate7/(nowRightData.candidate7+nowRightData.candidate6)*100) +"%");
      $("#rightSixProgress #progress").attr("style","width: " + Math.floor((nowRightData.candidate6/(nowRightData.candidate7+nowRightData.candidate6)*100)) +"%");
      $("#rightSixProgress #progress span").text(Math.floor(nowRightData.candidate6/(nowRightData.candidate7+nowRightData.candidate6)*100) +"%");
      $("#rightVoteProgress #progress").attr("style","width: "+ Math.floor(((nowRightData.totalVoteHouseCount-nowRightData.unfinishedVoteHouse)/nowRightData.totalVoteHouseCount)*100) +"%");
      $("#rightVoteProgress #progress span").text(Math.floor(((nowRightData.totalVoteHouseCount-nowRightData.unfinishedVoteHouse)/nowRightData.totalVoteHouseCount)*100) +"%");
      $('#rightVoteProgress #progress').css("background-color", nowRightData.color);
    }

    getAllDistrictData();

    setInterval(getAllDistrictData, 30000);

});
