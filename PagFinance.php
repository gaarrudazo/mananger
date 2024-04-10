
<?php

session_start();
//print_r($_SESSION);
if((!isset($_SESSION["email"]) ==true ) and (!isset($_SESSION["senha"]) == true))

{ 

    unset($_SESSION["email"]);
    unset($_SESSION["senha"]);
header("location: PagFinance.php");

}

$logado = $_SESSION["email"]


?>


<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Dashboard - Controle Financeiro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
        }
        header {
            background-color: #143da4;
            color: #fff;
            padding: 10px 0;
            text-align: center;
        }
        nav {
            background-color: #92a9e7;
            color: #fff;
            padding: 10px 0;
            text-align: center;
        }
        nav a {
            color: #fff;
            text-decoration: none;
            padding: 0 10px;
        }
        nav a:hover {
            background-color: #444;
        }
        section {
            padding: 20px;
            margin: 20px;
            background-color: #fff;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
        }
        .finance-section {
            width: 48%;
        }
        .finance-section h2 {
            margin-bottom: 10px;
        }
        .finance-form {
            margin-bottom: 20px;
        }
        .finance-form input[type="text"],
        .finance-form input[type="number"] {
            width: calc(100% - 10px);
            margin-bottom: 10px;
            padding: 5px;
        }
        .finance-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        .finance-item {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
            background-color: #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .finance-item.completed span:first-child,
        .finance-item.paid span:first-child {
            text-decoration: line-through;
            color: green;
        }
        .finance-item.not-paid span:first-child {
            text-decoration: line-through;
            color: red;
        }
        footer {
            background-color: #143da4;
            color: #fff;
            text-align: center;
            padding: 10px 0;
            position: fixed;
            bottom: 0;
            width: 100%;
        }
    </style>
</head>
<body>

<header>
    <h1>Meu Dashboard - Controle Financeiro</h1>
</header>

<nav>
    <a href="#">Janeiro</a>
    <a href="#">Fevereiro</a>
    <a href="#">Março</a>
    <a href="#">Abril</a>
    <a href="#">Maio</a>
    <a href="#">Junho</a>
    <a href="#">Julho</a>
    <a href="#">Agosto</a>
    <a href="#">Setembro</a>
    <a href="#">Outubro</a>
    <a href="#">Novembro</a>
    <a href="#">Dezembro</a>
</nav>

<section>
    <div class="finance-section">
        <h2>Despesas Mensais</h2>
        <form id="monthly-budget-form" class="finance-form">
            <input type="text" id="monthly-budget-input" placeholder="Nome do produto">
            <input type="number" id="monthly-budget-value" placeholder="Valor">
            <button type="submit">Adicionar</button>
        </form>
        <ul id="monthly-budget-list" class="finance-list">
            <!-- Itens do orçamento mensal serão adicionados dinamicamente aqui -->
        </ul>
        <p id="monthly-total">Total: R$ 0.00</p>
    </div>
    <div class="finance-section">
        <h2>Planejamento Financeiro</h2>
        <form id="financial-planning-form" class="finance-form">
            <input type="text" id="financial-planning-input" placeholder="Nome do produto">
            <input type="number" id="financial-planning-value" placeholder="Valor">
            <button type="submit">Adicionar</button>
        </form>
        <form id="cash-form" class="finance-form">
            <label for="cash-input">Caixa:</label>
            <input type="number" id="cash-input" placeholder="Valor em conta">
        </form>
        <ul id="financial-planning-list" class="finance-list">
            <!-- Itens do planejamento financeiro serão adicionados dinamicamente aqui -->
        </ul>
        <p id="financial-total">Total: R$ 0.00</p>
    </div>

    <div class="d-flex">
        <a href="sair.php" class="btn btn-danger me-5">Sair</a>
</section>

<footer>
    <p>&copy; 2024 Meu Site</p>
</footer>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const monthlyBudgetForm = document.getElementById('monthly-budget-form');
        const monthlyBudgetInput = document.getElementById('monthly-budget-input');
        const monthlyBudgetValue = document.getElementById('monthly-budget-value');
        const monthlyBudgetList = document.getElementById('monthly-budget-list');

        const financialPlanningForm = document.getElementById('financial-planning-form');
        const financialPlanningInput = document.getElementById('financial-planning-input');
        const financialPlanningValue = document.getElementById('financial-planning-value');
        const financialPlanningList = document.getElementById('financial-planning-list');

        const cashForm = document.getElementById('cash-form');
        const cashInput = document.getElementById('cash-input');

        monthlyBudgetForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const productName = monthlyBudgetInput.value.trim();
            const productValue = parseFloat(monthlyBudgetValue.value);

            if (productName !== '' && !isNaN(productValue)) {
                addFinanceItem(monthlyBudgetList, productName, productValue);
                monthlyBudgetInput.value = '';
                monthlyBudgetValue.value = '';
                updateMonthlyTotal();
            }
        });

        financialPlanningForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const productName = financialPlanningInput.value.trim();
            const productValue = parseFloat(financialPlanningValue.value);

            if (productName !== '' && !isNaN(productValue)) {
                addFinanceItem(financialPlanningList, productName, productValue);
                financialPlanningInput.value = '';
                financialPlanningValue.value = '';
                updateFinancialTotal();
            }
        });

        cashForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const cashAmount = parseFloat(cashInput.value);
            if (!isNaN(cashAmount)) {
                const cashItem = document.getElementById('cash-item');
                if (cashItem) {
                    cashItem.querySelector('span:nth-child(2)').textContent = `R$ ${cashAmount.toFixed(2)}`;
                } else {
                    const financeList = document.getElementById('financial-planning-list');
                    const cashListItem = document.createElement('li');
                    cashListItem.className = 'finance-item';
                    cashListItem.id = 'cash-item';
                    cashListItem.innerHTML = `
                        <span>Caixa</span>
                        <span>R$ ${cashAmount.toFixed(2)}</span>
                    `;
                    financeList.appendChild(cashListItem);
                }
                cashInput.value = '';
            }
        });

        function addFinanceItem(list, name, value) {
            const financeItem = document.createElement('li');
            financeItem.className = 'finance-item';
            financeItem.innerHTML = `
                <span>${name}</span>
                <span>R$ ${value.toFixed(2)}</span>
                <button class="delete-btn">Excluir</button>
            `;
            list.appendChild(financeItem);

            const deleteBtn = financeItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function () {
                financeItem.remove();
                updateMonthlyTotal();
                updateFinancialTotal();
            });
            updateMonthlyTotal();
            updateFinancialTotal();
        }

        function updateMonthlyTotal() {
            const monthlyFinanceItems = document.querySelectorAll('.finance-item:not(#cash-item) span:nth-child(2)');
            let monthlyTotal = 0;
            monthlyFinanceItems.forEach(item => {
                const value = parseFloat(item.textContent.replace('R$ ', ''));
                monthlyTotal += value;
            });
            document.getElementById('monthly-total').textContent = `Total: R$ ${monthlyTotal.toFixed(2)}`;
        }

        function updateFinancialTotal() {
            const financialFinanceItems = document.querySelectorAll('.finance-item:not(#cash-item) span:nth-child(2)');
            let financialTotal = 0;
            financialFinanceItems.forEach(item => {
                const value = parseFloat(item.textContent.replace('R$ ', ''));
                financialTotal += value;
            });
            document.getElementById('financial-total').textContent = `Total: R$ ${financialTotal.toFixed(2)}`;
        }
    });
</script>

</body>
</html>
