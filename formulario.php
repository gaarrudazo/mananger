<?php

include_once('config.php');

if(isset($_POST['submit'])) {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];
    $telefone = $_POST['telefone'];
    $genero = $_POST['genero'];
    $data_nascimento = $_POST['data_nascimento'];
    $cidade = $_POST['cidade'];
    $estado = $_POST['estado'];
    $endereco = $_POST['endereco'];

    $result = mysqli_query($conexao, "INSERT INTO User(nome, email, senha, telefone, genero, data_nascimento, cidade, estado, endereco) VALUES ('$nome', '$email', '$senha', '$telefone', '$genero', '$data_nascimento', '$cidade', '$estado', '$endereco')");
    header("location: testeLogin.php");


    if (!$result) {
        die("Erro na inserção: " . mysqli_error($conexao));
    }
}

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulário</title>

    <style>

body{ 

font-family: Arial, Helvetica, sans-serif;
background-image: linear-gradient(to right, rgb(53, 106, 204), rgb(85, 4, 106));

}

.box{ 
    color: white;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%,-50%);
background-color: rgba(4, 7, 102, 0.6);
padding: 15px;
border-radius: 15px;
width: 20%;

}

fieldset{ 

    border: 3px solid rgb(255, 255, 255);
}

legend{ 

border: 1px solid dodgerblue;
padding: 10px;
text-align: center;
background-color: dodgerblue;
border-radius: 8px;
color: white;

}

.inputBox{ 

position: relative;

}
 
.inputUser{ 

background: none;
border: none;
border-bottom: 1px solid white;
outline: none;
color: white;
font-size: 15px;
width: 100%;
letter-spacing: 2px;

}

.labelInput{ 

position: absolute;
top: 0px;
left: 0px;
pointer-events: none;
transition: .5s;

}

.inputUser:focus ~ .labelInput , .inputUser:valid ~ .labelInput{ 

    top: -20px;
    font-size: 12px;
    color: blue;

}

#submit{ 

background-image: linear-gradient(to right,rgb(0, 92, 197), rgb(255, 255, 255));
width: 100%;
border: none;
padding: 15px;
color: white;
font-size: 12px;
cursor: pointer;
border-radius: 10px;

}

#submit:hover{ 

background-image: linear-gradient(to right, rgb(0,80,172) rgb(34, 0, 97));

}


    </style>

</head>
<body>
    
<div class="box">
<form action="formulario.php" method="POST">

<fieldset>
<legend><b>Formulário de Clientes</b></legend>
<br>

<div class="inputBox">
<input type="text" name="nome" id="nome" class="inputUser" required>
<label for="nome" class="labelInput">Nome Completo</label>
</div>

<br><br>
<div class="inputBox">
    <input type="text" name="email" id="email" class="inputUser" required>
    <label for="nome" class="labelInput">Email</label>
    </div>

    <br><br>
                <div class="inputBox">
                    <input type="password" name="senha" id="senha" class="inputUser" required>
                    <label for="senha" class="labelInput">Senha</label>
                    </div>

    <br><br>
    <div class="inputBox">
        <input type="tel" name="telefone" id="telefone" class="inputUser" required>
        <label for="nome" class="labelInput">Telefone</label>
        </div>

        <br>
        <p>Sexo:</p>
        <input type="radio" id="feminino" name="genero" value="feminino" required>
        <label for="feminino">Feminino</label>
       
        <input type="radio" id="masculino" name="genero" value="masculino" required>
        <label for="masculino">Masculino</label>
        <br>
        <input type="radio" id="outro" name="genero" value="outro" required>
        <label for="outro">Outro</label>
        <br>

        <br><br>
        <div class="inputBox">
            <label for="data_nascimento"><b>Data de Nascimento</b></label>
            <input type="date" name="data_nascimento" id="data_nascimento" class="inputUser" required>
            </div>


            <br><br>
            <div class="inputBox">
                <input type="text" name="cidade" id="cidade" class="inputUser" required>
                <label for="nome" class="labelInput">Cidade</label>
                </div>

            

                <br><br>
                <div class="inputBox">
                    <input type="text" name="estado" id="estado" class="inputUser" required>
                    <label for="estado" class="labelInput">Estado</label>
                    </div>
            

                    <br><br>
                    <div class="inputBox">
                        <input type="text" name="endereco" id="endereco" class="inputUser" required>
                        <label for="endereco" class="labelInput">Endereço</label>
                        </div>

                        <br><br>

                        <input type="submit" name="submit" id="submit">

</fieldset>

</form>



</div>


</body>
</html>

