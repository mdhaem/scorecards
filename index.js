$( document ).ready(function(){
	
	$('#newgametxt').each(function() {
	    var default_value = this.value;
	    $(this).focus(function() {
	        if(this.value == default_value) {
	            this.value = '';
	        }
	    });
	    $(this).blur(function() {
	        if(this.value == '') {
	            this.value = default_value;
	        }
	    });
	});
	
	hideNewGame();
	hideNewGroup();
	
    $.ajax({
        type: "GET",
        url: "http://doihaveit.net/service/CardGame.php?method=getCardGames",
        dataType: "json",
        success: function(resp){
            // we have the response
            //alert("Succes data returned is:\n '" + resp + "'");
            //alert(resp.length);
            var html = '';
            var len = resp.length;
            for (var i = 0; i< len; i++) {
                html += '<option value="' + resp[i].idCardGame + '">' + resp[i].cardGameName + '</option>';
            }
            //alert(html);
            $('#selectcardgame').append(html);

        },
        error: function(xhr, status, error) {
            //var err = eval("(" + xhr.responseText + ")");
            alert(xhr.responseText + error + status);
        }

    });
	
	///REMOVE CLICKED LI
    $("#newgroupplayerlist").click(function () {
		alert("li clicked");
	 });
	
	
	///NEW GAME
	$("#addnewgame").click(function() {
	    //$("#newgamediv").css('display','inline');
		$("#cardgameselectdiv").css('display','none');
		$("#selectcardgame").css('display','none');
		$("#addnewgame").css('display','none');
		showNewGame();
			
	 });
	
	///NEW PLAYER GROUP
	$("#createnewgroup").click(function() {
		showNewGroup();
		hideSelectPlayerGroup();
		newgroupplayerlist($("#newgroupsizetxt").val());
		populatePlayers();	
	});
		
	///SELECTED GAME
    $( "#selectcardgame" ).change(function() {
		
		///IF CARDGAME HAS NOT CHANGED THEN INCREMENT GAME COUNT
		if($("#cardgame").attr('value') === $("#selectcardgame option:selected" ).attr('value')){
			var counter = $("#game").val($("#cardgame").attr('value'));
			counter++;
			$("#game").val(counter);
		} 
		
		///SET CARDGAME HIDDEN VALUE
		$( "#cardgame" ).val($("#selectcardgame option:selected" ).attr('value'));
		
		///HIDE GAME SELECT
		//$("#selectcardgame, #addnewgame, #cardgameselectdiv").css('display','none');
		hideSelectGame();
		
		///DISPLAY PLAYER GROUP SELECT AND POPULATE WITH GROUP NAMES
        $("#selectplayergroup, #addnewplayer, #createnewgroup").css('display','inline');
        getGroupNames();
    });
	
	///SELECTED PLAYER GROUP
    $( "#selectplayergroup" ).change(function() {
		
		///DISPLAY AND POPULATE PLAYER GROUP SELECT
        $("#cardgameplayergroupdiv").css('display','inline');
		$("#shanghaiscorecard").css('display','inline');
		populatePlayerNames($("#selectplayergroup option:selected" ).attr('value'));
		
		///POPULATE HISTORY
		getHistory();
		
		///POPULATE HIDDEN INPUT
		$( "#team" ).val($("#selectplayergroup option:selected" ).attr('value'));
		
		//alert($("#team" ).attr('value'));
		
		///HIDE GAME AND TEAM SELECTS
		$("#cardgameselectdiv").css('display','none');
		$("#cardgameplayergroupdiv").css('display','none');
		$("#selectcardgame").css('display','none');
		$("#selectplayergroup").css('display','none');
		$("#createnewgroup").css('display','none');
    });

	///CALCULATE GAME TOTALS WHEN TALLY BUTTON IS CLICKED
    $("#tally").click(function(){
        calculateSum();
        calculateSumOfTwelve();
    });

	///AUTOMATIC SCORE TALLY
    $(".scoreplayerone,.scoreplayertwo,.scoreplayerthree,.scoreplayerfour").change(function(){

        var row = $(this).closest('tr');
        var scoreplayerone = parseFloat(row.find('.scoreplayerone').val());
        var scoreplayertwo = parseFloat(row.find('.scoreplayertwo').val());
        var scoreplayerthree = parseFloat(row.find('.scoreplayerthree').val());
        var scoreplayerfour = parseFloat(row.find('.scoreplayerfour').val());

        if($.isNumeric(scoreplayerone) && $.isNumeric(scoreplayertwo) && $.isNumeric(scoreplayerthree) && $.isNumeric(scoreplayerfour)) {
            calculateSum();
			calculateSumOfTwelve();
        }
    });

	///SAVE GAME SCORES
    $("#savescores").click(function(){
		//alert("Save Score Clicked");
		saveGameScores();
		$("#savescores").css('display','none');
		$("#tally").css('display','none');
    });
	
	$("#newgroupsizetxt").change(function(){
		//alert("newgroupsizetxt changed");
		newgroupplayerlist($("#newgroupsizetxt").val());
	});
	
	///REMOVE PLAYER FROM SELECT LIST AND ADD TO UNORDERED LIST
	$('#selectplayername').on('change', function (e) {
    	var optionSelected = $("option:selected", this);
		//alert($(optionSelected).attr('value'));
		selectedPlayerId = $(optionSelected).attr('value');
		selectedPlayerName = $(optionSelected).text();
	        if (selectedPlayerId == 0) {
	            alert("Select a player for the new group.");
	        } else {
	            var option = new Option(selectedPlayerName, selectedPlayerId);
	            $(option).html(selectedPlayerName);
	            $('#selectplayername option:selected').remove(); // remove selected option
	            updateNewGroupPlayerList(selectedPlayerId, selectedPlayerName);
				selectedPlayerId = 0;
	            selectedPlayerName = '';
	        }
	    });
	
});

///UPDATE NEW GROUP PLAYER LIST
function updateNewGroupPlayerList(selectedPlayerId, selectedPlayerName){
	//$('ol li:nth-child(1)').text(selectedPlayerName);
	var $lis = $('ol li');

	for(var i=0; i < $lis.length; i++)
	{
		if ($('ol li:eq(' + i + ')').text() == ''){
			$('ol li:eq(' + i + ')').text(selectedPlayerName);
			return;
		}
	}
}

function hideSelectGame(){
	$("#cardgameselectdiv").css('display','none');
	$("#selectcardgame").css('display','none');
	$("#addnewgame").css('display','none');
	$("#game").text($( "#selectcardgame option:selected" ).text());
}

///HIDE SELECT PLAYER GROUP
function hideSelectPlayerGroup(){
	$("#cardgameplayergroupdiv").css('display','none');
	$("#selectplayergroup").css('display','none');
	$("#createnewgroup").css('display','none');
}

///HIDE NEW GAME
function hideNewGame(){
	$('#newgamediv').css('display','none');
	$('#newgamelbl').css('display','none');
	$('#newgametxt').css('display','none');
	$('#cancelsavenewgame').css('display','none');
	$('#cancelnewgame').css('display','none');
	$('#savenewgame').css('display','none');
}
///SHOW NEW GAME
function showNewGame(){
	$('#newgamediv').css('display','inline');
	$('#newgamelbl').css('display','inline');
	$('#newgametxt').css('display','inline');
	$('#cancelsavenewgame').css('display','block');
	$('#cancelnewgame').css('display','inline');
	$('#savenewgame').css('display','inline');
}

///HIDE NEW GROUP
function hideNewGroup(){
	$('#newgroupdiv').css('display','none');
	$('#newgroupsizelbl').css('display','none');
	$('#newgroupsizetxt').css('display','none');
	$('#selectplayername').css('display','none');
	$('#aaddnewplayer').css('display','none');
	$('#newgroupplayerlist').css('display','none');
	$('#cancelsavenewgroup').css('display','none');
	$('#cancelnewgroup').css('display','none');
	$('#savenewgroup').css('display','none');
}

///SHOW NEW GROUP
function showNewGroup(){
	$('#newgroupdiv').css('display','inline');
	$('#newgroupsizelbl').css('display','inline');
	$('#newgroupsizetxt').css('display','inline');
	$('#selectplayername').css('display','inline');
	$('#aaddnewplayer').css('display','inline');
	$('#newgroupplayerlist').css('display','inline');
	$('#cancelsavenewgroup').css('display','inline');
	$('#cancelnewgroup').css('display','inline');
	$('#savenewgroup').css('display','inline');
}

///GET PLAYERS
function populatePlayers(){
    $.ajax({
        type: "GET",
        url: "http://doihaveit.net/service/CardGame.php?method=getPlayers",
        dataType: "json",
        success: function(resp){
            var html = '';
            var len = resp.length;
            for (var i = 0; i< len; i++) {
                html += '<option value="' + resp[i].idPlayer + '">' + resp[i].playerName + '</option>';
             }
            //alert(html);
            $('#selectplayername').append(html);

        },
        error: function(xhr, status, error) {
            //var err = eval("(" + xhr.responseText + ")");
            alert(xhr.responseText + error + status);
        }

    });
}

///MAKE PLAYER LIST
function newgroupplayerlist(players){
	var html = '<ol id="newgroupplayerlist">';
	var x = 0;
    for (var i = 0; i < players; i++) {
		html += '<li class="'+i+'" value=""></li>';		
    }
	html += '</ol>';
	
	$('#newgroupplayerlist').replaceWith(html);
}

///GET PLAYERS HISTORY
function getHistory(){
	var playersHistory = ["#historyone", "#historytwo", "#historythree", "#historyfour"];
    $.ajax({
        type: "GET",
        url: "http://doihaveit.net/service/CardGame.php?method=getHistory",
        dataType: "json",
        success: function(resp){
            var html = '';
            var len = resp.length;
            for (var i = 0; i< len; i++) {
				//alert("idPlayer"+resp[i].idPlayer);
				//alert("playersHistory" + $(playersHistory[resp[i].idPlayer]));
                $(playersHistory[(resp[i].idPlayer)-1]).html(resp[i].won);
            }
        },
        error: function(xhr, status, error) {
            //var err = eval("(" + xhr.responseText + ")");
            alert(xhr.responseText + error + status);
        }

    });
}

function getDate(){
	var d = new Date();
	var y = d.getFullYear();
	var m = d.getMonth()+1;
	var D = d.getDate();
	//alert(y+'-'+m+'-'+D);
	
	return y+'-'+m+'-'+D;
}

function saveScore(idplayer, score, winner){
	//($("#cardgame").attr('value'));
	//alert($("#team").attr('value'));
	var URL = "http://doihaveit.net/service/CardGame.php?method=saveScore&idCardGame=" +
		$("#cardgame").attr('value') +
		"&idplayer=" +
		idplayer +
		"&score=" + 
		score +
		"&winner=" +
		winner +
		"&date=" +
		getDate() +
		"&team=" +
		$("#team").attr('value') +
		"&game=" +
		$("#game").attr('value');
	
	//alert(URL);
	
	$.ajax({
    	type: "POST",
    	//url: "http://doihaveit.net/service/CardGame.php?method=saveScore&idCardGame=1&idplayer=1&score=55&winner=true&date=2014-08-09&team=1&game=1",
		url: URL,
		dataType: 'text',
		success: function(rsp) {},
        error: function(xhr, status, error) {
            //var err = eval("(" + xhr.responseText + ")");
            alert("ERROR: " + xhr.responseText + error + status);
        }
	});
					
	return;
}

	function saveGameScores(){
		var i = 0;
		var playergametotal = ["#scoretotalone", "#scoretotaltwo", "#scoretotalthree", "#scoretotalfour"];
		//var idGame = $("#selectcardgame option:selected" ).attr('value');
		//var idPlayerGroup = $("#selectplayergroup option:selected" ).attr('value');
		//alert(idGame);
		//alert(idPlayerGroup);
		var names = {};
		var players = $(".playername").toArray();
		$( ".playername" ).each(function() {
		    names[ $(this).attr('id') ] = $(players[i]).attr('value');
			//alert( $(this).attr('id') );
			//alert( $(players[i]).attr('value') ); //PLAYER ID
			//alert( $(players[i]).html() );//PLAYER NAME
			//alert(playergametotal[i]);
			//alert( $(playergametotal[i]).val());
			var winner = false;
			//alert("whoiswinner = " + whoiswinner());
			//alert( playergametotal[i] + " = " + $(playergametotal[i]).val());
			if($(playergametotal[i]).val() == whoiswinner()){
				winner = true;
			}
			saveScore($(players[i]).attr('value'), $(playergametotal[i]).val(), winner);
			i++;
		});
	}
	
	function whoiswinner(){
		var _array = [$("#scoretotalone").val(),$("#scoretotaltwo").val(),$("#scoretotalthree").val(),$("#scoretotalfour").val()];
		//var _array = [10,20,30,40];
		//Math.max.apply(Math,_array);
		return Math.min.apply(Math,_array); 
	}

	function populatePlayerNames(groupName){
	    $.ajax({
	        type: "GET",
	        url: "http://doihaveit.net/service/CardGame.php?method=populateScoreCardNames&groupname="+groupName,
	        dataType: "json",
	        success: function(resp){
	            var html = '';
	            var len = resp.length;
	            for (var i = 0; i< len; i++) {
					var arr = (resp[i].playerName).split(' ');
	                html += '<td class="playername" value="' + resp[i].idPlayer + '">' + arr[0] + '</td>';
	            }
	            //alert(html);
	            $('#scorecardnamerow').append(html);

	        },
	        error: function(xhr, status, error) {
	            //var err = eval("(" + xhr.responseText + ")");
	            alert(xhr.responseText + error + status);
	        }

	    });
	}
	


    function getGroupNames() {
        $.ajax({
            type: "GET",
            url: "http://doihaveit.net/service/CardGame.php?method=getgroupnames",
            dataType: "json",
            success: function(resp){
                // we have the response
                //alert("Success data returned is:\n '" + resp + "'");
                //alert(resp.length);
                var html = '';
                var len = resp.length;
                for (var i = 0; i< len; i++) {
                    html += '<option value="' + resp[i].idGroupName + '">' + resp[i].groupName + '</option>';
                }
                //alert(html);
                $('#selectplayergroup').append(html);

            },
            error: function(xhr, status, error) {
                alert(xhr.responseText + error + status);
            }

        });
    }

    function calculateSum() {
        var sum = 0;
        var players = {".scoreplayerone": "#scoretotalone", ".scoreplayertwo": "#scoretotaltwo", ".scoreplayerthree": "#scoretotalthree", ".scoreplayerfour": "#scoretotalfour"};
        for (var key in players) {

            var score = key;
            var total = players[key];
            var sum = 0;

            $(score).each(function () {
                if (!isNaN(this.value) && this.value.length != 0) {
                    sum += parseInt(this.value);
                }
            });

            $(total).val(sum);
        }
    }

	function calculateSumOfTwelve() {
    	var sum = 0;
    	var finalScoreCount = 0;
    	var playersLastScore = ["#12-1", "#12-2", "#12-3", "#12-4"];
    	//alert("Got to for loop!");
    	for(var lastScore in playersLastScore){
        	//alert("lastScore "+playersLastScore[lastScore]);
        	$(playersLastScore[lastScore]).each(function () {
            	if (!isNaN(this.value) && this.value.length != 0) {
                	sum += parseInt(this.value);
                	finalScoreCount += 1;
            	}
        	});
    }

	//alert("finalScoreCount" + finalScoreCount);
    if(finalScoreCount == 4){
		$("#tally").attr("disabled",true);
        $("#savescores").attr("disabled",false);
    }
	
}