import express from "express"
import multer from "multer";
import cors from "cors";
import { getPosts, criarNovoPost, getPostById, uploadImagem, atualizaNovoPost } from "../controllers/posts.controller.js" 

const router = express.Router()

// Configuração do multer no windows
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
// const upload = multer({ dest: "./uploads" , storage})
// const upload = multer({ dest: "./uploads" , }) no linux
// Cria uma instância do middleware Multer
const upload = multer({ storage: storage });

// http://localhost:3000/posts
router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", criarNovoPost);
router.post("/upload", upload.single("imagem"), uploadImagem);
router.put("/upload/:id", atualizaNovoPost);

export default router

// function getPostById(id) {
//   return posts.find((post) => post.id === id);
// }
/*
Assume que id já é um número e não realiza a conversão.
Se você precisa do próprio objeto: Use a função modificada com find. Isso é mais comum quando você quer obter informações do objeto ou passá-lo para outras funções.
find: Percorre o array e retorna o primeiro elemento que satisfaz a condição fornecida na função de callback. Se nenhum elemento for encontrado, retorna undefined.
*/