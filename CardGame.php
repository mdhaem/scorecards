<?php

  // example request: http://doihaveit.net/service/CardGame.php?method=getDataType
  
  require_once "RestServer.php";

  $rest = new RestServer(CardGame);
  $rest->handle();

  class CardGame
  {
	  public static function getHistory(){
        $con = mysql_connect('mikedhaem.fatcowmysql.com', 'iscorecards', 'doscar'); 
      	if (!$con) { 
              return die('Could not connect: ' . mysql_error()); 
      	}
		$sql = "SELECT idPlayer, COUNT(winner) AS won FROM iscorecards.Score WHERE winner = true GROUP BY idPlayer";
		$result_array = array();
		$result = mysql_query($sql,$con);
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    		$row_array['idPlayer'] = $row['idPlayer'];
			//alert($row['idPlayer']);
    		$row_array['won'] = $row['won'];

    		array_push($result_array,$row_array);
		}

		return json_encode($result_array);
	  }
	  
	  public static function saveScore($idCardGame, $idPlayer, $score, $winner, $date, $team, $game){
        $con = mysql_connect('mikedhaem.fatcowmysql.com', 'iscorecards', 'doscar'); 
    	if (!$con) { 
            return die('Could not connect: ' . mysql_error()); 
    	}
		//$sql = 'insert into doihaveit.user( id, email, password) values((SELECT UUID()), "' . $email . '", "' . $password . '");';
		//http://doihaveit.net/service/CardGame.php?method=saveScore&idCardGame=1&idPlayer=1&score=25&winner=true&date='2014-08'-09&team=1&game=1
		$date = "'".$date."'";
		$sql = "INSERT INTO iscorecards.Score (idCardGame, idPlayer, score, winner, date, team, game) VALUES ($idCardGame, $idPlayer, $score, $winner, $date, $team, $game)";
		if (!mysql_query($sql))
		  		{
		  			return die('Insert Error: ' . mysql_error());
		  		}
		  		return 1;
	  }
	  
	  public static function populateScoreCardNames($groupname){
       	$con = mysql_connect('mikedhaem.fatcowmysql.com', 'iscorecards', 'doscar'); 
  		if (!$con) { 
      		return die('Could not connect: ' . mysql_error()); 
  		}
	  	$sql = "SELECT Player.idPlayer , Player.playerName FROM iscorecards.Player INNER JOIN iscorecards.PlayerGroup ON PlayerGroup.idPlayer = Player.idPlayer INNER JOIN iscorecards.GroupName ON PlayerGroup.playerGroup = GroupName.idGroupName WHERE GroupName.idGroupName = $groupname";
		$result_array = array();
		$result = mysql_query($sql,$con);
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    			$row_array['idPlayer'] = $row['idPlayer'];
				//alert($row['idPlayer']);
    			$row_array['playerName'] = $row['playerName'];

    			array_push($result_array,$row_array);
		}

		return json_encode($result_array);  		
     }
	  
     public static function getCardGames()
     {
     	$con = mysql_connect('mikedhaem.fatcowmysql.com', 'iscorecards', 'doscar'); 
		if (!$con) { 
    		return die('Could not connect: ' . mysql_error()); 
		}
		$sql = 'SELECT * FROM iscorecards.CardGame';
		$result_array = array();
		$result = mysql_query($sql,$con);
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    			$row_array['idCardGame'] = $row['idCardGame'];
    			$row_array['cardGameName'] = $row['cardGameName'];

    			array_push($result_array,$row_array);
		}

		return json_encode($result_array);  		
     }

     public static function getGroupNames()
     {
     	$con = mysql_connect('mikedhaem.fatcowmysql.com', 'iscorecards', 'doscar'); 
		if (!$con) { 
    		return die('Could not connect: ' . mysql_error()); 
		}
		$sql = 'SELECT * FROM iscorecards.GroupName';
		$result_array = array();
		$result = mysql_query($sql,$con);
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    			$row_array['idGroupName'] = $row['idGroupName'];
    			$row_array['groupName'] = $row['groupName'];

    			array_push($result_array,$row_array);
		}

		return json_encode($result_array);  		
     }


     public static function getPlayers()
     {
     	$con = mysql_connect('mikedhaem.fatcowmysql.com', 'iscorecards', 'doscar'); 
		if (!$con) { 
    		return die('Could not connect: ' . mysql_error()); 
		}
		$sql = 'SELECT * FROM iscorecards.Player';
		$result_array = array();
		$result = mysql_query($sql,$con);
		while ($row = mysql_fetch_row($result)) {
    		$result_array[] = $row;
		}
  		return json_encode($result_array);   		
     }
  }
?>
