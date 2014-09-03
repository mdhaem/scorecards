        $(document).ready(function () {
       
            
			
			$("#savescores").attr("disabled", false);
			$("#selectplayergroup").css('display', 'inline');
            
			$.ajax({
                type: "GET",
                url: "http://doihaveit.net/service/CardGame.php?method=getCardGames",
                dataType: "json",
                success: function (resp) {
                    var html = '';
                    var len = resp.length;
                    for (var i = 0; i < len; i++) {
                        html += '<option value="' + resp[i].idCardGame + '">' + resp[i].cardGameName + '</option>';
                    }
                    //alert(html);
                    $('#selectcardgame').append(html);

                },
                error: function (xhr, status, error) {
                    //var err = eval("(" + xhr.responseText + ")");
                    alert(xhr.responseText + error + status);
                }

            });

            ///SELECTED GAME
            $("#selectcardgame").change(function () {

                ///IF CARDGAME HAS NOT CHANGED THEN INCREMENT GAME COUNT
                if ($("#cardgame").attr('value') === $("#selectcardgame option:selected").attr('value')) {
                    var counter = $("#game").val($("#cardgame").attr('value'));
                    counter++;
                    $("#game").val(counter);
                }

                ///SET CARDGAME HIDDEN VALUE
                $("#cardgame").val($("#selectcardgame option:selected").attr('value'));

                ///DISPLAY PLAYER GROUP SELECT AND POPULATE WITH GROUP NAMES
                //$("#selectplayergroup").css('display', 'inline');
                getGroupNames();
            });

            ///SELECTED PLAYER GROUP
            $("#selectplayergroup").change(function () {

                ///DISPLAY AND POPULATE PLAYER GROUP SELECT
                $("#cardgameplayergroupdiv").css('display', 'inline');
                $("#shanghaiscorecard").css('display', 'inline');
                populatePlayerNames($("#selectplayergroup option:selected").attr('value'));

                ///POPULATE HISTORY
                getHistory();

                ///POPULATE HIDDEN INPUT
                $("#team").val($("#selectplayergroup option:selected").attr('value'));

                //alert($("#team" ).attr('value'));

                ///HIDE GAME AND TEAM SELECTS
                $("#cardgameselectdiv").css('display', 'none');
                $("#cardgameplayergroupdiv").css('display', 'none');
                $("#selectcardgame").css('display', 'none');
                $("#selectplayergroup").css('display', 'none');
            });

            ///CALCULATE GAME TOTALS WHEN TALLY BUTTON IS CLICKED
            /*$("#tally").click(function () {
                calculateSum();
                calculateSumOfTwelve();
            });

            ///AUTOMATIC SCORE TALLY
            $(".scoreplayerone,.scoreplayertwo,.scoreplayerthree,.scoreplayerfour").change(function () {

                var row = $(this).closest('tr');
                var scoreplayerone = parseFloat(row.find('.scoreplayerone').val());
                var scoreplayertwo = parseFloat(row.find('.scoreplayertwo').val());
                var scoreplayerthree = parseFloat(row.find('.scoreplayerthree').val());
                var scoreplayerfour = parseFloat(row.find('.scoreplayerfour').val());

                if ($.isNumeric(scoreplayerone) && $.isNumeric(scoreplayertwo) && $.isNumeric(scoreplayerthree) && $.isNumeric(scoreplayerfour)) {
                    calculateSum();
                    calculateSumOfTwelve();
                }
            });*/




            ///SAVE GAME SCORES ADMIN
            $("#savescores").click(function () {
                var i = 0;
				var count = 0;
				var playergametotal = ["#scoretotalone", "#scoretotaltwo", "#scoretotalthree", "#scoretotalfour"];
	            $(".playername").each(function () {
	                if ($(playergametotal[i]).val() > 0) 
					{
	                    count++;
	                }
	                i++;
	            });
				
				var valid = false;
				if( $("#popupDatepicker").val().length > 0 ){
					valid = true;
				}
				if(count == 4 && valid){
                	saveGameScores();
					i = 0;
		            $(".playername").each(function () {
		                $(playergametotal[i]).val(0);
		                i++;
		            });
					getHistory();
				}else{
					alert("Player score is missing or date is invalid. SCORES NOT SAVED.")
				}
            });
        });
        
		
		
        ///GET PLAYERS HISTORY
        function getHistory() {
            var playersHistory = ["#historyone", "#historytwo", "#historythree", "#historyfour"];
            $.ajax({
                type: "GET",
                url: "http://doihaveit.net/service/CardGame.php?method=getHistory",
                dataType: "json",
                success: function (resp) {
                    var html = '';
                    var len = resp.length;
                    for (var i = 0; i < len; i++) {
                        //alert("idPlayer"+resp[i].idPlayer);
                        //alert("playersHistory" + $(playersHistory[resp[i].idPlayer]));
                        $(playersHistory[(resp[i].idPlayer) - 1]).html(resp[i].won);
                    }
                },
                error: function (xhr, status, error) {
                    //var err = eval("(" + xhr.responseText + ")");
                    alert(xhr.responseText + error + status);
                }

            });
        }

        function getDate(gameDate) {
            var d = new Date(gameDate);
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            var D = d.getDate();
            //alert(y+'-'+m+'-'+D);

            return y + '-' + m + '-' + D;
        }

        function saveScore(idplayer, score, winner) {
			//alert($("#popupDatepicker").val());
            var URL = "http://doihaveit.net/service/CardGame.php?method=saveScore&idCardGame=" +
                $("#cardgame").attr('value') +
                "&idplayer=" +
                idplayer +
                "&score=" +
                score +
                "&winner=" +
                winner +
                "&date=" +
                getDate($("#popupDatepicker").val()) +
                "&team=" +
                $("#team").attr('value') +
                "&game=" +
                $("#game").val();

            $.ajax({
                type: "POST",
                //url: "http://doihaveit.net/service/CardGame.php?method=saveScore&idCardGame=1&idplayer=1&score=55&winner=true&date=2014-08-09&team=1&game=1",
                url: URL,
                dataType: 'text',
                success: function (rsp) { },
                error: function (xhr, status, error) {
                    //var err = eval("(" + xhr.responseText + ")");
                    alert("ERROR: " + xhr.responseText + error + status);
                }
            });

            return;
        }

        function saveGameScores() {
            var i = 0;
            var playergametotal = ["#scoretotalone", "#scoretotaltwo", "#scoretotalthree", "#scoretotalfour"];
            //var idGame = $("#selectcardgame option:selected" ).attr('value');
            //var idPlayerGroup = $("#selectplayergroup option:selected" ).attr('value');
            //alert(idGame);
            //alert(idPlayerGroup);
            var names = {};
            var players = $(".playername").toArray();
            $(".playername").each(function () {
                names[$(this).attr('id')] = $(players[i]).attr('value');
                //alert( $(this).attr('id') );
                //alert( $(players[i]).attr('value') ); //PLAYER ID
                //alert( $(players[i]).html() );//PLAYER NAME
                //alert(playergametotal[i]);
                //alert( $(playergametotal[i]).val());
                var winner = false;
                //alert("whoiswinner = " + whoiswinner());
                //alert( playergametotal[i] + " = " + $(playergametotal[i]).val());
                if ($(playergametotal[i]).val() == whoiswinner()) {
                    winner = true;
                }
                saveScore($(players[i]).attr('value'), $(playergametotal[i]).val(), winner);
                i++;
            });
        }

        function whoiswinner() {
            var _array = [$("#scoretotalone").val(), $("#scoretotaltwo").val(), $("#scoretotalthree").val(), $("#scoretotalfour").val()];
            //var _array = [10,20,30,40];
            //Math.max.apply(Math,_array);
            return Math.min.apply(Math, _array);
        }

        function populatePlayerNames(groupName) {
            $.ajax({
                type: "GET",
                url: "http://doihaveit.net/service/CardGame.php?method=populateScoreCardNames&groupname=" + groupName,
                dataType: "json",
                success: function (resp) {
                    var html = '';
                    var len = resp.length;
                    for (var i = 0; i < len; i++) {
                        var arr = (resp[i].playerName).split(' ');
                        html += '<td class="playername" value="' + resp[i].idPlayer + '">' + arr[0] + '</td>';
                    }
                    //alert(html);
                    $('#scorecardnamerow').append(html);

                },
                error: function (xhr, status, error) {
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
                success: function (resp) {
                    // we have the response
                    //alert("Success data returned is:\n '" + resp + "'");
                    //alert(resp.length);
                    var html = '';
                    var len = resp.length;
                    for (var i = 0; i < len; i++) {
                        html += '<option value="' + resp[i].idGroupName + '">' + resp[i].groupName + '</option>';
                    }
                    //alert(html);
                    $('#selectplayergroup').append(html);

                },
                error: function (xhr, status, error) {
                    alert(xhr.responseText + error + status);
                }

            });
        }

        /*function calculateSum() {
            var sum = 0;
            var players = { ".scoreplayerone": "#scoretotalone", ".scoreplayertwo": "#scoretotaltwo", ".scoreplayerthree": "#scoretotalthree", ".scoreplayerfour": "#scoretotalfour" };
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
            for (var lastScore in playersLastScore) {
                //alert("lastScore "+playersLastScore[lastScore]);
                $(playersLastScore[lastScore]).each(function () {
                    if (!isNaN(this.value) && this.value.length != 0) {
                        sum += parseInt(this.value);
                        finalScoreCount += 1;
                    }
                });
            }

            //alert("finalScoreCount" + finalScoreCount);
            if (finalScoreCount == 4) {
                $("#tally").attr("disabled", true);
                $("#savescores").attr("disabled", false);
            }

        }*/