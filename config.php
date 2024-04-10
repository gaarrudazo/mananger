<?php


 

    $dbHost = 'localhost';
$dbUsername = 'root';
$dbName = 'User';



    $conexao = new mysqli($dbHost,$dbUsername,'',$dbName);



if($conexao->connect_errno){ 

echo "Erro";

} else { 

//echo "Conexão efetuada com sucesso";

}



?>