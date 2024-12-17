const cors = require('cors');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');



 // Permite requisições de qualquer origem


const app = express();
const port = 3000;

app.use(cors()); 



// Usando body-parser para interpretar JSON nas requisições
app.use(bodyParser.json());


require('dotenv').config();

// Definindo a senha de administrador
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; 


// Verifique se a senha está sendo carregada corretamente


// Caminho para o arquivo onde os dados serão armazenados
const dataFile = './raffleData.json';

// Função para carregar os dados do arquivo
function loadData() {
    if (fs.existsSync(dataFile)) {
        const rawData = fs.readFileSync(dataFile);
        return JSON.parse(rawData);
    }
    return {};
}

// Função para salvar os dados no arquivo
function saveData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Endpoint de autenticação do admin
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    console.log('Senha recebida:', password); // Log para ver o valor da senha recebida
    
    if (password === process.env.ADMIN_PASSWORD) {
        return res.json({ message: 'Autenticação bem-sucedida' });
    } else {
        console.log('Senha incorreta');
        return res.status(401).json({ message: 'Senha incorreta' });
    }
});


// Endpoint para carregar todos os números
app.get('/api/numbers', (req, res) => {
    try {
        const data = loadData();
        res.json(Object.keys(data).map((key) => ({
            number: key,
            ...data[key],
        })));
    } catch (error) {
        res.status(500).send('Erro ao carregar os dados');
    }
});

// Endpoint para atualizar informações de um número específico
app.put('/api/numbers/:number', (req, res) => {
    const { number } = req.params;
    const { selected, buyer, paid } = req.body;

    if (!number || !selected || !buyer || paid === undefined) {
        return res.status(400).send('Dados inválidos');
    }

    try {
        const data = loadData();
        data[number] = { selected, buyer, paid };
        saveData(data);
        res.send('Dados atualizados com sucesso');
    } catch (error) {
        res.status(500).send('Erro ao salvar os dados');
    }
});

// Endpoint para marcar um número como pago ou não pago
app.put('/api/numbers/:number/toggle-paid', (req, res) => {
    const { number } = req.params;

    try {
        const data = loadData();
        if (!data[number]) {
            return res.status(404).send('Número não encontrado');
        }
        data[number].paid = !data[number].paid;
        saveData(data);
        res.json({ message: `Status de pagamento de ${number} atualizado`, paid: data[number].paid });
    } catch (error) {
        res.status(500).send('Erro ao atualizar o status de pagamento');
    }
});

// Endpoint para editar o comprador de um número
app.put('/api/numbers/:number/edit-buyer', (req, res) => {
    const { number } = req.params;
    const { buyer } = req.body;

    if (!buyer || !buyer.trim()) {
        return res.status(400).send('Nome do comprador inválido');
    }

    try {
        const data = loadData();
        if (!data[number]) {
            return res.status(404).send('Número não encontrado');
        }
        data[number].buyer = buyer.trim();
        saveData(data);
        res.json({ message: `Comprador do número ${number} atualizado`, buyer: data[number].buyer });
    } catch (error) {
        res.status(500).send('Erro ao editar o comprador');
    }
});

// Endpoint para deletar um comprador de um número
app.delete('/api/numbers/:number/delete-buyer', (req, res) => {
    const { number } = req.params;

    try {
        const data = loadData();
        if (!data[number]) {
            return res.status(404).send('Número não encontrado');
        }
        data[number] = {
            selected: false,
            buyer: '',
            paid: false
        };
        saveData(data);
        res.json({ message: `Comprador do número ${number} excluído` });
    } catch (error) {
        res.status(500).send('Erro ao excluir comprador');
    }
});

// Endpoint para apagar todos os dados da rifa
app.delete('/api/numbers/clear', (req, res) => {
    try {
        if (fs.existsSync(dataFile)) {
            fs.unlinkSync(dataFile);
        }
        res.send('Todos os dados foram apagados com sucesso');
    } catch (error) {
        res.status(500).send('Erro ao limpar os dados');
    }
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`API rodando na http://localhost:${port}`);
});
