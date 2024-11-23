import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModels.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

/**
 * Função assíncrona para listar todos os posts.
 * 
 * @param {Object} req - Objeto de requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 */
export async function listarPosts(req, res) {
  // Chama a função getTodosPosts do modelo para buscar todos os posts.
  const posts = await getTodosPosts();

  // Envia uma resposta HTTP com status 200 (sucesso) e os posts no formato JSON.
  res.status(200).json(posts);
}

/**
 * Função assíncrona para criar um novo post.
 * 
 * @param {Object} req - Objeto de requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 */
export async function postarNovoPost(req, res) {
  // Obtém os dados do novo post a partir do corpo da requisição.
  const novoPost = req.body;

  // Tenta criar o novo post utilizando a função criarPost do modelo.
  try {
    const postCriado = await criarPost(novoPost);

    // Envia uma resposta HTTP com status 200 (sucesso) e o post criado no formato JSON.
    res.status(200).json(postCriado);
  } catch (erro) {
    // Caso ocorra um erro, loga a mensagem de erro no console e envia uma resposta com status 500 (erro interno do servidor).
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

/**
 * Função assíncrona para fazer upload de uma imagem e criar um novo post.
 * 
 * @param {Object} req - Objeto de requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 */
export async function uploadImagem(req, res) {
  // Cria um novo objeto de post com a descrição, URL da imagem e texto alternativo.
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };

  // Tenta criar o novo post e renomear o arquivo da imagem.
  try {
    const postCriado = await criarPost(novoPost);

    // Gera um novo nome para o arquivo da imagem com base no ID do post criado.
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;

    // Renomeia o arquivo da imagem para o novo nome.
    fs.renameSync(req.file.path, imagemAtualizada);

    // Envia uma resposta HTTP com status 200 (sucesso) e o post criado no formato JSON.
    res.status(200).json(postCriado);
  } catch (erro) {
    // Caso ocorra um erro, loga a mensagem de erro no console e envia uma resposta com status 500 (erro interno do servidor).
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

export async function atualizarNovoPost(req, res) {
  // Cria um novo objeto de post com a descrição, URL da imagem e texto alternativo.
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`
  try {
    
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
    const descricao = await gerarDescricaoComGemini(imgBuffer)
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    const postCriado = await atualizarPost(id, post);
    res.status(200).json(postCriado)
  } catch (erro) {
    // Caso ocorra um erro, loga a mensagem de erro no console e envia uma resposta com status 500 (erro interno do servidor).
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}