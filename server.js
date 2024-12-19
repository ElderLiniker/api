const cors = require('cors');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');


const mongoose = require('mongoose');



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
const Number = require('./models/Number');

app.get('/api/numbers', (req, res) => {
  Number.find()  // Busca todos os números
    .then((numbers) => {
      res.json(numbers);
    })
    .catch((error) => {
      res.status(500).send('Erro ao carregar os dados');
    });
});


// Endpoint para atualizar informações de um número específico
app.put('/api/numbers/:number', async (req, res) => {
    const { number } = req.params;
    const { selected, buyer, paid } = req.body;
  
    if (!number || selected === undefined || !buyer || paid === undefined) {
      return res.status(400).send('Dados inválidos');
    }
  
    try {
      const numberRecord = await Number.findOne({ number });
  
      if (!numberRecord) {
        return res.status(404).send('Número não encontrado');
      }
  
      numberRecord.selected = selected;
      numberRecord.buyer = buyer;
      numberRecord.paid = paid;
  
      await numberRecord.save();
      res.send('Dados atualizados com sucesso');
    } catch (error) {
      res.status(500).send('Erro ao salvar os dados');
    }
  });
  


// Endpoint para marcar um número como pago ou não pago
app.put('/api/numbers/:number/toggle-paid', (req, res) => {
    const { number } = req.params;
  
    Number.findOne({ number })
      .then((data) => {
        if (!data) {
          return res.status(404).send('Número não encontrado');
        }
  
        data.paid = !data.paid;
        return data.save();
      })
      .then((updatedData) => {
        res.json({
          message: `Status de pagamento de ${number} atualizado`,
          paid: updatedData.paid,
        });
      })
      .catch((error) => {
        res.status(500).send('Erro ao atualizar o status de pagamento');
      });
  });

  app.put('/api/numbers/:number/toggle-paid', (req, res) => {
  const { number } = req.params;

  Number.findOne({ number })
    .then((data) => {
      if (!data) {
        return res.status(404).send('Número não encontrado');
      }

      data.paid = !data.paid;
      return data.save();
    })
    .then((updatedData) => {
      res.json({
        message: `Status de pagamento de ${number} atualizado`,
        paid: updatedData.paid,
      });
    })
    .catch((error) => {
      res.status(500).send('Erro ao atualizar o status de pagamento');
    });
});
app.put('/api/numbers/:number/edit-buyer', (req, res) => {
    const { number } = req.params;
    const { buyer } = req.body;
  
    if (!buyer || !buyer.trim()) {
      return res.status(400).send('Nome do comprador inválido');
    }
  
    Number.findOne({ number })
      .then((data) => {
        if (!data) {
          return res.status(404).send('Número não encontrado');
        }
  
        data.buyer = buyer.trim();
        return data.save();
      })
      .then((updatedData) => {
        res.json({
          message: `Comprador do número ${number} atualizado`,
          buyer: updatedData.buyer,
        });
      })
      .catch((error) => {
        res.status(500).send('Erro ao editar o comprador');
      });
  });
  app.put('/api/numbers/:number/edit-buyer', (req, res) => {
    const { number } = req.params;
    const { buyer } = req.body;
  
    if (!buyer || !buyer.trim()) {
      return res.status(400).send('Nome do comprador inválido');
    }
  
    Number.findOne({ number })
      .then((data) => {
        if (!data) {
          return res.status(404).send('Número não encontrado');
        }
  
        data.buyer = buyer.trim();
        return data.save();
      })
      .then((updatedData) => {
        res.json({
          message: `Comprador do número ${number} atualizado`,
          buyer: updatedData.buyer,
        });
      })
      .catch((error) => {
        res.status(500).send('Erro ao editar o comprador');
      });
  });
    
  app.put('/api/numbers/:number/edit-buyer', (req, res) => {
    const { number } = req.params;
    const { buyer } = req.body;
  
    if (!buyer || !buyer.trim()) {
      return res.status(400).send('Nome do comprador inválido');
    }
  
    Number.findOne({ number })
      .then((data) => {
        if (!data) {
          return res.status(404).send('Número não encontrado');
        }
  
        data.buyer = buyer.trim();
        return data.save();
      })
      .then((updatedData) => {
        res.json({
          message: `Comprador do número ${number} atualizado`,
          buyer: updatedData.buyer,
        });
      })
      .catch((error) => {
        res.status(500).send('Erro ao editar o comprador');
      });
  });
  

// Iniciando o servidor
app.listen(port, () => {
    console.log(`API rodando na http://localhost:${port}`);
});




mongoose.connect('mongodb://localhost:27018/yourDatabase')
    .then(() => {
        console.log("Conectado ao MongoDB com sucesso");
    })
    .catch((error) => {
        console.error("Erro ao conectar no MongoDB:", error);
    });


