document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-name');
    const taskPriority = document.getElementById('task-priority');
    const addTaskBtn = document.getElementById('add-task-btn');

    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCPpZ8s7gBTVYcmz78hMX0XqXHsHNMx0x8",
        authDomain: "study-rm.firebaseapp.com",
        projectId: "study-rm",
        storageBucket: "study-rm.appspot.com",
        messagingSenderId: "466457514347",
        appId: "1:466457514347:web:82d72759a048e1cea23c2e",
        measurementId: "G-3TRGS18QQJ"
    };

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Função para salvar as tarefas diárias no Firestore
    function saveTasks() {
        const tasks = Array.from(document.querySelectorAll('#tasks li')).map(taskItem => {
            return {
                name: taskItem.querySelector('span').textContent,
                priority: taskItem.classList.contains('high') ? 'high' : (taskItem.classList.contains('medium') ? 'medium' : 'low'),
                completed: taskItem.classList.contains('completed')
            };
        });

        const userId = firebase.auth().currentUser.uid;
        db.collection('users').doc(userId).set({ tasks }, { merge: true })
            .catch(error => console.error("Error saving tasks: ", error));
    }

    // Função para salvar as tarefas semanais no Firestore
    function saveWeeklyTasks() {
        const weeklyTasks = {};
        document.querySelectorAll('.weekly-tasks .day').forEach(day => {
            const dayName = day.dataset.day.toLowerCase();
            weeklyTasks[dayName] = Array.from(day.querySelectorAll('li')).map(taskItem => {
                return {
                    name: taskItem.querySelector('span').textContent,
                    completed: taskItem.classList.contains('completed')
                };
            });
        });

        const userId = firebase.auth().currentUser.uid;
        db.collection('users').doc(userId).set({ weeklyTasks }, { merge: true })
            .catch(error => console.error("Error saving weekly tasks: ", error));
    }

    // Função para carregar as tarefas diárias do Firestore
    function loadTasks() {
        const userId = firebase.auth().currentUser.uid;
        db.collection('users').doc(userId).get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    const savedTasks = data.tasks || [];
                    savedTasks.forEach(task => {
                        addTask(task.name, task.priority, task.completed);
                    });
                }
            })
            .catch(error => console.error("Error loading tasks: ", error));
    }

    // Função para carregar as tarefas semanais do Firestore
    function loadWeeklyTasks() {
        const userId = firebase.auth().currentUser.uid;
        db.collection('users').doc(userId).get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    const savedWeeklyTasks = data.weeklyTasks || {};
                    for (const [day, tasks] of Object.entries(savedWeeklyTasks)) {
                        tasks.forEach(task => {
                            addWeeklyTask(day.charAt(0).toUpperCase() + day.slice(1), task.name, task.completed);
                        });
                    }
                }
            })
            .catch(error => console.error("Error loading weekly tasks: ", error));
    }

    // Função para criar um elemento de tarefa
    function createTaskElement(name, priority, completed = false, isWeekly = false) {
        const taskItem = document.createElement('li');
        if (priority) taskItem.classList.add(priority);
        if (completed) taskItem.classList.add('completed');
        taskItem.draggable = true;

        const taskContent = document.createElement('span');
        taskContent.textContent = name;

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');

        // Adiciona o botão "Complete" apenas se for uma tarefa semanal
        if (isWeekly) {
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Complete';
            completeBtn.classList.add('complete');
            completeBtn.addEventListener('click', () => {
                taskItem.classList.toggle('completed');
                saveTasks();
                saveWeeklyTasks();
            });
            taskActions.appendChild(completeBtn);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete');
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
            saveWeeklyTasks();
        });

        taskActions.appendChild(deleteBtn);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskActions);

        return taskItem;
    }

    // Função para adicionar uma tarefa diária
    function addTask(name, priority, completed = false) {
        const taskItem = createTaskElement(name, priority, completed, false);
        document.getElementById('tasks').appendChild(taskItem);

        // Eventos de arrastar e soltar
        taskItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', name);
            e.dataTransfer.effectAllowed = 'move';
            taskItem.classList.add('dragging');
        });

        taskItem.addEventListener('dragend', () => {
            taskItem.classList.remove('dragging');
        });
    }

    // Função para adicionar uma tarefa semanal
    function addWeeklyTask(day, taskName, completed = false) {
        const tasksList = document.getElementById(`tasks-${day.toLowerCase()}`);
        const taskItem = createTaskElement(taskName, '', completed, true);
        tasksList.appendChild(taskItem);

        // Eventos de arrastar e soltar
        taskItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', taskName);
            e.dataTransfer.effectAllowed = 'move';
            taskItem.classList.add('dragging');
        });

        taskItem.addEventListener('dragend', () => {
            taskItem.classList.remove('dragging');
        });
    }

    // Função para atualizar a posição das tarefas
    function updateTaskPositions() {
        saveTasks();
        saveWeeklyTasks();
    }

    // Evento de clique para adicionar uma nova tarefa diária
    addTaskBtn.addEventListener('click', () => {
        const taskName = taskInput.value.trim();
        const priority = taskPriority.value;

        if (taskName) {
            addTask(taskName, priority);
            taskInput.value = '';
            saveTasks();
        }
    });

    // Evento de tecla para adicionar uma nova tarefa diária ao pressionar Enter
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const taskName = taskInput.value.trim();
            const priority = taskPriority.value;

            if (taskName) {
                addTask(taskName, priority);
                taskInput.value = '';
                saveTasks();
            }
        }
    });

    // Eventos de tecla para adicionar uma nova tarefa semanal ao pressionar Enter
    document.querySelectorAll('.weekly-tasks .day input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const taskName = input.value.trim();
                const day = input.parentElement.dataset.day;

                if (taskName) {
                    addWeeklyTask(day, taskName);
                    input.value = '';
                    saveWeeklyTasks();
                }
            }
        });
    });

    // Eventos de clique para adicionar uma nova tarefa semanal
    document.querySelectorAll('.weekly-tasks .day button').forEach(button => {
        button.addEventListener('click', event => {
            const dayContainer = event.target.closest('.day');
            const input = dayContainer.querySelector('input');
            const taskName = input.value.trim();
            if (taskName) {
                addWeeklyTask(dayContainer.dataset.day, taskName);
                input.value = '';
                saveWeeklyTasks();
            }
        });
    });

    // Eventos de arrastar e soltar para a área de tarefas semanais
    document.querySelectorAll('.weekly-tasks .day').forEach(day => {
        day.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.dragging');
            if (draggingItem) {
                day.classList.add('drag-over');
            }
        });

        day.addEventListener('dragleave', () => {
            day.classList.remove('drag-over');
        });

        day.addEventListener('drop', (e) => {
            e.preventDefault();
            const taskName = e.dataTransfer.getData('text/plain');
            const draggingItem = document.querySelector('.dragging');
            const tasksList = day.querySelector('ul');
            const taskItem = createTaskElement(taskName, '', false, true);
            tasksList.appendChild(taskItem);
            draggingItem.remove();
            day.classList.remove('drag-over');
            updateTaskPositions();
        });
    });

    // Carregar tarefas quando o DOM estiver pronto
    loadTasks();
    loadWeeklyTasks();
});


    // Atualiza a lista de editais para tornar os temas arrastáveis
    const editais = {
        "Edital TJ-SP 2024": [
            "Análise, compreensão e interpretação de diversos tipos de textos verbais, não verbais, literários e não literários.",
            "Informações literais e inferências possíveis.",
            "Ponto de vista do autor.",
            "Estruturação do texto: relações entre ideias; recursos de coesão.",
            "Significação contextual de palavras e expressões",
            "Análise, compreensão e interpretação de diversos tipos de textos verbais, não verbais, literários e não literários.",
            "Informações literais e inferências possíveis.",
            "Ponto de vista do autor.",
            "Estruturação do texto: relações entre ideias; recursos de coesão.",
            "Significação contextual de palavras e expressões",
            "Sinônimos e antônimos.",
            "Sentido próprio e figurado das palavras.",
            "Classes de palavras: emprego e sentido que imprimem às relações",
            "Concordância verbal e nominal",
            "Regência verbal e nominal",
            "Colocação pronominal",
            "Crase",
            "Pontuação",
            "Código Penal - 293 a 305",
            "Código Penal - 305",
            "Código Penal - 307",
            "Código Penal - 308",
            "Código Penal - 311-A",
            "Código Penal - 312 a 317",
            "Código Penal - 319 a 333",
            "Código Penal - 336 a 337",
            "Código de Processo Penal - Artigos 251 a 258 – Do Juiz e do Ministério Público ",
            "Código de Processo Penal - Artigos 261 a 267 – Do acusado e seu defensor",
            "Código Processual Penal - Artigos 251 a 258 – Do Juiz e do Ministério Público",
"Código Processual Penal - Artigos 261 a 267 – Do acusado e seu defensor",
"Código Processual Penal - Artigo 274 – Dos funcionários da Justiça",
"Código Processual Penal - Artigos 351 a 372 – Das citações e das intimações",
"Código Processual Penal - Artigos 394 a 497 – Do Processo comum",
"Código Processual Penal - 394 a 405 – Da instrução criminal",
"Código Processual Penal - 406 a 497 – Do procedimento relativo aos processos de competência do Tribunal do Júri",
"Código Processual Penal - Artigos 531 a 538 – Do processo sumário",
"Código Processual Penal - Artigos 541 a 548 – Do processo de restauração de autos extraviados ou destruídos",
"Código Processual Penal - Artigos 574 a 667 – Dos recursos em geral",
"Código Processual Penal - 574 a 580 – disposições gerais",
"Código Processual Penal - 581 a 592 – Recurso em Sentido Estrito (RESE)",
"Código Processual Penal - 593 a 603 – Apelação",
"Código Processual Penal - 604 a 608 – revogados",
"Código Processual Penal - 609 a 618 – Do processo e do julgamento dos recursos em sentido estrito e das apelações, nos tribunais de apelação",
"Código Processual Penal - 619 a 620 – Embargos de Declaração",
"Código Processual Penal - 621 a 631 – Revisão",
"Código Processual Penal - 632 a 636 – revogados",
"Código Processual Penal - 637 a 638 – Recurso Extraordinário",
"Código Processual Penal - 639 a 646 – Carta testemunhável",
"Código Processual Penal - 647 a 667 – Habeas Corpus e seu processo",
"Lei n.º 9.099 de 26.09.1995 – Juizados Especiais Criminais",
"Código Processual Penal - Artigos 60 a 83",
"Código Processual Penal - 60 a 62 – Disposições gerais",
"Código Processual Penal - 63 a 68 – Da competência e dos atos processuais",
"Código Processual Penal - 69 a 76 – Fase preliminar",
"Código Processual Penal - 77 a 83 – Procedimento sumaríssimo",
"Código Processual Penal - Artigos 88 e 89 – disposições finais",
"Código de Processo Civil - Artigos 144 a 155",
"Código de Processo Civil - 144 a 148 – Dos Impedimentos e da Suspeição",
"Código de Processo Civil - 149 – Dos auxiliares de justiça",
"Código de Processo Civil - 150 a 155 – Do Escrivão, do Chefe de Secretaria e do Oficial de Justiça",
"Código de Processo Civil - Artigos 188 a 275",
"Código de Processo Civil - 188 a 192 – Dos atos em geral",
"Código de Processo Civil - 193 a 199 – Da prática eletrônica de Atos Processuais",
"Código de Processo Civil - 200 a 202 – Dos atos das partes",
"Código de Processo Civil - 203 a 205 – Dos pronunciamentos do Juiz",
"Código de Processo Civil - 206 a 211 – Dos atos do Escrivão ou do Chefe de Secretaria",
"Código de Processo Civil - 212 a 216 – Do tempo dos atos processuais",
"Código de Processo Civil - 217 – Do lugar dos atos processuais",
"Código de Processo Civil - 218 a 232 – Dos prazos",
"Código de Processo Civil - 233 a 235 – Da verificação dos prazos e das penalidades",
"Código de Processo Civil - 236 a 237 – Disposições Gerais – da comunicação dos atos processuais",
"Código de Processo Civil - 238 a 259 – Da citação",
"Código de Processo Civil - 260 a 268 – Das cartas",
"Código de Processo Civil - 269 a 275 – Das intimações",
"Código de Processo Civil - Artigos 294 a 311",
"Código de Processo Civil - 294 a 299 – Disposições gerais – Tutela Provisória",
"Código de Processo Civil - 300 a 302 – Disposições gerais – Tutela de Urgência",
"Código de Processo Civil - 303 e 304 – Do procedimento da Tutela Antecipada Requerida em Caráter Antecedente",
"Código de Processo Civil - 305 a 310 – Do procedimento da tutela cautelar requerida em caráter antecedente",
"Código de Processo Civil - 311 – Tutela de evidência",
"Código de Processo Civil - 318 – Disposições Gerais – Do Procedimento Comum",
"Código de Processo Civil - 319 a 321 – Dos Requisitos da Petição Inicial",
"Código de Processo Civil - 322 a 329 – Do Pedido",
"Código de Processo Civil - 330 a 331 – Do Indeferimento da Petição Inicial",
"Código de Processo Civil - 332 – Da Improcedência Liminar do Pedido",
"Código de Processo Civil - 334 – Da Audiência de Conciliação ou de Mediação",
"Código de Processo Civil - 335 a 342 – Da Contestação",
"Código de Processo Civil - 343 – Da Reconvenção",
"Código de Processo Civil - 344 a 346 – Da Revelia",
"Código de Processo Civil - 347 – Das Providências Preliminares e do Saneamento",
"Código de Processo Civil - 348 e 349 – Da Não Incidência dos Efeitos da Revelia",
"Código de Processo Civil - 350 – Do Fato Impeditivo, Modificativo ou Extintivo do Direito do Autor",
"Código de Processo Civil - 351 a 353 – Das Alegações do Réu",
"Código de Processo Civil - 354 – Da Extinção do Processo",
"Código de Processo Civil - 355 – Do Julgamento Antecipado do Mérito",
"Código de Processo Civil - 356 – Do Julgamento Antecipado Parcial do Mérito",
"Código de Processo Civil - 357 – Do Saneamento e da Organização do Processo",
"Código de Processo Civil - 358 a 368 – Da Audiência de Instrução e Julgamento",
"Código de Processo Civil - 369 a 380 – Disposições Gerais – Das Provas",
"Código de Processo Civil - 381 a 383 – Da Produção Antecipada da Prova",
"Código de Processo Civil - 384 – Da Ata Notarial",
"Código de Processo Civil - 385 a 388 – Do Depoimento Pessoal",
"Código de Processo Civil - 389 a 395 – Da Confissão",
"Código de Processo Civil - 396 a 404 – Da Exibição de Documento ou Coisa",
"Código de Processo Civil - 405 a 429 – Da Força Probante dos Documentos",
"Código de Processo Civil - 430 a 433 – Da Arguição de Falsidade",
"Código de Processo Civil - 434 a 438 – Da Produção da Prova Documental",
"Código de Processo Civil - 439 a 441 – Dos Documentos Eletrônicos",
"Código de Processo Civil - 442 a 449 – Da Admissibilidade e do Valor da Prova Testemunhal",
"Código de Processo Civil - 450 a 463 – Da Produção da Prova Testemunhal",
"Código de Processo Civil - 464 a 480 – Da Prova Pericial",
"Código de Processo Civil - 481 a 484 – Da Inspeção Judicial",
"Código de Processo Civil - 485 a 488 – Disposições Gerais – Da Sentença e da Coisa Julgada",
"Código de Processo Civil - 489 a 495 – Dos Elementos e dos Efeitos da Sentença",
"Código de Processo Civil - 496 – Da Remessa Necessária",
"Código de Processo Civil - 497 a 501 – Do Julgamento das Ações Relativas às Prestações de Fazer, de Não Fazer e de Entregar Coisa",
"Código de Processo Civil - 502 a 508 – Da Coisa Julgada",
"Código de Processo Civil - 509 a 512 – Da Liquidação de Sentença",
"Código de Processo Civil - 513 a 519 – Disposições Gerais – Do Cumprimento de Sentença",
"Código de Processo Civil - 520 a 522 – Do Cumprimento Provisório da Sentença que Reconhece a Exigibilidade de Obrigação de Pagar Quantia Certa",
"Código de Processo Civil - 523 a 527 – Do Cumprimento de Sentença que Reconhece a Exigibilidade de Obrigação de Pagar Quantia Certa",
"Código de Processo Civil - 528 a 533 – Do Cumprimento de Sentença que Reconheça a Exigibilidade de Obrigação de Prestar Alimentos",
"Código de Processo Civil - 534 e 535 – Do Cumprimento de Sentença que Reconheça a Exigibilidade de Obrigação de Pagar Quantia Certa pela Fazenda Pública",
"Código de Processo Civil - 536 e 537 – Do Cumprimento de Sentença que Reconheça a Exigibilidade de Obrigação de Fazer ou de Não Fazer",
"Código de Processo Civil - 538 – Do Cumprimento de Sentença que Reconheça a Exigibilidade de Obrigação de Entregar Coisa",
"Código de Processo Civil - Artigos 994 a 1026",
"Código de Processo Civil - 994 a 1.008 – Disposições Gerais – Dos Recursos",
"Código de Processo Civil - 1.009 a 1.014 – Da Apelação",
"Código de Processo Civil - 1.015 a 1.020 – Do Agravo de Instrumento",
"Código de Processo Civil - 1.021 – Do Agravo Interno",
"Código de Processo Civil - 1.022 a 1.026 – Dos Embargos de Declaração",
"Lei n.º 9.099 de 26.09.1995 – Juizados Especiais Cíveis",
"Código de Processo Civil - Artigos 3º ao 19",
"Código de Processo Civil - 3º e 4º - Da Competência",
"Código de Processo Civil - 5º a 7º - Do Juiz, dos Conciliadores e dos Juízes Leigos",
"Código de Processo Civil - 8º a 11 – Das Partes",
"Código de Processo Civil - 12 e 13 – Dos atos processuais",
"Código de Processo Civil - 14 a 17 – Do pedido",
"Código de Processo Civil - 18 e 19 – Das citações e intimações",
"Lei n.º 12.153 de 22.12.2009 – Juizados Especiais da Fazenda Pública no âmbito dos Estados, do Distrito Federal, dos Territórios e dos Municípios. (art. 1º ao 28).",
"Direito Constitucional - Constituição Federal - Título II",
"Direito Constitucional - Constituição Federal - Título III",
"Direito Administrativo - Estatuto dos Funcionários Públicos Civis do Estado de São Paulo (Lei n.º 10.261/68)",
"Direito Administrativo - Artigos 239 a 323",
"Direito Administrativo - Lei Federal n.º 8.429/92 (Lei de Improbidade Administrativa) (art. 1º ao 25)",
"Normas da Corregedoria Geral da Justiça - Capítulo I",
"Normas da Corregedoria Geral da Justiça - Capítulo II",
"Normas da Corregedoria Geral da Justiça - Capítulo III",
"Normas da Corregedoria Geral da Justiça - Capítulo XI",
"Matemática - Operações com números reais.",
"Matemática - Mínimo múltiplo comum e máximo divisor comum.",
"Matemática - Razão e proporção.",
"Matemática - Porcentagem.",
"Matemática - Regra de três simples e composta.",
"Matemática - Média aritmética simples e ponderada.",
"Matemática - Juros simples.",
"Matemática - Equação do 1.º e 2.º graus.",
"Matemática - Sistema de equações do 1.º grau.",
"Matemática - Relação entre grandezas: tabelas e gráficos.",
"Matemática - Sistemas de medidas usuais.",
"Matemática - Noções de geometria: forma, perímetro, área, volume, ângulo, teorema de Pitágoras.",
"Matemática - Resolução de situações-problema.",
"MS-Windows 10 ou Superior - Conceito de pastas, diretórios e arquivos.",
"MS-Windows 10 ou Superior - Atalhos.",
"MS-Windows 10 ou Superior - Área de trabalho.",
"MS-Windows 10 ou Superior - Área de transferência.",
"MS-Windows 10 ou Superior - Manipulação de arquivos e pastas.",
"MS-Windows 10 ou Superior - Uso dos menus, programas e aplicativos.",
"MS-Word - Estrutura básica dos documentos.",
"MS-Word - Edição e formatação de textos.",
"MS-Word - Cabeçalhos.",
"MS-Word - Parágrafos.",
"MS-Word - Fontes.",
"MS-Word - Colunas.",
"MS-Word - Marcadores simbólicos e numéricos.",
"MS-Word - Tabelas.",
"MS-Word - Impressão.",
"MS-Word - Controle de quebras e numeração de páginas.",
"MS-Word - Legendas.",
"MS-Word - Índices.",
"MS-Word - Inserção de objetos.",
"MS-Word - Campos predefinidos.",
"MS-Word - Caixas de texto.",
"MS-Excel - Estrutura básica das planilhas.",
"MS-Excel - Conceitos de células, linhas, colunas e pastas.",
"MS-Excel - Gráficos.",
"MS-Excel - Elaboração de tabelas e gráficos.",
"MS-Excel - Uso de fórmulas, funções e macros.",
"MS-Excel - Impressão.",
"MS-Excel - Inserção de objetos.",
"MS-Excel - Campos predefinidos.",
"MS-Excel - Controle de quebras e numeração de páginas.",
"MS-Excel - Obtenção de dados externos.",
"MS-Excel - Classificação de dados.",
"Correio Eletrônico - Uso de correio eletrônico.",
"Correio Eletrônico - Preparo e envio de mensagens.",
"Correio Eletrônico - Anexação de arquivos.",
"Correio Eletrônico - Internet.",
"Correio Eletrônico - Navegação na internet.",
"Correio Eletrônico - Conceitos de URL, links e sites.",
"Correio Eletrônico - Busca e impressão de páginas.",
"MS Teams - Chats.",
"MS Teams - Chamadas de áudio e vídeo.",
"MS Teams - Criação de grupos.",
"MS Teams - Trabalho em equipe: Word.",
"MS Teams - Trabalho em equipe: Excel.",
"MS Teams - Trabalho em equipe: PowerPoint.",
"MS Teams - Trabalho em equipe: SharePoint.",
"MS Teams - Trabalho em equipe: OneNote.",
"MS Teams - Agendamento de reuniões.",
"MS Teams - Gravação de reuniões.",
"OneDrive - Armazenamento de arquivos.",
"OneDrive - Compartilhamento de arquivos.",
            


            
            
        ],
        "enem": [
            "Matemática - Funções",
            "Matemática - Estatística",
            "Português - Leitura e Interpretação",
            "Química - Tabelas Periódicas",
            "Biologia - Ecologia",
            "Física - Cinemática"
        ]
    };

    function updateEditaisList() {
        const selecionado = document.getElementById('edital-select').value;
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = ''; // Limpa a lista de tarefas

        if (selecionado && editais[selecionado]) {
            editais[selecionado].forEach(tema => {
                const taskItem = createEditableTaskElement(tema);
                taskList.appendChild(taskItem);
            });
        }
    }

    document.getElementById('edital-select').addEventListener('change', updateEditaisList);

    // Evento de arrastar e soltar para adicionar um tema da lista de editais
    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    taskList.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (draggingItem) {
            const name = draggingItem.querySelector('span').textContent;
            if (taskInput.value.trim() !== name) {
                addTask(name, 'low');
                draggingItem.remove(); // Remove o item da lista de editais
                saveTasks();
                saveWeeklyTasks();
            }
        }
    });