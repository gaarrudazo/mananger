<?php
// Inicia a sessão para utilizar sessões
session_start();

if (isset($_POST["submit"]) && !empty($_POST["email"]) && !empty($_POST["senha"])) {

    include_once("config.php");
    $email = $_POST["email"];
    $senha = $_POST["senha"];

    $sql = "SELECT * FROM User.User WHERE email = '$email' AND senha = '$senha'";
    $result = $conexao->query($sql);

    if ($result && mysqli_num_rows($result) > 0) {
        // Inicia a sessão e armazena o e-mail do usuário e senha
        $_SESSION['email'] = $email;
        $_SESSION['senha'] = $senha;


        
        // Redireciona para testeLogin.php
        header("location: PagFinance.php");
        exit; // Encerra o script para garantir que o redirecionamento ocorra
    } else {
        // Caso as credenciais não correspondam a nenhum registro no banco de dados
        $_SESSION['email'] = $email;
        $_SESSION['senha'] = $senha;
        header("location: testeLogin.php");

    }
} else {
    // Caso o formulário não tenha sido submetido ou os campos estejam vazios
    echo "Por favor, preencha o formulário de login";
}
?>