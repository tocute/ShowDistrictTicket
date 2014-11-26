$(function() {

	var allVoteHouse=0;
	var allUnFinishedVoteHouse=0;
	var allTicketsSix=0;
	var allTicketsSeven=0;

	Parse.initialize('CPFQXuoHErkxiN8b3uDFuGuGBnZbLen9jglvAB4p', 'qvHqLCDitrqkwAL3bSbMfbdcYlUY9wlfVJZmom3S');

	var retrieveData = function() {
		console.log(allTicketsSeven);
		$('.leftTicket').text(Math.floor(allTicketsSeven/10000) + "萬" + allTicketsSeven%10000 + "票");
		$('.rightTicket').text(Math.floor(allTicketsSix/10000) + "萬" + allTicketsSix%10000 + "票");
		$('.leftPercentage').text(Math.floor(allTicketsSeven/(allTicketsSix+allTicketsSeven)*100) +'%');
		$('.rightPercentage').text(Math.floor(allTicketsSix/(allTicketsSix+allTicketsSeven)*100) +'%');
		$('.TotalVoteLabel').text('總投票所'+allVoteHouse+'間');
		$('.progressBar .progress-bar-custom').css('width', Math.floor(((allVoteHouse-allUnFinishedVoteHouse)/allVoteHouse)*100) +"%");
		$('.progressBar .progressBarPercentageLabel').text(Math.floor(((allVoteHouse-allUnFinishedVoteHouse)/allVoteHouse)*100) +"%");
	};

	var getAllDistrictData = function() {
		$('#loader').show()
		Parse.Cloud.run("GetAllDistrictTicket",null, {
			success: function(results) {

			  for(var i = 0; i<results.length; i++) {
			    var temp = results[i];
			    allVoteHouse += parseInt(temp.totalVoteHouseCount);
			    allUnFinishedVoteHouse += parseInt(temp.unfinishedVoteHouse);
			    allTicketsSeven += parseInt(temp.candidate7);
			    allTicketsSix += parseInt(temp.candidate6);
			  };

			  retrieveData();
			  $('#loader').hide();
			},
			error: function(error) 
			{
			    /*{
			        "code":141,
			        "message":"密碼錯誤  請再次確認投票所編號與密碼"
			    }*/
			    alert(JSON.stringify(error.message));
			    $('#loader').hide();
			}
		});
	};

	getAllDistrictData();
	
});