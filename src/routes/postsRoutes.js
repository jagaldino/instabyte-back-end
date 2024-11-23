// Importa o módulo Express para criar a aplicação web
import express from "express";

// Importa o módulo Multer para lidar com uploads de arquivos
import multer from "multer";

import cors from "cors"
// Importa as funções listarPosts, postarNovoPost e uploadImagem do arquivo postsController.js
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost} from "../controllers/postsController.js";


const corsOptions = {
  origin: "http://localhost:8000",
  optionsSucessStatus: 200
}


// Configura o armazenamento para uploads em disco
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define o diretório de destino para os uploads (pasta 'uploads/')
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Define o nome do arquivo como o nome original
    cb(null, file.originalname);
  },
});

// Cria uma instância do Multer utilizando a configuração de armazenamento
const upload = multer({ storage });

// Define as rotas da aplicação
const routes = (app) => {
  // Habilita o parseamento de dados JSON na requisição
  app.use(express.json());
  app.use(cors(corsOptions))

  // Rota GET para listar posts (implementada em postsController.js)
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post (implementada em postsController.js)
  app.post("/posts", postarNovoPost);

  // Rota POST para upload de imagem com o middleware 'upload.single("imagem")' 
  // e a função 'uploadImagem' como callback (implementada em postsController.js)
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost)
};


// Exporta a função 'routes' como padrão para ser utilizada em outros arquivos
export default routes;