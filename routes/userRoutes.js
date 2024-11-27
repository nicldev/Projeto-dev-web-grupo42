const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// Registro de usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar se a senha foi fornecida
  if (!password || password.trim() === '') {
    return res.status(400).send({ message: 'Senha não fornecida ou vazia!' });
  }

  try {
    // Verificar se o email já está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email já registrado!' });
    }

    // Gerar o hash da senha com 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de salt rounds

    // Criar o usuário com a senha criptografada
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).send({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao criar o usuário!' });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ message: 'Usuário não encontrado' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).send({ message: 'Senha inválida' });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
  res.status(200).send({ token });
});

// Lista de usuários (rota protegida)
router.get('/users', authenticateToken, async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
});

// Excluir usuário (rota protegida)
router.delete('/users/:id', authenticateToken, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send({ message: 'Usuário não encontrado' });
  res.status(200).send({ message: 'Usuário excluído com sucesso!' });
});

// Excluir usuário duplicado por email (em rota temporária)
router.delete('/delete-duplicate-users', async (req, res) => {
  const email = req.query.email;
  try {
    const result = await User.deleteMany({ email });
    res.status(200).send({ message: `${result.deletedCount} usuário(s) excluído(s)` });
  } catch (err) {
    res.status(500).send({ message: 'Erro ao excluir usuários duplicados', error: err });
  }
});

// Atualizar usuário (rota protegida)
router.put('/users/:id', authenticateToken, async (req, res) => {
  const { name, email, password } = req.body;
  
  // Verificar se o usuário existe
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send({ message: 'Usuário não encontrado' });

  // Atualizar os campos fornecidos
  if (name) user.name = name;
  if (email) user.email = email;

  // Se a senha for fornecida, ela será atualizada
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }

  try {
    await user.save();  // Salva o usuário com as alterações
    res.status(200).send({ message: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao atualizar o usuário!' });
  }
});

module.exports = router;
