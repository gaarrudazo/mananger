<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tela Login</title>

<style>
body{ 
font-family: Arial, Helvetica, sans-serif;
background-image: linear-gradient(45deg, rgb(20, 20, 183), rgb(81, 8, 92));


}

div{ 
background-color: rgba(183, 214, 237, 0.4);
position: absolute;
top: 40%;
left: 50%;
transform: translate(-50%,-50%);
padding: 80px;
border-radius: 15px;
color: white;
}


input{ 
padding: 10px;
border: none;
outline: none;
font-size: 15px;

}

.inputSubmit{ 

background-color: dodgerblue;
border: none;
padding: 15px;
width: 100%;
border-radius: 10px;
color: white;
font-size: 15px;
cursor: pointer;
}

.inputSubmit:hover{ 

background-color: deepskyblue;

}

.box{ 


position: absolute;
top: 75%;
left: 50%;
transform: translate(-50%,-50%);
background-color: rgba(0,0,0,0.4);
padding: 20px;
border-radius: 20px;

}


</style>

</head>
<body>

   <div>

<H1> Login</H1>
<form action="sistema.php" method="POST">


<input type="text" name="email" placeholder="Email">
<br> <br>
<input type="password" name="senha" placeholder="Senha">
<br> <br>
<input class=inputSubmit type="submit" name="submit" value="Acessar">

</form>

   </div> 
   

   <div class= "box">
    <a href= "formulario.php">Cadastre-se</a>

</body>
</html>